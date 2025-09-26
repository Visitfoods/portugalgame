import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink, onAuthStateChanged, User, Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

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
  if (!db) db = getFirestore(getFirebaseApp());
  return db!;
}

export const EmailLink = {
  isLink(url?: string) {
    return isSignInWithEmailLink(getFirebaseAuth(), url ?? window.location.href);
  },
  async send(email: string, url?: string) {
    const actionCodeSettings: any = {\n      url: (url || `${window.location.origin}/`),
      handleCodeInApp: true,
    };\n    const dyn = (import.meta as any)?.env?.VITE_FIREBASE_DYNAMIC_LINK_DOMAIN as string | undefined;\n    if (dyn) (actionCodeSettings as any).dynamicLinkDomain = dyn;\n    await sendSignInLinkToEmail(getFirebaseAuth(), email, actionCodeSettings);
    try { localStorage.setItem('ab-login-email', email); } catch {}}\n  },
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
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

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
  if (!db) db = getFirestore(getFirebaseApp());
  return db!;
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
