const crypto = require('crypto');
const admin = require('firebase-admin');
const { ensureEnv, getNumber } = require('../_lib/env');
const { getFirestore, getAuth } = require('../_lib/firebaseAdmin.js');

ensureEnv();

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function hashOtp(email, code, salt) {
  return crypto.createHash('sha256').update(`${email}\n${code}\n${salt}`).digest('hex');
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });
  try {
    const { email, code } = await readJson(req);
    const trimmed = (email || '').trim().toLowerCase();
    const provided = (code || '').trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return json(res, 400, { error: 'invalid_email' });
    }
    if (!/^\d{6}$/.test(provided)) {
      return json(res, 400, { error: 'invalid_code_format' });
    }

    const maxAttempts = getNumber('OTP_VERIFY_MAX_ATTEMPTS', 5);

    const db = getFirestore();
    const ref = db.collection('authOtp').doc(trimmed);
    const snap = await ref.get();
    if (!snap.exists) return json(res, 400, { error: 'code_not_found' });
    const data = snap.data();
    const { hash, salt, expiresAt, attempts = 0 } = data || {};
    if (!hash || !salt || !expiresAt) {
      await ref.delete().catch(() => {});
      return json(res, 400, { error: 'code_invalid' });
    }
    if (Date.now() > Number(expiresAt)) {
      await ref.delete().catch(() => {});
      return json(res, 400, { error: 'code_expired' });
    }
    if (attempts >= maxAttempts) {
      await ref.delete().catch(() => {});
      return json(res, 429, { error: 'too_many_attempts' });
    }

    const computed = hashOtp(trimmed, provided, String(salt));
    if (computed !== String(hash)) {
      await ref.update({ attempts: admin.firestore.FieldValue.increment(1) }).catch(() => {});
      return json(res, 400, { error: 'code_mismatch' });
    }

    await ref.delete().catch(() => {});

    const auth = getAuth();
    let uid;
    try {
      const user = await auth.getUserByEmail(trimmed);
      uid = user.uid;
    } catch {
      const user = await auth
        .createUser({ email: trimmed, emailVerified: true })
        .catch(async (e) => {
          if (String(e?.errorInfo?.code || e?.code).includes('auth/email-already-exists')) {
            const existed = await auth.getUserByEmail(trimmed);
            return existed;
          }
          throw e;
        });
      uid = user.uid;
    }

    const token = await auth.createCustomToken(uid, { authProvider: 'otp', email: trimmed });
    return json(res, 200, { token });
  } catch (e) {
    return json(res, 500, { error: 'internal_error', detail: String(e?.message || e) });
  }
};
