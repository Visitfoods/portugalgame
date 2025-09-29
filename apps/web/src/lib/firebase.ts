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
} from 'firebase/auth';
import { getFirestore, Firestore, initializeFirestore, enableNetwork, setLogLevel } from 'firebase/firestore';

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
    });
    // Reduce noisy SDK logs in console
    try { setLogLevel('error'); } catch {}
  }
  return db!;
}

export async function ensureFirestoreOnline(): Promise<void> {
  try {
    await enableNetwork(getDb());
  } catch {}
}

export const EmailLink = {
  isLink(url?: string) {
    return isSignInWithEmailLink(getFirebaseAuth(), url ?? window.location.href);
  },
  async send(email: string, url?: string) {
    const targetUrl = url || `${window.location.origin}/`;
    const actionCodeSettings: any = {
      url: targetUrl,
      handleCodeInApp: true,
    };
    const dyn = (import.meta as any)?.env?.VITE_FIREBASE_DYNAMIC_LINK_DOMAIN as string | undefined;
    if (dyn) actionCodeSettings.dynamicLinkDomain = dyn;
    await sendSignInLinkToEmail(getFirebaseAuth(), email, actionCodeSettings);
    try { localStorage.setItem('ab-login-email', email); } catch {}
  },
  async complete(url?: string) {
    const auth = getFirebaseAuth();
    const href = url ?? window.location.href;
    let email = '';
    try { email = localStorage.getItem('ab-login-email') || ''; } catch {}
    if (!email) {
      email = window.prompt('Confirma o teu e‑mail para concluir login:') || '';
    }
    const cred = await signInWithEmailLink(auth, email, href);
    try { localStorage.removeItem('ab-login-email'); } catch {}
    return cred.user;
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


