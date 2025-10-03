import { AuthService, setCachedUser } from '../../services/auth';
import { getUserProfile } from '../../services/user';
import { getFirebaseAuth } from '../../lib/firebase';

export function AuthComplete(onNeedsProfile: () => void, onDone: (score?: number) => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: -18s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -9s;"/>

    <!-- Logo independente -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-full flex justify-center">
      <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="w-[150px] md:w-[180px] h-auto ab-logo-white"/>
    </div>

    <div class="relative z-10 w-full h-full flex items-center justify-center">
      <div class="text-white text-xl font-[800] tracking-[0.06em]">A processar autenticação…</div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -25s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -31s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Botão de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>
  `;

  // Fallback de segurança: se algo ficar pendurado, decide em ~3s
  const fallbackTimer = window.setTimeout(async () => {
    try {
      const cur = getFirebaseAuth().currentUser;
      let pending: number | undefined;
      try { const raw = localStorage.getItem('ab-pending-score'); if (raw) { pending = Number(raw); localStorage.removeItem('ab-pending-score'); } } catch {}
      if (!cur) { onDone(); return; }
      const profile = await getUserProfile(cur.uid);
      if (!profile?.username) { onNeedsProfile(); return; }
      onDone(pending);
    } catch { onDone(); }
  }, 3000);

  (async () => {
    // Se o URL atual não é um link válido de login por e‑mail, sair sem pedir nada
    try {
      if (!AuthService.isEmailLink()) { onDone(); return; }
    } catch {}
    try {
      const user = await AuthService.completeMagicLink();
      const profile = await getUserProfile(user.uid);
      setCachedUser({ uid: user.uid, email: user.email || undefined, username: profile?.username, displayName: profile?.displayName });
      let pending: number | undefined;
      try {
        const raw = localStorage.getItem('ab-pending-score');
        if (raw) { pending = Number(raw); localStorage.removeItem('ab-pending-score'); }
      } catch {}
      clearTimeout(fallbackTimer);
      if (!profile?.username) { onNeedsProfile(); return; }
      onDone(pending);
    } catch (e: any) {
      // Se não for um fluxo válido ou faltar email em cache, ignora sem bloquear o jogo
      const code = e?.code || e?.message || '';
      if (String(code).includes('missing-email-for-magic-link')) { onDone(); return; }
      onDone();
    }
  })();

  // Som on/off com persistência
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


