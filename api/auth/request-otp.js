const crypto = require('crypto');
const admin = require('firebase-admin');
const { ensureEnv, getNumber } = require('../_lib/env');
const { getFirestore } = require('../_lib/firebaseAdmin.js');
const { sendOtpEmail } = require('../_lib/brevo.js');

ensureEnv();

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function generateOtp() {
  const n = crypto.randomInt(0, 1000000);
  return n.toString().padStart(6, '0');
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

function getClientIp(req) {
  const header = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
  if (typeof header === 'string' && header.trim()) return header.split(',')[0].trim();
  if (Array.isArray(header) && header.length) return header[0];
  return req.socket?.remoteAddress || '';
}

function hashKey(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

async function consumeRateLimit(db, key, limit, windowMs) {
  if (!limit || limit < 1) return;
  const docRef = db.collection('authOtpRate').doc(key);
  const now = Date.now();

  try {
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(docRef);
      const data = snap.exists ? snap.data() : null;
      const resetAt = Number(data?.resetAt || 0);
      const count = Number(data?.count || 0);

      if (resetAt > now) {
        if (count >= limit) {
          const err = new Error('rate_limit_exceeded');
          err.code = 'rate_limit_exceeded';
          throw err;
        }
        tx.update(docRef, {
          count: admin.firestore.FieldValue.increment(1),
          updatedAt: admin.firestore.FieldValue.serverTimestamp?.() || new Date(),
        });
      } else {
        tx.set(docRef, {
          count: 1,
          resetAt: now + windowMs,
          createdAt: admin.firestore.FieldValue.serverTimestamp?.() || new Date(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp?.() || new Date(),
        });
      }
    });
  } catch (error) {
    if (error?.code === 'rate_limit_exceeded') throw error;
    throw error;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  try {
    const { email } = await readJson(req);
    const trimmed = (email || '').trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return json(res, 400, { error: 'invalid_email' });
    }

    const ttlSec = getNumber('OTP_CODE_TTL_SECONDS', 600);
    const ttlMs = ttlSec * 1000;
    const rateEmailLimit = getNumber('OTP_RATE_LIMIT_PER_EMAIL', 5);
    const rateIpLimit = getNumber('OTP_RATE_LIMIT_PER_IP', 10);
    const rateWindowMs = getNumber('OTP_RATE_LIMIT_WINDOW_SECONDS', Math.max(ttlSec, 60)) * 1000;

    const db = getFirestore();
    const ip = getClientIp(req);

    const limits = [];
    if (rateEmailLimit > 0) limits.push(consumeRateLimit(db, `email:${hashKey(trimmed)}`, rateEmailLimit, rateWindowMs));
    if (ip && rateIpLimit > 0) limits.push(consumeRateLimit(db, `ip:${hashKey(ip)}`, rateIpLimit, rateWindowMs));
    await Promise.all(limits);

    const salt = crypto.randomBytes(16).toString('hex');
    const code = generateOtp();
    const hash = hashOtp(trimmed, code, salt);
    const expiresAt = Date.now() + ttlMs;

    const ref = db.collection('authOtp').doc(trimmed);
    await ref.set({
      hash,
      salt,
      expiresAt,
      attempts: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp?.() || new Date(),
      lastIp: ip || null,
    });

    await sendOtpEmail(trimmed, code, Math.ceil(ttlSec / 60));

    return json(res, 200, { ok: true });
  } catch (error) {
    if (error?.code === 'rate_limit_exceeded') {
      return json(res, 429, { error: 'rate_limited' });
    }
    return json(res, 500, { error: 'internal_error', detail: String(error?.message || error) });
  }
};
