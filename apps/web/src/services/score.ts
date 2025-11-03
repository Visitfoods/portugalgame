import { getDb } from '../lib/firebase';
import { addDoc, collection, limit, orderBy, query, serverTimestamp, where, getDocsFromServer, getCountFromServer } from 'firebase/firestore';

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
    return snap.docs.map(d => {
      const data = d.data();
      // Garantir que o timestamp é preservado
      return {
        ...data,
        timestamp: data.timestamp, // Manter o timestamp original do Firestore
      } as ScoreEntry;
    });
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

// Compute global rank and total submissions based on the raw scores collection.
// Rank is 1 + number of entries with a strictly higher score.
export async function getRankAndTotal(score: number): Promise<{ rank: number; total: number }> {
  // Importante: alinhar com a classificação, que mostra apenas o melhor resultado por jogador.
  // Estratégia: obter um conjunto alargado dos melhores scores, ordenar por score desc,
  // deduplicar por username mantendo o primeiro (melhor) e calcular posição/total nesse universo.
  // Nota: para escala atual é suficiente; para grandes volumes criaríamos uma coleção agregada.
  try {
    const db = getDb();
    const ref = collection(db, 'scores');
    const q = query(ref, orderBy('score', 'desc'), limit(2000));
    const snap = await getDocsFromServer(q);
    const rows = snap.docs.map(d => d.data() as ScoreEntry);
    // Deduplicar por username (mantém o primeiro pois já vem ordenado por score desc)
    const seen = new Set<string>();
    const unique: ScoreEntry[] = [];
    for (const r of rows) {
      const key = (r.username || '').toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      unique.push(r);
    }
    // Calcular posição: 1 + número de jogadores com melhor score
    const above = unique.filter(r => (r.score || 0) > score).length;
    const rank = above + 1;
    const total = unique.length || 1;
    return { rank, total };
  } catch (e) {
    console.warn('getRankAndTotal failed:', e);
    return { rank: 1, total: 1 };
  }
}


