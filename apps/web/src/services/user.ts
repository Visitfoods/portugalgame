import { getDb } from '../lib/firebase';
import { collection, doc, getDocFromServer, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email?: string;
  username: string;
  displayName?: string;
  createdAt?: unknown;
  totalGames?: number;
  bestScore?: number;
}

const RESERVED = new Set(['admin','system','alvesbandeira','moderator']);
const reUsername = /^[a-zA-Z0-9_]{3,20}$/;

export function validateUsername(username: string): { ok: boolean; reason?: string } {
  if (!reUsername.test(username)) return { ok: false, reason: '3-20, letras/números/_' };
  if (RESERVED.has(username.toLowerCase())) return { ok: false, reason: 'reservado' };
  return { ok: true };
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const v = validateUsername(username);
  if (!v.ok) return false;
  const db = getDb();
  const usernamesRef = doc(db, 'usernames', username.toLowerCase());
  const snap = await getDocFromServer(usernamesRef);
  return !snap.exists();
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const db = getDb();
    const ref = doc(db, 'users', uid);
    const snap = await getDocFromServer(ref);
    return snap.exists() ? (snap.data() as UserProfile) : null;
  } catch (e: any) {
    console.warn('getUserProfile failed:', e?.code || e?.message || e);
    return null;
  }
}

export async function claimUsername(uid: string, email: string | undefined, username: string, displayName: string | undefined): Promise<UserProfile> {
  const valid = validateUsername(username);
  if (!valid.ok) throw new Error(valid.reason || 'username inválido');
  const db = getDb();
  const usernamesRef = doc(db, 'usernames', username.toLowerCase());
  const userRef = doc(db, 'users', uid);
  const batch = writeBatch(db);

  const taken = await getDocFromServer(usernamesRef);
  if (taken.exists()) throw new Error('username indisponível');

  batch.set(usernamesRef, { username: username.toLowerCase(), uid });
  const profile: UserProfile = {
    uid,
    email,
    username,
    displayName,
    createdAt: serverTimestamp(),
    totalGames: 0,
    bestScore: 0,
  };
  batch.set(userRef, profile);
  await batch.commit();
  return profile;
}


