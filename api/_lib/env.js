const path = require('path');
let loaded = false;

function ensureEnv() {
  if (loaded) return;
  loaded = true;
  try {
    require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[env] Failed to load .env.local:', error?.message || error);
    }
  }
}

function get(name, fallback) {
  ensureEnv();
  const value = process.env[name];
  if (value == null || value === '') return fallback;
  return value;
}

function getRequired(name) {
  const value = get(name);
  if (value == null || value === '') {
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}

function getNumber(name, fallback) {
  const raw = get(name, fallback == null ? undefined : String(fallback));
  if (raw == null || raw === '') {
    if (fallback == null) throw new Error(`Missing required numeric env var ${name}`);
    return Number(fallback);
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid numeric env var ${name}`);
  }
  return value;
}

module.exports = {
  ensureEnv,
  get,
  getRequired,
  getNumber,
};

