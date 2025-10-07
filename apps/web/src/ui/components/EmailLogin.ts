import { AuthService } from '../../services/auth';

type BusyTarget = HTMLButtonElement | HTMLInputElement;

type Cleanup = () => void;

export function EmailLogin(onSent: () => void, onCancel: () => void, getPendingScore?: () => number | null): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.className = 'fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm';
  wrap.innerHTML = `
    <div class="w-11/12 max-w-[430px] text-[#0a2960]">
      <div id="state-form" class="bg-white/95 rounded-2xl p-5 shadow-xl space-y-4">
        <div class="font-[800] text-lg">Entrar para submeter pontuação</div>
        <div class="text-sm opacity-80">Receberás um e-mail com um código de 6 dígitos para concluir o login.</div>
        <input id="email" type="email" autocomplete="email" placeholder="Email" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#0a2960]/30"/>
        <input id="code" type="tel" inputmode="numeric" maxlength="6" placeholder="Código (6 dígitos)" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#0a2960]/30"/>
        <div class="flex gap-3">
          <button id="cancel" class="home-glass-btn flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70">Cancelar</button>
          <button id="send" class="flex-1 px-3 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-sm">Enviar código</button>
          <button id="verify" class="flex-1 px-3 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-sm">Confirmar código</button>
        </div>
        <div class="text-[11px] leading-4 opacity-70">O código expira em alguns minutos. Podes pedir outro a qualquer momento.</div>
        <div class="flex items-center gap-3">
          <div class="h-px bg-[#0a2960]/20 flex-1"></div>
          <div class="text-xs opacity-70">ou</div>
          <div class="h-px bg-[#0a2960]/20 flex-1"></div>
        </div>
        <button id="google" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] font-semibold border border-[#0a2960]/30 shadow-[0_6px_16px_rgba(2,20,60,0.18)]">Entrar com Google</button>
        <div id="msg" class="text-xs opacity-80 h-4"></div>
      </div>
      <div id="state-sent" class="hidden bg-white/95 rounded-2xl p-6 shadow-xl space-y-4">
        <div class="font-[800] text-lg">Verifica o teu email</div>
        <div class="text-sm opacity-80" id="sent-copy">
          Enviamos uma verificação por e-mail para <span id="sent-email" class="font-semibold"></span>.
        </div>
        <ul class="text-sm opacity-80 space-y-2">
          <li>- Abre o email e toca no botao "Entrar" ou na ligacao recebida.</li>
          <li>- Se estiveres no Outlook ou numa app segura, escolhe "Abrir no browser".</li>
          <li>- O link expira em alguns minutos; podes pedir outro a qualquer momento.</li>
        </ul>
        <div class="flex flex-col gap-3 sm:flex-row">
          <button id="sent-close" class="flex-1 px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Ok, vou verificar</button>
          <button id="sent-resend" class="flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70">Usar outro email</button>
        </div>
      </div>
    </div>
  `;

  const input = wrap.querySelector<HTMLInputElement>('#email')!;
  const btnSend = wrap.querySelector<HTMLButtonElement>('#send')!;
  const btnVerify = wrap.querySelector<HTMLButtonElement>('#verify')!;
  const btnCancel = wrap.querySelector<HTMLButtonElement>('#cancel')!;
  const btnGoogle = wrap.querySelector<HTMLButtonElement>('#google')!;
  const msg = wrap.querySelector<HTMLDivElement>('#msg')!;
  const formCard = wrap.querySelector<HTMLDivElement>('#state-form')!;
  const sentCard = wrap.querySelector<HTMLDivElement>('#state-sent')!;
  const sentEmail = wrap.querySelector<HTMLSpanElement>('#sent-email')!;
  const sentCopy = wrap.querySelector<HTMLDivElement>('#sent-copy')!;
  const btnSentClose = wrap.querySelector<HTMLButtonElement>('#sent-close')!;
  const btnSentResend = wrap.querySelector<HTMLButtonElement>('#sent-resend')!;

  const codeInput = wrap.querySelector<HTMLInputElement>('#code')!;

  const busyTargets: BusyTarget[] = [btnSend, btnVerify, btnCancel, btnGoogle, input, codeInput];

  let notifyHandled = false;
  const notifySent = () => {
    if (notifyHandled) return;
    notifyHandled = true;
    try { onSent(); } catch {}
  };

  const setBusy = (busy: boolean) => {
    busyTargets.forEach((el) => { el.disabled = busy; });
    btnSend.style.opacity = busy ? '0.7' : '1';
    btnVerify.style.opacity = busy ? '0.7' : '1';
    btnGoogle.style.opacity = busy ? '0.7' : '1';
  };

  const mapError = (code: string) => {
    if (!code) return 'Ocorreu um erro.';
    const lower = code.toLowerCase();
    if (lower.includes('operation-not-allowed')) return 'Método desativado no projeto Firebase.';
    if (lower.includes('unauthorized-continue-uri')) return 'Domínio/URL de retorno não autorizado nas definições Firebase.';
    if (lower.includes('unauthorized-continue-host') || lower.includes('invalid-continue-url')) return 'Configuração inválida do URL de retorno. Garante HTTPS e que o domínio está autorizado.';
    if (lower.includes('invalid-email')) return 'Email inválido.';
    if (lower.includes('too-many-requests')) return 'Muitas tentativas. Tenta novamente mais tarde.';
    if (lower.includes('network-request-failed')) return 'Sem ligação à internet. Verifica a tua ligação.';
    return code;
  };

  const showForm = () => {
    sentCard.classList.add('hidden');
    formCard.classList.remove('hidden');
    msg.textContent = '';
    setBusy(false);
    window.setTimeout(() => { try { input.focus(); } catch {} }, 50);
  };

  const showSent = () => {
    const raw = input.value.trim();
    sentEmail.textContent = raw || 'o teu email';
    sentCopy.classList.remove('hidden');
    sentCard.classList.remove('hidden');
    formCard.classList.add('hidden');
  };

  const handlePendingScore = () => {
    const score = getPendingScore ? (getPendingScore() ?? null) : null;
    if (score != null) {
      try { localStorage.setItem('ab-pending-score', String(score)); } catch {}
    }
  };

  btnCancel.onclick = () => { onCancel(); wrap.remove(); };
  btnSend.onclick = async () => {
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Introduz um email válido.'; return; }
    setBusy(true); msg.textContent = 'A enviar...';
    try {
      handlePendingScore();
      await AuthService.sendMagicLink(email);
      msg.textContent = 'Código enviado. Verifica o teu e-mail e introduz o código.';
    } catch (e: any) {
      const code = (e?.code || e?.message || String(e)) as string;
      msg.textContent = `Falha ao enviar código. ${mapError(code)}`;
    } finally { setBusy(false); }
  };

  const verify = async () => {
    const email = input.value.trim();
    const code = codeInput.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Introduz um email válido.'; return; }
    if (!/^\d{6}$/.test(code)) { msg.textContent = 'Introduz o código de 6 dígitos.'; return; }
    setBusy(true); msg.textContent = 'A validar...';
    try {
      handlePendingScore();
      await AuthService.verifyOtp(email, code);
      msg.textContent = '';
      notifySent();
      wrap.remove();
    } catch (e: any) {
      const c = e?.code || e?.message || String(e);
      msg.textContent = `Falha ao validar. ${mapError(c)}`;
    } finally { setBusy(false); }
  };

  btnGoogle.onclick = async () => {
    setBusy(true); msg.textContent = 'A abrir Google...';
    try {
      handlePendingScore();
      await AuthService.signInWithGoogle();
      // Login com Google não precisa de /auth-complete, já está autenticado
      notifySent(); wrap.remove();
    } catch (e: any) {
      const code = e?.code || e?.message || String(e);
      msg.textContent = `Falha no Google Sign-In. ${mapError(code)}`;
      setBusy(false);
    }
  };

  btnSentClose.onclick = () => { notifySent(); wrap.remove(); };
  btnSentResend.onclick = () => {
    input.value = '';
    notifyHandled = false;
    showForm();
  };

  btnVerify.onclick = () => { void verify(); };
  codeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); void verify(); } });

  const tearDown: Cleanup = () => {
    wrap.remove();
  };

  wrap.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      tearDown();
      onCancel();
    }
  });

  showForm();
  return wrap;
}
