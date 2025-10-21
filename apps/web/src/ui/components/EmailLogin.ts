import { AuthService } from '../../services/auth';

type BusyTarget = HTMLButtonElement | HTMLInputElement;

type Cleanup = () => void;

export function EmailLogin(onSent: () => void, onCancel: () => void, getPendingScore?: () => number | null): HTMLDivElement {
  const wrap = document.createElement('div');
  wrap.className = 'fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm';
  wrap.innerHTML = `
    <div class="w-11/12 max-w-[430px] text-[#0a2960]">
      <div id="state-form" class="bg-white/95 rounded-2xl p-5 shadow-xl space-y-4">
        <div class="font-[800] text-lg">ENTRAR PARA SUBMETER PONTUAÇÃO</div>
        <div class="text-sm opacity-80">RECEBESTE UM E-MAIL COM UM CÓDIGO DE 6 DÍGITOS PARA CONCLUIR O LOGIN.</div>
        <input id="email" type="email" autocomplete="email" placeholder="EMAIL" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#0a2960]/30"/>
        <input id="code" type="tel" inputmode="numeric" maxlength="6" placeholder="CÓDIGO (6 DÍGITOS)" class="hidden w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#0a2960]/30"/>
        <div class="flex gap-3">
          <button id="cancel" class="home-glass-btn flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70 text-xs">CANCELAR</button>
          <button id="send" class="flex-1 px-3 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-sm">ENVIAR</button>
          <button id="verify" class="hidden flex-1 px-3 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-xs">CONFIRMAR CÓDIGO</button>
        </div>
        <div id="hint" class="text-[11px] leading-4 opacity-70">O CÓDIGO EXPIRA EM ALGUNS MINUTOS.</div>
        <div class="flex items-center gap-3">
          <div class="h-px bg-[#0a2960]/20 flex-1"></div>
          <div class="text-xs opacity-70">OU</div>
          <div class="h-px bg-[#0a2960]/20 flex-1"></div>
        </div>
        <button id="google" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] font-semibold border border-[#0a2960]/30 shadow-[0_6px_16px_rgba(2,20,60,0.18)]">ENTRAR COM GOOGLE</button>
        <div id="msg" class="text-xs opacity-80 h-4"></div>
      </div>
      <div id="state-sent" class="hidden bg-white/95 rounded-2xl p-6 shadow-xl space-y-4">
        <div class="font-[800] text-lg">VERIFICA O TEU EMAIL</div>
        <div class="text-sm opacity-80" id="sent-copy">
          ENVIAMOS UMA VERIFICAÇÃO POR E-MAIL PARA <span id="sent-email" class="font-semibold"></span>.
        </div>
        <ul class="text-sm opacity-80 space-y-2">
          <li>- ABRE O EMAIL E TOCA NO BOTÃO "ENTRAR" OU NA LIGAÇÃO RECEBIDA.</li>
          <li>- SE ESTIVERES NO OUTLOOK OU NUMA APP SEGURA, ESCOLHE "ABRIR NO BROWSER".</li>
          <li>- O LINK EXPIRA EM ALGUNS MINUTOS; PODES PEDIR OUTRO A QUALQUER MOMENTO.</li>
        </ul>
        <div class="flex flex-col gap-3 sm:flex-row">
          <button id="sent-close" class="flex-1 px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold">OK, VOU VERIFICAR</button>
          <button id="sent-resend" class="flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70">USAR OUTRO EMAIL</button>
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
  const hint = wrap.querySelector<HTMLDivElement>('#hint')!;

  const busyTargets: BusyTarget[] = [btnSend, btnVerify, btnCancel, btnGoogle, input, codeInput];

  type Step = 'email' | 'code';
  let step: Step = 'email';
  const RESEND_COOLDOWN_SECONDS = 30;
  let nextResendAt = 0;
  let resendTimer: number | null = null;

  const updateStepUI = () => {
    if (step === 'email') {
      codeInput.classList.add('hidden');
      btnVerify.classList.add('hidden');
      btnSend.classList.remove('hidden');
      btnSend.textContent = 'ENVIAR';
      btnSend.disabled = false;
      hint.textContent = 'O CÓDIGO EXPIRA EM ALGUNS MINUTOS.';
    } else {
      codeInput.classList.remove('hidden');
      btnVerify.classList.remove('hidden');
      btnSend.classList.add('hidden'); // Esconder botão ENVIAR na fase de código
      hint.textContent = 'CÓDIGO ENVIADO. VERIFICA O TEU E-MAIL E INTRODUZ O CÓDIGO. NÃO RECEBESTE O CÓDIGO? ENVIAR NOVAMENTE';
      updateResendButton();
    }
  };

  const clearResendTimer = () => {
    if (resendTimer != null) {
      window.clearInterval(resendTimer);
      resendTimer = null;
    }
  };

  const updateResendButton = () => {
    if (step !== 'code') return;
    const now = Date.now();
    const remain = Math.max(0, Math.ceil((nextResendAt - now) / 1000));
    if (remain > 0) {
      btnSend.disabled = true;
      btnSend.textContent = `REENVIAR (${remain}S)`;
    } else {
      btnSend.disabled = false;
      btnSend.textContent = 'REENVIAR';
    }
  };

  const updateResendLink = () => {
    const now = Date.now();
    const remain = Math.max(0, Math.ceil((nextResendAt - now) / 1000));
    if (remain > 0) {
      hint.textContent = `CÓDIGO ENVIADO. VERIFICA O TEU E-MAIL E INTRODUZ O CÓDIGO. NÃO RECEBESTE O CÓDIGO? ENVIAR NOVAMENTE (${remain}S)`;
    } else {
      hint.textContent = 'CÓDIGO ENVIADO. VERIFICA O TEU E-MAIL E INTRODUZ O CÓDIGO. NÃO RECEBESTE O CÓDIGO? ENVIAR NOVAMENTE';
    }
  };

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
    if (!code) return 'OCORREU UM ERRO.';
    const lower = code.toLowerCase();
    if (lower.includes('operation-not-allowed')) return 'MÉTODO DESATIVADO NO PROJETO FIREBASE.';
    if (lower.includes('unauthorized-continue-uri')) return 'DOMÍNIO/URL DE RETORNO NÃO AUTORIZADO NAS DEFINIÇÕES FIREBASE.';
    if (lower.includes('unauthorized-continue-host') || lower.includes('invalid-continue-url')) return 'CONFIGURAÇÃO INVÁLIDA DO URL DE RETORNO. GARANTE HTTPS E QUE O DOMÍNIO ESTÁ AUTORIZADO.';
    if (lower.includes('invalid-email')) return 'EMAIL INVÁLIDO.';
    if (lower.includes('too-many-requests')) return 'MUITAS TENTATIVAS. TENTA NOVAMENTE MAIS TARDE.';
    if (lower.includes('network-request-failed')) return 'SEM LIGAÇÃO À INTERNET. VERIFICA A TUA LIGAÇÃO.';
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
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'INTRODUZ UM EMAIL VÁLIDO.'; return; }
    setBusy(true); msg.textContent = 'A ENVIAR...';
    try {
      handlePendingScore();
      await AuthService.sendMagicLink(email);
      msg.textContent = 'CÓDIGO ENVIADO. VERIFICA O TEU E-MAIL E INTRODUZ O CÓDIGO.';
      step = 'code';
      nextResendAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
      clearResendTimer();
      resendTimer = window.setInterval(() => {
        updateResendButton();
        updateResendLink();
      }, 500) as unknown as number;
      updateStepUI();
    } catch (e: any) {
      const code = (e?.code || e?.message || String(e)) as string;
      msg.textContent = `FALHA AO ENVIAR CÓDIGO. ${mapError(code)}`;
    } finally { setBusy(false); }
  };

  const verify = async () => {
    const email = input.value.trim();
    const code = codeInput.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'INTRODUZ UM EMAIL VÁLIDO.'; return; }
    if (!/^\d{6}$/.test(code)) { msg.textContent = 'INTRODUZ O CÓDIGO DE 6 DÍGITOS.'; return; }
    setBusy(true); msg.textContent = 'A VALIDAR...';
    try {
      handlePendingScore();
      await AuthService.verifyOtp(email, code);
      msg.textContent = '';
      notifySent();
      wrap.remove();
    } catch (e: any) {
      const c = e?.code || e?.message || String(e);
      msg.textContent = `FALHA AO VALIDAR. ${mapError(c)}`;
    } finally { setBusy(false); }
  };

  btnGoogle.onclick = async () => {
    setBusy(true); msg.textContent = 'A ABRIR GOOGLE...';
    try {
      handlePendingScore();
      await AuthService.signInWithGoogle();
      // Login com Google não precisa de /auth-complete, já está autenticado
      notifySent(); wrap.remove();
    } catch (e: any) {
      const code = e?.code || e?.message || String(e);
      msg.textContent = `FALHA NO GOOGLE SIGN-IN. ${mapError(code)}`;
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
  updateStepUI();
  return wrap;
}
