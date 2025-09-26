import { getDb } from '../lib/firebase';
import { addDoc, collection, limit, orderBy, query, serverTimestamp, where, getDocs } from 'firebase/firestore';

export interface ScoreEntry {
  uid: string;
  username: string;
  displayName?: string;
  score: number;
  timestamp?: unknown;
  gameData?: Record<string, unknown>;
}

export async function submitScore(data: ScoreEntry): Promise<void> {
  const db = getDb();
  const ref = collection(db, 'scores');
  await addDoc(ref, { ...data, timestamp: serverTimestamp() });
}

export async function topScores(limitN = 50): Promise<ScoreEntry[]> {
  const db = getDb();
  const ref = collection(db, 'scores');
  const q = query(ref, orderBy('score', 'desc'), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ScoreEntry);
}

export async function searchByUsername(prefix: string, limitN = 50): Promise<ScoreEntry[]> {
  const db = getDb();
  const ref = collection(db, 'scores');
  const q = query(ref, where('username', '>=', prefix), where('username', '<=', prefix + '\uf8ff'), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ScoreEntry);
}

export async function listUserScores(uid: string, limitN = 100): Promise<ScoreEntry[]> {
  const db = getDb();
  const ref = collection(db, 'scores');
  const q = query(ref, where('uid', '==', uid), orderBy('timestamp', 'desc'), limit(limitN));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as ScoreEntry);
}


