const admin = require('firebase-admin');
const { ensureEnv, getRequired } = require('./env');

let app;

function getAdminApp() {
  if (app) return app;
  ensureEnv();
  const raw = getRequired('FIREBASE_SERVICE_ACCOUNT_JSON');
  let creds;
  try {
    creds = JSON.parse(raw);
  } catch {
    creds = JSON.parse(raw.replace(/\\n/g, '\\n'));
  }
  app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(creds),
      });
  return app;
}

function getFirestore() {
  return getAdminApp().firestore();
}

function getAuth() {
  return getAdminApp().auth();
}

module.exports = { getAdminApp, getFirestore, getAuth };

