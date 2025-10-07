const SibApiV3Sdk = require('@getbrevo/brevo');
const { ensureEnv, getRequired, get, getNumber } = require('./env');

ensureEnv();

const apiKey = getRequired('BREVO_API_KEY');
const senderEmail = getRequired('BREVO_SENDER_EMAIL');
const senderName = get('BREVO_SENDER_NAME', 'Alves Bandeira');
const templateIdRaw = get('BREVO_TEMPLATE_ID', '');

const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();
transactionalApi.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

function buildHtml(code, ttl) {
  return `
    <div style="font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#0a2960">
      <h2 style="margin:0 0 12px 0;color:#0a2960">Codigo de login</h2>
      <p style="margin:0 0 8px 0">O teu codigo e:</p>
      <div style="font-size:28px;font-weight:800;letter-spacing:6px;color:#1f4590">${code}</div>
      <p style="margin:12px 0 0 0">Valido por ${ttl} minutos.</p>
    </div>`;
}

function buildText(code, ttl) {
  return `Codigo de login: ${code}\nValido por ${ttl} minutos.`;
}

async function sendOtpEmail(toEmail, code, ttlMinutes) {
  const ttl = getNumber('OTP_EMAIL_TTL_MINUTES', ttlMinutes || 10);
  const useTemplate = templateIdRaw && /^\d+$/.test(String(templateIdRaw));

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: toEmail }];
  sendSmtpEmail.sender = { email: senderEmail, name: senderName };
  sendSmtpEmail.textContent = buildText(code, ttl);

  if (useTemplate) {
    sendSmtpEmail.templateId = Number(templateIdRaw);
    sendSmtpEmail.params = { code, ttl };
  } else {
    sendSmtpEmail.subject = 'O teu codigo de login';
    sendSmtpEmail.htmlContent = buildHtml(code, ttl);
  }

  await transactionalApi.sendTransacEmail(sendSmtpEmail);
}

module.exports = { sendOtpEmail };
