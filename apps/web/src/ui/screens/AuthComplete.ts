import { AuthService, setCachedUser } from '../../services/auth';
import { getUserProfile } from '../../services/user';
import { getFirebaseAuth, trackMagicLinkEvent } from '../../lib/firebase';

export function AuthComplete(onNeedsProfile: () => void, onDone: (score?: number) => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo (marquee infinito com instâncias desfasadas) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: -18s;"/>
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-24 left-0 w-[28%] max-w-[220px] -z-10 opacity-70 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 54s; --ab-delay: -41s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -9s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[30%] max-w-[230px] -z-10 opacity-60 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 40s; --ab-delay: -27s;"/>

    <!-- Logo independente -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-full flex justify-center">
      <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="w-[150px] md:w-[180px] h-auto ab-logo-white"/>
    </div>

    <div class="relative z-10 w-full h-full flex items-center justify-center">
      <div class="w-11/12 max-w-[420px] text-center space-y-6">
        <div class="text-white text-xl font-[800] tracking-[0.06em]" id="status-text">A processar autenticação...</div>
        <div id="manual-email" class="hidden bg-white/95 text-[#0a2960] rounded-2xl p-5 shadow-lg">
          <div class="font-[700] text-base mb-2">Confirma o teu email</div>
          <div class="text-sm opacity-80 mb-3" id="manual-help">Introduz o email usado para pedir o link. Se abriste no Outlook, escolhe "Abrir no browser".</div>
          <input id="manual-email-input" type="email" placeholder="Email" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#0a2960]/30"/>
          <div class="mt-3 flex gap-3">
            <button id="manual-cancel" class="flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70">Cancelar</button>
            <button id="manual-confirm" class="flex-1 px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Confirmar login</button>
          </div>
          <div class="text-xs mt-2 opacity-70">Dica: usa o mesmo email com o qual pediste o link.</div>
          <div id="manual-error" class="text-xs text-red-600 mt-2 h-4"></div>
        </div>
        <div id="auth-error" class="hidden text-sm text-red-200"></div>
      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -25s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -59s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -31s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -11s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Botao de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>
  `;

  const statusText = el.querySelector<HTMLDivElement>('#status-text')!;
  const manualWrap = el.querySelector<HTMLDivElement>('#manual-email')!;
  const manualHelp = el.querySelector<HTMLDivElement>('#manual-help')!;
  const manualInput = el.querySelector<HTMLInputElement>('#manual-email-input')!;
  const manualConfirm = el.querySelector<HTMLButtonElement>('#manual-confirm')!;
  const manualCancel = el.querySelector<HTMLButtonElement>('#manual-cancel')!;
  const manualError = el.querySelector<HTMLDivElement>('#manual-error')!;
  const errorBox = el.querySelector<HTMLDivElement>('#auth-error')!;

  let resolved = false;
  let waitingManual = false;

  const clearFallbackTimer = (() => {
    let cleared = false;
    const timer = window.setTimeout(() => {
      if (resolved || waitingManual) return;
      trackMagicLinkEvent('magic_link_complete_timeout', { waitingManual });
      finish();
    }, 6000);
    return () => {
      if (cleared) return;
      cleared = true;
      try { window.clearTimeout(timer); } catch {}
    };
  })();

  const finish = (score?: number) => {
    if (resolved) return;
    resolved = true;
    clearFallbackTimer();
    onDone(score);
  };

  const showManualEmailPrompt = (message?: string) => {
    waitingManual = true;
    clearFallbackTimer();
    manualWrap.classList.remove('hidden');
    statusText.textContent = 'Confirma o teu email para concluir o login.';
    const hint = AuthService.getMagicLinkEmailHint();
    if (hint) {
      manualHelp.textContent = `Introduz o email usado para pedir o link (${hint}).`;
    }
    manualError.textContent = message ?? '';
    trackMagicLinkEvent('magic_link_manual_email_prompt', { hasHint: Boolean(hint) });
    window.setTimeout(() => {
      try { manualInput.focus(); } catch {}
    }, 80);
  };

  const readPendingScore = () => {
    let pending: number | undefined;
    try {
      const raw = localStorage.getItem('ab-pending-score');
      if (raw) {
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) pending = parsed;
        localStorage.removeItem('ab-pending-score');
      }
    } catch {}
    return pending;
  };

  const setManualBusy = (busy: boolean) => {
    manualConfirm.disabled = busy;
    manualCancel.disabled = busy;
    manualInput.disabled = busy;
  };

  const manualComplete = async () => {
    const email = manualInput.value.trim();
    if (!email) {
      manualError.textContent = 'Introduz o email usado para pedir o link.';
      return;
    }
    manualError.textContent = '';
    setManualBusy(true);
    statusText.textContent = 'A confirmar login...';
    try {
      AuthService.cacheMagicLinkEmail(email);
      const user = await AuthService.completeMagicLink(undefined, email);
      const profile = await getUserProfile(user.uid);
      setCachedUser({ uid: user.uid, email: user.email || undefined, username: profile?.username, displayName: profile?.displayName });
      const pending = readPendingScore();
      trackMagicLinkEvent('magic_link_manual_email_success', { hasProfile: Boolean(profile?.username) });
      if (!profile?.username) { onNeedsProfile(); return; }
      finish(typeof pending === 'number' ? pending : undefined);
    } catch (error: any) {
      const code = (error?.code || error?.message || '').toString().toLowerCase();
      if (code.includes('invalid-email')) {
        manualError.textContent = 'Não conseguimos confirmar esse email com o link recebido.';
        setManualBusy(false);
        return;
      }
      if (code.includes('expired-action-code')) {
        manualError.textContent = 'O link expirou. Pede um novo email.';
        trackMagicLinkEvent('magic_link_complete_expired', { viaManual: true });
        window.setTimeout(() => finish(), 2800);
        return;
      }
      manualError.textContent = 'Falha ao concluir. Pede um novo email ou volta atrás.';
      trackMagicLinkEvent('magic_link_manual_email_failure', { code });
      setManualBusy(false);
    }
  };

  manualConfirm.onclick = () => { manualComplete(); };
  manualInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      manualComplete();
    }
  });
  manualCancel.onclick = () => {
    trackMagicLinkEvent('magic_link_manual_email_cancelled');
    finish();
  };

  // Fallback de seguranca: se algo ficar pendurado, decide em ~3s
  const fallbackGuard = window.setTimeout(async () => {
    if (resolved || waitingManual) return;
    try {
      const cur = getFirebaseAuth().currentUser;
      let pending: number | undefined;
      try {
        const raw = localStorage.getItem('ab-pending-score');
        if (raw) {
          pending = Number(raw);
          localStorage.removeItem('ab-pending-score');
        }
      } catch {}
      if (!cur) { finish(); return; }
      const profile = await getUserProfile(cur.uid);
      if (!profile?.username) { onNeedsProfile(); return; }
      finish(pending);
    } catch { finish(); }
  }, 3000);

  const clearFallbackGuard = () => {
    try { window.clearTimeout(fallbackGuard); } catch {}
  };

  (async () => {
    // Verifica se estamos no fluxo de Google redirect
    const urlParams = new URLSearchParams(window.location.search);
    const isGoogleRedirect = urlParams.has('google-redirect');
    
    // Se estivermos a iniciar um Google login, fazê-lo agora
    if (isGoogleRedirect && !urlParams.has('state')) {
      // Este é o momento antes do redirect para Google
      statusText.textContent = 'A redirecionar para Google...';
      try {
        await AuthService.signInWithGoogle();
        // Se chegou aqui, o popup funcionou
        clearFallbackGuard();
        clearFallbackTimer();
        const cached = await import('../../services/auth').then(m => m.getCachedUser());
        const pending = readPendingScore();
        if (!cached?.username) {
          onNeedsProfile();
          return;
        }
        finish(typeof pending === 'number' ? pending : undefined);
        return;
      } catch (err) {
        console.error('Google login failed:', err);
        errorBox.textContent = 'Falha ao iniciar sessão com Google. Tenta novamente.';
        errorBox.classList.remove('hidden');
        window.setTimeout(() => finish(), 2000);
        return;
      }
    }
    
    // Primeiro tenta processar Google redirect (se houver)
    try {
      statusText.textContent = 'A processar autenticação...';
      const googleUser = await AuthService.consumeGoogleRedirect();
      if (googleUser) {
        // Login com Google bem-sucedido
        const profile = await getUserProfile(googleUser.uid);
        setCachedUser({ 
          uid: googleUser.uid, 
          email: googleUser.email || undefined, 
          username: profile?.username, 
          displayName: profile?.displayName || (googleUser as any).displayName 
        });
        clearFallbackGuard();
        clearFallbackTimer();
        const pending = readPendingScore();
        if (!profile?.username) { 
          onNeedsProfile(); 
          return; 
        }
        finish(typeof pending === 'number' ? pending : undefined);
        return;
      }
    } catch (err) {
      console.warn('Google redirect check failed:', err);
      // Continua para tentar email link
    }

    // Se não for Google redirect, tenta processar email link
    try {
      if (!AuthService.isEmailLink()) { clearFallbackTimer(); clearFallbackGuard(); finish(); return; }
    } catch {
      clearFallbackTimer(); clearFallbackGuard(); finish(); return;
    }
    try {
      const user = await AuthService.completeMagicLink();
      const profile = await getUserProfile(user.uid);
      setCachedUser({ uid: user.uid, email: user.email || undefined, username: profile?.username, displayName: profile?.displayName });
      clearFallbackGuard();
      const pending = readPendingScore();
      if (!profile?.username) { clearFallbackTimer(); onNeedsProfile(); return; }
      clearFallbackTimer();
      finish(typeof pending === 'number' ? pending : undefined);
    } catch (error: any) {
      const rawCode = error?.code || error?.message || '';
      const code = rawCode.toString().toLowerCase();
      if (code.includes('missing-email-for-magic-link')) {
        clearFallbackGuard();
        showManualEmailPrompt();
        return;
      }
      clearFallbackTimer();
      clearFallbackGuard();
      trackMagicLinkEvent('magic_link_complete_failure_unhandled', { code: rawCode });
      if (code.includes('expired-action-code')) {
        statusText.textContent = 'O link expirou. Pede um novo email e tenta outra vez.';
        errorBox.textContent = 'O link expirou ou já foi usado. Volta atrás e pede um novo email.';
      } else {
        statusText.textContent = 'Não foi possível concluir o login.';
        errorBox.textContent = 'Não conseguimos validar o link. Pede um novo email ou tenta novamente.';
      }
      errorBox.classList.remove('hidden');
      window.setTimeout(() => finish(), 3200);
    }
  })();

  // Som on/off com persistencia
  const soundBtn = el.querySelector<HTMLButtonElement>('#sound')!;
  const soundIcon = el.querySelector<HTMLImageElement>('#sound-icon')!;
  const updateSoundIcon = () => {
    const muted = (localStorage.getItem('ab-muted') === '1');
    soundIcon.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
  };
  const toggleMute = () => { const cur = (localStorage.getItem('ab-muted')==='1'); try{localStorage.setItem('ab-muted', cur?'0':'1');}catch{} updateSoundIcon(); };
  updateSoundIcon();
  soundBtn.onclick = () => toggleMute();
  soundBtn.addEventListener('touchstart', (e)=>{ try{e.preventDefault();}catch{} toggleMute(); }, {passive:false});

  return el;
}
