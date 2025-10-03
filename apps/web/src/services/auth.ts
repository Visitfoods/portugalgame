import { EmailLink, getFirebaseAuth, signInWithGoogleSmart, consumeGoogleRedirect } from '../lib/firebase';
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
    await EmailLink.send(email, continueUrl);
  },
  async completeMagicLink(url?: string, email?: string) {
    return await EmailLink.complete(url, email);
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
