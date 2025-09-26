import { EmailLink, getFirebaseAuth, signInWithGooglePopup } from '../lib/firebase';
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
  async sendMagicLink(email: string, completeUrl: string) {
    await EmailLink.send(email, completeUrl);
  },
  async completeMagicLink(url?: string) {
    const user = await EmailLink.complete(url);
    return user;
  },
  onAuth(cb: (user: User | null) => void) {
    return EmailLink.onChange(cb);
  },
  signOut() {
    return getFirebaseAuth().signOut();
  }
,\n  async signInWithGoogle() {\n    const user = await signInWithGooglePopup();\n    return user;\n  }\n};\n
