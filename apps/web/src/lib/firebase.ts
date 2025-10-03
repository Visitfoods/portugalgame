import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  onAuthStateChanged,
  User,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  ActionCodeSettings,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  initializeFirestore,
  enableNetwork,
  setLogLevel,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    const existing = getApps();
    if (existing.length) {
      app = existing[0]!;
    } else {
      app = initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      });
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth!;
}

export function getDb(): Firestore {
  if (!db) {
    // Improve compatibility in restrictive networks/proxies during dev
    db = initializeFirestore(getFirebaseApp(), {
      experimentalForceLongPolling: true,
      // Add more resilient settings for blocked connections
      ignoreUndefinedProperties: true,
    });
    // Reduce noisy SDK logs in console
    try { setLogLevel('error'); } catch {}
  }
  return db!;
}

export async function ensureFirestoreOnline(): Promise<void> {
  try {
    await enableNetwork(getDb());
  } catch (error: any) {
    // Re-throw specific connection errors for better handling
    if (error?.code === 'unavailable' || error?.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
      throw error;
    }
    // For other errors, just log and continue
    console.warn('Firestore connection warning:', error?.message || error);
  }
}

const MAGIC_LINK_EMAIL_CACHE_KEY = 'ab-magic-link-email';
const MAGIC_LINK_CACHE_MAX_AGE_MS = 30 * 60 * 1000;
const MAGIC_LINK_DEFAULT_PATH = '/auth-complete';

type EmailCacheRecord = {
  value: string;
  hint: string;
  ts: number;
};

function safeStorage(kind: 'localStorage' | 'sessionStorage'): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    return window[kind];
  } catch {
    return null;
  }
}

function encodeEmail(value: string): string {
  try {
    return btoa(encodeURIComponent(value));
  } catch {
    return value;
  }
}

function decodeEmail(value: string): string {
  if (!value) return '';
  try {
    return decodeURIComponent(atob(value));
  } catch {
    return value;
  }
}

function maskEmail(value: string): string {
  const [user, domain] = value.split('@');
  if (!user || !domain) return value;
  const visible = user.slice(0, Math.min(2, user.length));
  const maskLength = Math.max(user.length - visible.length, 2);
  const masked = '*'.repeat(maskLength);
  return `${visible}${masked}@${domain}`;
}

function extractEmailDomain(value: string): string {
  const parts = value.split('@');
  return parts.length > 1 ? parts[1]!.toLowerCase() : '';
}

function persistMagicLinkEmail(email: string): void {
  const trimmed = email.trim();
  if (!trimmed) return;
  const record: EmailCacheRecord = { value: encodeEmail(trimmed), hint: maskEmail(trimmed), ts: Date.now() };
  const serialized = JSON.stringify(record);
  const session = safeStorage('sessionStorage');
  if (session) {
    try { session.setItem(MAGIC_LINK_EMAIL_CACHE_KEY, serialized); } catch {}
  }
  const local = safeStorage('localStorage');
  if (local) {
    try { local.setItem(MAGIC_LINK_EMAIL_CACHE_KEY, serialized); } catch {}
  }
}

function readMagicLinkEmail(): (EmailCacheRecord & { email: string }) | null {
  const storageSources = [safeStorage('sessionStorage'), safeStorage('localStorage')];
  for (const storage of storageSources) {
    if (!storage) continue;
    let raw: string | null = null;
    try { raw = storage.getItem(MAGIC_LINK_EMAIL_CACHE_KEY); } catch {}
    if (!raw) continue;
    try {
      const record = JSON.parse(raw) as EmailCacheRecord;
      const age = Date.now() - record.ts;
      if (age > MAGIC_LINK_CACHE_MAX_AGE_MS) {
        try { storage.removeItem(MAGIC_LINK_EMAIL_CACHE_KEY); } catch {}
        continue;
      }
      const email = decodeEmail(record.value);
      if (!email) continue;
      return { ...record, email };
    } catch {
      try { storage.removeItem(MAGIC_LINK_EMAIL_CACHE_KEY); } catch {}
    }
  }
  return null;
}

function clearMagicLinkEmail(): void {
  const session = safeStorage('sessionStorage');
  if (session) {
    try { session.removeItem(MAGIC_LINK_EMAIL_CACHE_KEY); } catch {}
  }
  const local = safeStorage('localStorage');
  if (local) {
    try { local.removeItem(MAGIC_LINK_EMAIL_CACHE_KEY); } catch {}
  }
}

function createMagicLinkError(code: string, message?: string, extra?: Record<string, unknown>): Error {
  const err = new Error(message || code);
  (err as any).code = code;
  if (extra) {
    Object.assign(err as any, extra);
  }
  return err;
}

