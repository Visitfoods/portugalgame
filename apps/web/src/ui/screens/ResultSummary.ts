 

import { BackgroundMusic } from '../../core/engine/Audio';

export function ResultSummary(score: number, onSubmit: () => void, onRetry: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';

  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover min-h-screen"/>

    <!-- Nuvens topo (marquee infinito com instâncias desfasadas) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-24 left-0 w-[28%] max-w-[220px] -z-10 opacity-70 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 54s; --ab-delay: -23s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -26s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[30%] max-w-[230px] -z-10 opacity-60 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 40s; --ab-delay: -20s;"/>

    <!-- Logo independente -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-full flex justify-center">
      <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="w-[150px] md:w-[180px] h-auto ab-logo-white"/>
    </div>

    <div class="relative z-10 w-full flex flex-col items-center">
      <!-- Parabéns -->
      <div class="mt-1 text-center text-white font-[800] tracking-[0.06em] text-2xl md:text-3xl">PARABÉNS!</div>

      <!-- Score com troféu -->
      <div class="relative mt-3 flex items-center justify-center gap-4">
        <img src="/assets/graphics/trophy.svg" class="w-20 h-20 select-none" alt="Troféu"/>
        <div class="flex flex-col items-start leading-none">
          <div id="score-num" class="text-7xl md:text-8xl font-[800] leading-none">0</div>
          <div class="mt-1 text-[12px] md:text-sm tracking-[0.24em] font-bold uppercase opacity-90">PONTOS</div>
        </div>
        <!-- Estrelas decorativas -->
        <img src="/assets/graphics/Estrela_1.svg" class="ab-star" style="top:-10px; left:calc(50% - 90px); --dur:7s; --delay:.2s; width:14px;" alt=""/>
        <img src="/assets/graphics/Estrela_2.svg" class="ab-star ab-star-white" style="top:-6px; left:calc(50% + 76px); --dur:6.5s; --delay:.6s; width:12px;" alt=""/>
        <img src="/assets/graphics/Estrela_1.svg" class="ab-star" style="top:22px; left:calc(50% - 70px); --dur:6.2s; --delay:.9s; width:10px;" alt=""/>
        <img src="/assets/graphics/Estrela_2.svg" class="ab-star ab-star-white" style="top:18px; left:calc(50% + 60px); --dur:7.2s; --delay:1.1s; width:11px;" alt=""/>
        <img src="/assets/graphics/Estrela_1.svg" class="ab-star" style="top:-18px; left:calc(50% - 40px); --dur:6.8s; --delay:.4s; width:9px;" alt=""/>
        <!-- Explosão inicial -->
        <img src="/assets/graphics/Estrela_1.svg" class="ab-star-burst" style="--tx:-28px; --ty:-22px; width:12px;" alt=""/>
        <img src="/assets/graphics/Estrela_2.svg" class="ab-star-burst ab-star-white" style="--tx:24px; --ty:-18px; width:11px;" alt=""/>
        <img src="/assets/graphics/Estrela_1.svg" class="ab-star-burst" style="--tx:-18px; --ty:18px; width:10px;" alt=""/>
        <img src="/assets/graphics/Estrela_2.svg" class="ab-star-burst ab-star-white" style="--tx:20px; --ty:16px; width:10px;" alt=""/>
      </div>

      

      <!-- Ações -->
      <div class="mt-5 w-9/12 max-w-[420px] flex flex-col items-center gap-5 md:gap-6">
        <button id="submit" class="px-8 py-3 rounded-full bg-[#1f4590] text-white font-[800] text-lg shadow-[0_10px_24px_rgba(2,20,60,0.35)] border border-white/40 w-full active:scale-[.98]">SUBMETER</button>
        <button id="share" class="btn-share relative px-5 py-2 rounded-full bg-white text-[#0a2960] font-semibold text-sm md:text-base border border-white/80 shadow-[0_6px_16px_rgba(2,20,60,0.18)] w-full active:scale-[.98]">
          <img src="/assets/graphics/Share_Icon.svg" alt="" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"/>
          <span class="pl-3">Partilhar Pontuação</span>
        </button>
        <button id="again" class="px-8 py-3 rounded-full bg-white/15 text-white/90 font-semibold border border-white/60 w-full active:scale-[.98]">JOGAR NOVAMENTE</button>
      </div>

      <!-- Modal confirmar jogar novamente -->
      <div id="confirm-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="w-10/12 max-w-[420px] bg-white/95 text-[#0a2960] rounded-2xl p-5 shadow-xl">
          <div class="font-[800] text-lg mb-1">Jogar novamente?</div>
          <div class="text-sm opacity-80">Se voltares a jogar sem submeter, esta pontuação não será guardada.</div>
          <div class="mt-4 flex gap-3">
            <button id="cancel-modal" class="home-glass-btn flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70">Cancelar</button>
            <button id="confirm-again" class="flex-1 px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Jogar sem submeter</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -35s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -32s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -38s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Botão de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>
  `;

  // Botões
  el.querySelector<HTMLButtonElement>('#submit')!.onclick = () => onSubmit();
    // Confirmar jogar novamente
  const againBtn = el.querySelector<HTMLButtonElement>("#again")!;
  const modal = el.querySelector<HTMLDivElement>("#confirm-modal")!;
  const cancelModal = el.querySelector<HTMLButtonElement>("#cancel-modal")!;
  const confirmAgain = el.querySelector<HTMLButtonElement>("#confirm-again")!;
  againBtn.onclick = () => { modal.classList.remove('hidden'); modal.classList.add('flex'); };
  cancelModal.onclick = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); };
  confirmAgain.onclick = () => onRetry();
  el.querySelector<HTMLButtonElement>('#share')!.onclick = async () => {
    const title = '🏆 Alves Bandeira — 50 Anos, 50 Prémios! 🥳🎉';
    // Usar sempre a URL de produção para partilha
    const shareUrl = 'https://saboresdeportugal.vercel.app/?utm_source=share&utm_medium=game&utm_campaign=abgame';
    let handle = '';
    try {
      const { getCachedUser } = await import('../../services/auth');
      const u = getCachedUser();
      if (u?.username) handle = ` (@${u.username})`;
    } catch {}
    const pts = `${score} ponto${score===1?'':'s'}`;
    const line1 = `🏁 Fiz ${pts} no jogo da Alves Bandeira — Sabores de Portugal${handle}!`;
    const line2 = `🔥 Consegues fazer mais?`;
    const line3 = `🎯 Joga aqui: ${shareUrl}`;
    const full = `${title}\n\n${line1}\n${line2}\n${line3}`;
    try {
      // Tentar usar a API nativa de partilha do browser
      const ns: any = navigator as any;
      if (ns.share && ns.canShare && ns.canShare({ text: full })) {
        await ns.share({ 
          title: title,
          text: full
        });
        return;
      }
      
      // Fallback: copiar para clipboard
      await navigator.clipboard.writeText(full);
      alert('Mensagem de partilha copiada para a área de transferência! Cola no teu app favorito (WhatsApp, Telegram, Email, etc.)');
    } catch (error) {
      // Se o utilizador cancelar a partilha, não mostrar erro
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      // Fallback: copiar para clipboard
      try {
        await navigator.clipboard.writeText(full);
        alert('Mensagem de partilha copiada para a área de transferência! Cola no teu app favorito.');
      } catch {
        alert('Não foi possível partilhar. Tenta novamente.');
      }
    }
  };

  // Count-up animation
  const scoreEl = el.querySelector<HTMLDivElement>('#score-num')!;
  const t0 = performance.now(); const dur = 1200;
  const ease = (t:number)=>1-Math.pow(1-t,3);
  const step = (now:number)=>{ const p=Math.min(1,(now-t0)/dur); const v=Math.round(score*ease(p)); scoreEl.textContent=v.toLocaleString('pt-PT'); if(p<1&&el.isConnected) requestAnimationFrame(step); };
  requestAnimationFrame(step);

  

  // Som on/off com persistência
  const soundBtn = el.querySelector<HTMLButtonElement>('#sound')!;
  const soundIcon = el.querySelector<HTMLImageElement>('#sound-icon')!;
  const updateSoundIcon = () => {
    const muted = (localStorage.getItem('ab-muted') === '1');
    soundIcon.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
  };
  updateSoundIcon();
  const toggleMute = () => { 
    const cur = (localStorage.getItem('ab-muted')==='1'); 
    try{localStorage.setItem('ab-muted', cur?'0':'1');}catch{} 
    try { BackgroundMusic.syncFromStorage(); } catch {}
    updateSoundIcon(); 
  };
  soundBtn.onclick = () => toggleMute();
  soundBtn.addEventListener('touchstart', (e)=>{ try{e.preventDefault();}catch{} toggleMute(); }, {passive:false});

  // Press feedback
  el.querySelectorAll<HTMLButtonElement>('.ab-icon-btn, .home-glass-btn, #submit, #again, #share').forEach(btn => {
    const set = (on:boolean)=>btn.classList.toggle('is-pressing', on);
    btn.addEventListener('pointerdown',()=>set(true));
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,()=>set(false)));
  });

  return el;
}

