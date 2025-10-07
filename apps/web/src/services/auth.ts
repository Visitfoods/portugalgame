import { EmailLink, getFirebaseAuth, signInWithGoogleSmart, consumeGoogleRedirect } from '../lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import type { User } from 'firebase/auth';

export type AuthState = 'loading' | 'unauthenticated' | 'needsProfile' | 'authenticated';

export interface CachedUser {
  uid: string;
  email?: string;
  username?: string;
  displayName?: string;
}

const USER_CACHE_KEY = 'ab-user-cache';

export function getCachedUser(): CachedUser | null {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedUser;
  } catch {
    return null;
  }
}

export function setCachedUser(u: CachedUser | null): void {
  try {
    if (!u) localStorage.removeItem(USER_CACHE_KEY);
    else localStorage.setItem(USER_CACHE_KEY, JSON.stringify(u));
  } catch {}
}

export const AuthService = {
  isEmailLink(url?: string) {
    return EmailLink.isLink(url);
  },
  getContinueUrl(url?: string) {
    return EmailLink.getContinueUrl(url);
  },
  getMagicLinkEmailHint(): string | null {
    return EmailLink.getCachedEmailInfo()?.hint ?? null;
  },
  cacheMagicLinkEmail(email: string) {
    EmailLink.cacheEmail(email);
  },
  clearMagicLinkEmail() {
    EmailLink.clearCachedEmail();
  },
  async sendMagicLink(email: string, continueUrl?: string) {
    // Temporario: delegar no endpoint OTP enquanto mantemos compat anteriordom.
    await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).then(async (r) => {
      if (!r.ok) {
        let code = 'otp_request_failed';
        try {
          const body = await r.json();
          if (body?.error) code = body.error;
        } catch {}
        throw Object.assign(new Error(code), { code });
      }
    });
  },
  async completeMagicLink(url?: string, email?: string) {
    // Substituido por verifyOtp; mantemos assinatura para compat
    return null as any;
  },
  async verifyOtp(email: string, code: string) {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    let data: any = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }
    if (!res.ok) {
      const errCode = data?.error || 'otp_verify_failed';
      throw Object.assign(new Error(errCode), { code: errCode });
    }
    const auth = getFirebaseAuth();
    const cred = await signInWithCustomToken(auth, data.token);
    return cred.user;
  },
  onAuth(cb: (user: User | null) => void) {
    return EmailLink.onChange(cb);
  },
  signOut() {
    return getFirebaseAuth().signOut();
  },
  async signInWithGoogle() {
    const user = await signInWithGoogleSmart();
    return user;
  },
  async consumeGoogleRedirect() {
    return await consumeGoogleRedirect();
  }
};