function resolveContinueUrl(explicit?: string): string {
  const env = (import.meta as any)?.env ?? {};
  const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://localhost:5173';
  const candidate = (explicit || env?.VITE_AUTH_CONTINUE_URL || `${fallbackOrigin}${MAGIC_LINK_DEFAULT_PATH}`) as string;
  let resolved: URL;
  try {
    resolved = new URL(candidate);
  } catch {
    throw createMagicLinkError('invalid-continue-url', `Magic link continue URL "${candidate}" is invalid.`);
  }
  if (!resolved.pathname || resolved.pathname === '/') {
    resolved.pathname = MAGIC_LINK_DEFAULT_PATH;
  }
  const host = resolved.hostname;
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
  if (!isLocalhost && resolved.protocol !== 'https:') {
    throw createMagicLinkError('invalid-continue-url', 'Magic link continue URL must use HTTPS outside localhost.', { provided: candidate });
  }
  const allowedRaw = (env?.VITE_AUTH_ALLOWED_HOSTS as string | undefined)?.split(',').map((value) => value.trim()).filter(Boolean) ?? [];
  if (allowedRaw.length) {
    const hostLower = host.toLowerCase();
    const match = allowedRaw.some((allowed) => {
      const allowedLower = allowed.toLowerCase();
      return hostLower === allowedLower || hostLower.endsWith(`.${allowedLower}`);
    });
    if (!match) {
      throw createMagicLinkError('unauthorized-continue-host', `Host "${host}" is not in VITE_AUTH_ALLOWED_HOSTS.`, {
        provided: candidate,
        allowed: allowedRaw,
      });
    }
  }
  const appName = (env?.VITE_FIREBASE_ACTION_APP_NAME as string | undefined)?.trim();
  if (appName) {
    resolved.searchParams.set('app', appName);
  }
  resolved.searchParams.set('mode', 'magic-link');
  return resolved.toString();
}

function buildActionCodeSettings(targetUrl: string): ActionCodeSettings {
  const env = (import.meta as any)?.env ?? {};
  const settings: ActionCodeSettings = {
    url: targetUrl,
    handleCodeInApp: true,
  };
  const dynamicDomain = (env?.VITE_FIREBASE_DYNAMIC_LINK_DOMAIN as string | undefined)?.trim();
  if (dynamicDomain) settings.dynamicLinkDomain = dynamicDomain;
  const androidPackage = (env?.VITE_FIREBASE_ANDROID_PACKAGE as string | undefined)?.trim();
  if (androidPackage) {
    settings.android = {
      packageName: androidPackage,
      installApp: (env?.VITE_FIREBASE_ANDROID_INSTALL as string | undefined)?.toLowerCase() === 'true' || env?.VITE_FIREBASE_ANDROID_INSTALL === '1',
      minimumVersion: (env?.VITE_FIREBASE_ANDROID_MIN_VERSION as string | undefined)?.trim() || undefined,
    };
  }
  const iosBundle = (env?.VITE_FIREBASE_IOS_BUNDLE as string | undefined)?.trim();
  if (iosBundle) {
    settings.iOS = {
      bundleId: iosBundle,
    };
  }
  const iosAppStore = (env?.VITE_FIREBASE_IOS_APPSTORE_ID as string | undefined)?.trim();
  if (iosAppStore) {
    const url = new URL(targetUrl);
    url.searchParams.set('iosAppStoreId', iosAppStore);
    settings.url = url.toString();
  }
  return settings;
}

