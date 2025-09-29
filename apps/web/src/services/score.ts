import { getDb } from '../lib/firebase';
import { addDoc, collection, limit, orderBy, query, serverTimestamp, where, getDocsFromServer } from 'firebase/firestore';

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
  try {
    const db = getDb();
    const ref = collection(db, 'scores');
    const q = query(ref, orderBy('score', 'desc'), limit(limitN));
    const snap = await getDocsFromServer(q);
    return snap.docs.map(d => d.data() as ScoreEntry);
  } catch (e) {
    console.warn('topScores failed:', e);
    return [];
  }
}

export async function searchByUsername(prefix: string, limitN = 50): Promise<ScoreEntry[]> {
  try {
    const db = getDb();
    const ref = collection(db, 'scores');
    const q = query(ref, where('username', '>=', prefix), where('username', '<=', prefix + '\uf8ff'), limit(limitN));
    const snap = await getDocsFromServer(q);
    return snap.docs.map(d => d.data() as ScoreEntry);
  } catch (e) {
    console.warn('searchByUsername failed:', e);
    return [];
  }
}

export async function listUserScores(uid: string, limitN = 100): Promise<ScoreEntry[]> {
  try {
    const db = getDb();
    const ref = collection(db, 'scores');
    const q = query(ref, where('uid', '==', uid), orderBy('timestamp', 'desc'), limit(limitN));
    const snap = await getDocsFromServer(q);
    return snap.docs.map(d => d.data() as ScoreEntry);
  } catch (e: any) {
    const code = e?.code || e?.message || String(e);
    if (String(code).includes('failed-precondition')) {
      console.warn('Missing Firestore index for listUserScores (uid + timestamp). Returning empty list.');
      return [];
    }
    console.warn('listUserScores failed:', e);
    return [];
  }
}


