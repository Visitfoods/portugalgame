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
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>O teu código de acesso</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f7fa;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f7fa;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,0.05);overflow:hidden;border:1px solid #eef2f6;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 0 32px;text-align:center;">
              <h1 style="margin:0;color:#1f4590;font-size:24px;font-weight:800;letter-spacing:-0.5px;text-transform:uppercase;">Alves Bandeira</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;text-align:center;">
              <p style="margin:0 0 24px 0;color:#546e7a;font-size:16px;line-height:1.5;">Olá!</p>
              <p style="margin:0 0 24px 0;color:#0a2960;font-size:18px;font-weight:600;">Aqui está o teu código para entrar no jogo:</p>
              
              <div style="background-color:#f0f7ff;border:2px dashed #cce4ff;border-radius:12px;padding:24px;margin:0 0 24px 0;">
                <div style="font-family:monospace;font-size:36px;font-weight:700;letter-spacing:8px;color:#1f4590;line-height:1;">${code}</div>
              </div>
              
              <p style="margin:0;color:#89a;font-size:14px;">Este código é válido por ${ttl} minutos.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#1f4590;padding:16px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.8);font-size:12px;font-weight:500;">&copy; ${year} Alves Bandeira. Todos os direitos reservados.</p>
            </td>
          </tr>
        </table>
        
        <!-- Spam Compliance / Address -->
        <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="max-width:480px;margin-top:20px;">
          <tr>
            <td align="center" style="color:#94a3b8;font-size:11px;line-height:1.4;">
              <p style="margin:0;">Recebeste este email porque foi solicitado um código de acesso.</p>
              <p style="margin:4px 0 0 0;">Se não foste tu, por favor ignora esta mensagem.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(code, ttl) {
  return `O teu código de verificação Alves Bandeira é: ${code}\n\nVálido por ${ttl} minutos.\n\nSe não solicitaste este código, ignora esta mensagem.`;
}

async function sendOtpEmail(toEmail, code, ttlMinutes) {
  const ttl = getNumber('OTP_EMAIL_TTL_MINUTES', ttlMinutes || 10);
  const useTemplate = templateIdRaw && /^\d+$/.test(String(templateIdRaw));

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: toEmail }];
  sendSmtpEmail.sender = { email: senderEmail, name: senderName };
  
  // Adicionar reply-to para melhorar entregabilidade (mostra que é uma caixa monitorizada)
  sendSmtpEmail.replyTo = { email: senderEmail, name: senderName };

  if (useTemplate) {
    console.log(`[Email] Usando template Brevo ID: ${templateIdRaw} para ${toEmail.split('@')[0]}...`);
    sendSmtpEmail.templateId = Number(templateIdRaw);
    sendSmtpEmail.params = { code, ttl, CODE: code, TTL: ttl }; // Enviar em varias variantes comuns
  } else {
    console.warn(`[Email] AVISO: BREVO_TEMPLATE_ID não configurado. Usando HTML fallback (menos fiável para entrega corporativa).`);
    sendSmtpEmail.subject = `${code} é o teu código de acesso`; // Subject mais específico ajuda a evitar spam
    sendSmtpEmail.htmlContent = buildHtml(code, ttl);
    sendSmtpEmail.textContent = buildText(code, ttl);
  }

  try {
    await transactionalApi.sendTransacEmail(sendSmtpEmail);
    console.log(`[Email] Enviado com sucesso para ${toEmail}`);
  } catch (error) {
    console.error('[Email] Falha no envio:', error?.response?.body || error?.message || error);
    throw error;
  }
}

module.exports = { sendOtpEmail };