async function logMagicLinkEvent(event: string, payload: Record<string, unknown> = {}): Promise<void> {
  try {
    const colRef = collection(getDb(), 'magicLinkTelemetry');
    await addDoc(colRef, {
      event,
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.debug('[MagicLink] telemetry skipped', error);
  }
}

export function trackMagicLinkEvent(event: string, payload: Record<string, unknown> = {}): void {
  void logMagicLinkEvent(event, payload);
}

export const EmailLink = {
  isLink(url?: string) {
    return isSignInWithEmailLink(getFirebaseAuth(), url ?? window.location.href);
  },
  getContinueUrl(url?: string) {
    return resolveContinueUrl(url);
  },
  cacheEmail(email: string) {
    persistMagicLinkEmail(email);
  },
  getCachedEmailInfo(): { hint: string; ageMs: number } | null {
    const cached = readMagicLinkEmail();
    if (!cached) return null;
    return {
      hint: cached.hint,
      ageMs: Math.max(Date.now() - cached.ts, 0),
    };
  },
  clearCachedEmail() {
    clearMagicLinkEmail();
  },
  async send(email: string, url?: string) {
    const trimmed = email.trim();
    if (!trimmed) {
      throw createMagicLinkError('invalid-email', 'Email required to send magic link.');
    }
    const targetUrl = resolveContinueUrl(url);
    const actionCodeSettings = buildActionCodeSettings(targetUrl);
    const startedAt = Date.now();
    const domain = extractEmailDomain(trimmed);
    trackMagicLinkEvent('magic_link_send_attempt', {
      emailDomain: domain,
      continueUrl: targetUrl,
    });
    try {
      await sendSignInLinkToEmail(getFirebaseAuth(), trimmed, actionCodeSettings);
      persistMagicLinkEmail(trimmed);
      trackMagicLinkEvent('magic_link_send_success', {
        emailDomain: domain,
        durationMs: Date.now() - startedAt,
        continueUrl: targetUrl,
      });
    } catch (error: any) {
      const code = error?.code || error?.message || 'unknown';
      trackMagicLinkEvent('magic_link_send_failure', {
        emailDomain: domain,
        continueUrl: targetUrl,
        code,
      });
      const mapped = error instanceof Error ? error : new Error(String(error));
      if (!(mapped as any).code) (mapped as any).code = code;
      throw mapped;
    }
  },
  async complete(url?: string, emailOverride?: string) {
    const auth = getFirebaseAuth();
    const href = url ?? window.location.href;
    const cached = readMagicLinkEmail();
    const email = (emailOverride || cached?.email || '').trim();
    if (!email) {
      trackMagicLinkEvent('magic_link_complete_missing_email', {
        hasHint: Boolean(cached?.hint),
      });
      throw createMagicLinkError('missing-email-for-magic-link', 'Precisas de indicar o email usado para pedir o link.', {
        hint: cached?.hint,
      });
    }
    // Refresh cache to extend TTL while user is interacting
    persistMagicLinkEmail(email);
    const startedAt = Date.now();
    const domain = extractEmailDomain(email);
    trackMagicLinkEvent('magic_link_complete_attempt', {
      emailDomain: domain,
    });
    try {
      const cred = await signInWithEmailLink(auth, email, href);
      clearMagicLinkEmail();
      trackMagicLinkEvent('magic_link_complete_success', {
        emailDomain: domain,
        durationMs: Date.now() - startedAt,
      });
      return cred.user;
    } catch (error: any) {
      const code = error?.code || error?.message || 'unknown';
      trackMagicLinkEvent('magic_link_complete_failure', {
        emailDomain: domain,
        code,
      });
      if (typeof code === 'string') {
        if (code.includes('invalid-action-code') || code.includes('expired-action-code')) {
          throw createMagicLinkError('expired-action-code', 'O link expirou ou já foi usado. Pede um novo e-mail.');
        }
        if (code.includes('invalid-email')) {
          throw createMagicLinkError('invalid-email', 'O email introduzido não corresponde ao link.');
        }
      }
      const mapped = error instanceof Error ? error : new Error(String(error));
      if (!(mapped as any).code) (mapped as any).code = code;
      throw mapped;
    }
  },
  onChange(cb: (user: User | null) => void) {
    return onAuthStateChanged(getFirebaseAuth(), cb);
  }
};

export async function signInWithGooglePopup(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(getFirebaseAuth(), provider);
  return cred.user;
}

export async function consumeGoogleRedirect(): Promise<User | null> {
  try {
    const auth = getFirebaseAuth();
    const res = await getRedirectResult(auth);
    return res?.user ?? null;
  } catch {
    return null;
  }
}


// Tries popup, falls back to redirect in environments where popups/cookies are blocked
export async function signInWithGoogleSmart(): Promise<User | null> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (e: any) {
    const code = e?.code || '';
    if (
      code.includes('popup-blocked') ||
      code.includes('popup-closed-by-user') ||
      code.includes('operation-not-supported-in-this-environment')
    ) {
      try {
        // Se precisar de redirect, primeiro garantir que estamos em /auth-complete
        // para que o redirect volte para um lugar que sabe processar o resultado
        const currentPath = typeof window !== 'undefined' ? new URL(window.location.href).pathname : '/';
        if (currentPath !== '/auth-complete') {
          // Navegar para /auth-complete antes de fazer o redirect
          if (typeof window !== 'undefined') {
            window.location.href = '/auth-complete?google-redirect=1';
            // Retornar null porque a página vai recarregar
            return null;
          }
        }
        
        await signInWithRedirect(auth, provider);
        // After redirect back, attempt to read the result
        const res = await getRedirectResult(auth).catch(() => null);
        return res?.user ?? null;
      } catch {
        return null;
      }
    }
    throw e;
  }
}
