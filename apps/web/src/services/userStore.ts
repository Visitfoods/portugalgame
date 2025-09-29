import { AuthService, getCachedUser, setCachedUser } from './auth';
import { getUserProfile, type UserProfile } from './user';
import { ensureFirestoreOnline } from '../lib/firebase';

export interface UserState {
  uid: string;
  email?: string;
  username?: string;
  displayName?: string;
}

type Subscriber = (u: UserState | null) => void;

class UserStore {
  private current: UserState | null = null;
  private subs = new Set<Subscriber>();
  private initialized = false;

  getUser(): UserState | null {
    return this.current || getCachedUser();
  }

  subscribe(cb: Subscriber): () => void {
    this.subs.add(cb);
    return () => this.subs.delete(cb);
  }

  private emit() {
    for (const cb of this.subs) cb(this.current);
  }

  private set(u: UserState | null) {
    this.current = u;
    setCachedUser(u as any);
    this.emit();
  }

  async setProfile(profile: UserProfile) {
    this.set({ uid: profile.uid, email: profile.email, username: profile.username, displayName: profile.displayName });
  }

  async refresh(uid: string): Promise<UserState | null> {
    try {
      await ensureFirestoreOnline();
    } catch {}
    try {
      const prof = await getUserProfile(uid);
      if (prof) {
        this.set({ uid: prof.uid, email: prof.email, username: prof.username, displayName: prof.displayName });
        return this.current;
      }
    } catch {}
    return this.getUser();
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    try { await ensureFirestoreOnline(); } catch {}

    AuthService.onAuth(async (u) => {
      if (!u) { this.set(null); return; }
      const existing = this.getUser();
      let username = existing?.username;
      let displayName = existing?.displayName || (u as any).displayName || undefined;
      if (!username) {
        try {
          const prof = await getUserProfile(u.uid);
          if (prof?.username) { username = prof.username; displayName = prof.displayName || displayName; }
        } catch {}
      }
      this.set({ uid: u.uid, email: u.email || undefined, username, displayName });
    });

    try {
      const redirectUser = await AuthService.consumeGoogleRedirect();
      if (redirectUser) {
        await this.refresh(redirectUser.uid);
        return;
      }
    } catch {}
  }
}

export const userStore = new UserStore();


