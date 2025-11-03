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
          <button id="cancel" class="home-glass-btn flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70 text-xs whitespace-nowrap">CANCELAR</button>
          <button id="send" class="flex-1 px-3 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-sm whitespace-nowrap">ENVIAR</button>
          <button id="verify" class="hidden flex-1 px-3 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-xs whitespace-nowrap">CONFIRMAR</button>
        </div>
        <div id="hint" class="text-[11px] leading-4 opacity-70">O CÓDIGO EXPIRA EM ALGUNS MINUTOS.</div>
        <div class="flex items-center gap-3">
          <div class="h-px bg-[#0a2960]/20 flex-1"></div>
          <div class="text-xs opacity-70">OU</div>
          <div class="h-px bg-[#0a2960]/20 flex-1"></div>
        </div>
        <button id="google" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] font-semibold border border-[#0a2960]/30 shadow-[0_6px_16px_rgba(2,20,60,0.18)] flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          ENTRAR COM GOOGLE
        </button>
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
  const RESEND_COOLDOWN_SECONDS = 60;
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
      hint.textContent = 'NÃO RECEBESTE O CÓDIGO? ENVIAR NOVAMENTE';
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
      hint.innerHTML = `NÃO RECEBESTE O CÓDIGO? <span id="resend-link" class="underline cursor-pointer text-[#1f4590]">ENVIAR NOVAMENTE (${remain}S)</span>`;
    } else {
      hint.innerHTML = `NÃO RECEBESTE O CÓDIGO? <span id="resend-link" class="underline cursor-pointer text-[#1f4590]">ENVIAR NOVAMENTE</span>`;
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

  const showCodeErrorModal = () => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
    
    modal.innerHTML = `
      <div class="relative w-full max-w-[90vw] max-w-[420px] bg-white/95 rounded-[22px] shadow-[0_20px_40px_rgba(2,20,60,0.3)] overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <!-- Header -->
        <div class="flex items-center justify-center p-4 border-b-2 border-[#dc2626]/30 bg-[#dc2626]">
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <h2 class="text-xl font-[800] text-white">CÓDIGO INCORRETO</h2>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-6 text-center">
          <div class="text-[#0a2960] font-[600] text-lg mb-6">O CÓDIGO QUE INTRODUZISTE ESTÁ INCORRETO.</div>
          <div class="text-[#0a2960]/70 text-sm mb-6">VERIFICA O CÓDIGO NO TEU EMAIL E TENTA NOVAMENTE.</div>
          <button id="close-code-error-modal" class="w-full px-6 py-3 rounded-full bg-[#dc2626] text-white font-[800] text-lg shadow-[0_8px_20px_rgba(220,38,38,0.35)] border border-white/50 active:scale-[.98] transition">
            OK
          </button>
        </div>
      </div>
    `;

    // Fechar modal
    const closeBtn = modal.querySelector<HTMLButtonElement>('#close-code-error-modal')!;
    closeBtn.onclick = () => {
      modal.remove();
      codeInput.focus();
      codeInput.select();
    };
    
    // Fechar ao clicar fora
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
        codeInput.focus();
        codeInput.select();
      }
    };

    // ESC para fechar
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEsc);
        codeInput.focus();
        codeInput.select();
      }
    };
    document.addEventListener('keydown', handleEsc);

    document.body.appendChild(modal);
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
      msg.textContent = '';
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
      const errorCode = String(c).toLowerCase();
      
      // Mostrar pop-up visual para código incorreto
      if (errorCode.includes('code_mismatch') || errorCode.includes('code-mismatch') || errorCode.includes('mismatch')) {
        msg.textContent = '';
        showCodeErrorModal();
      } else {
        // Para outros erros, mostrar mensagem pequena como antes
        msg.textContent = `FALHA AO VALIDAR. ${mapError(c)}`;
      }
    } finally { setBusy(false); }
  };

  btnGoogle.onclick = async () => {
    setBusy(true); msg.textContent = 'A ABRIR GOOGLE...';
    try {
      handlePendingScore();
      console.log('Iniciando Google login...');
      const user = await AuthService.signInWithGoogle();
      console.log('Google login resultado:', user ? 'sucesso' : 'redirect');
      
      if (user) {
        // Login bem-sucedido com popup
        console.log('Login com popup bem-sucedido');
        notifySent(); wrap.remove();
      } else {
        // Login com redirect - a página vai recarregar
        console.log('Login com redirect - página vai recarregar');
        msg.textContent = 'A REDIRECIONAR...';
        // Não precisamos de fazer mais nada aqui, a página vai recarregar
        // e o sistema de detecção automática vai funcionar
      }
    } catch (e: any) {
      const code = e?.code || e?.message || String(e);
      console.error('Erro no Google login:', e);
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

  // Configurar link de reenvio clicável
  const setupResendLink = () => {
    const resendLink = wrap.querySelector<HTMLSpanElement>('#resend-link');
    if (resendLink) {
      resendLink.onclick = async () => {
        const email = input.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { 
          msg.textContent = 'INTRODUZ UM EMAIL VÁLIDO.'; 
          return; 
        }
        setBusy(true); 
        msg.textContent = 'A ENVIAR...';
        try {
          await AuthService.sendMagicLink(email);
          msg.textContent = '';
          nextResendAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
          clearResendTimer();
          resendTimer = window.setInterval(() => {
            updateResendButton();
            updateResendLink();
            setupResendLink(); // Reconfigurar o link após atualização
          }, 500) as unknown as number;
          updateResendLink();
          setupResendLink(); // Configurar o link inicial
        } catch (e: any) {
          const code = (e?.code || e?.message || String(e)) as string;
          msg.textContent = `FALHA AO ENVIAR CÓDIGO. ${mapError(code)}`;
        } finally { 
          setBusy(false); 
        }
      };
    }
  };


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
  
  // Configurar o link de reenvio após um pequeno delay
  setTimeout(() => {
    setupResendLink();
  }, 100);
  
  return wrap;
}
