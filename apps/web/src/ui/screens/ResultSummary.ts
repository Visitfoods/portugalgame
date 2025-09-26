export function ResultSummary(score: number, onSubmit: () => void, onRetry: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';

  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: -18s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -9s;"/>

    <div class="relative z-10 w-full flex flex-col items-center">
      <!-- Logo -->
      <div class="relative mt-1 w-full h-[70px] flex items-start justify-center overflow-visible">
        <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="relative z-[10] w-[110px] md:w-[130px] h-auto ab-logo-white"/>
      </div>

      <!-- Parabéns -->
      <div class="mt-1 text-center text-white font-[800] tracking-[0.06em] text-3xl md:text-4xl">PARABÉNS!</div>

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

      <!-- Posição (mock) -->
      <div id="rank-line" class="mt-3 text-white/90 text-base md:text-lg">ESTÁS NA POSIÇÃO <span id="rank">–</span>º de <span id="total">–</span> jogadores</div>

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
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute left-[-120px] bottom-[40px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -25s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute right-[-120px] bottom-[36px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -31s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-0 w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

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
    const text = `Acabei de fazer ${score} pontos no jogo Alves Bandeira!`;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Pontuação copiada para a área de transferência.');
      }
    } catch {
      /* ignore */
    }
  };

  // Count-up animation
  const scoreEl = el.querySelector<HTMLDivElement>('#score-num')!;
  const t0 = performance.now(); const dur = 1200;
  const ease = (t:number)=>1-Math.pow(1-t,3);
  const step = (now:number)=>{ const p=Math.min(1,(now-t0)/dur); const v=Math.round(score*ease(p)); scoreEl.textContent=v.toLocaleString('pt-PT'); if(p<1&&el.isConnected) requestAnimationFrame(step); };
  requestAnimationFrame(step);

  // Mock de ranking (podes ligar a API quando existir)
  const rank = el.querySelector<HTMLSpanElement>('#rank')!;
  const total = el.querySelector<HTMLSpanElement>('#total')!;
  const tot = 1234; const pos = Math.max(1, Math.min(tot, 200 + Math.floor(Math.random()*300)));
  rank.textContent = String(pos); total.textContent = String(tot);

  // Som on/off com persistência
  const soundBtn = el.querySelector<HTMLButtonElement>('#sound')!;
  const soundIcon = el.querySelector<HTMLImageElement>('#sound-icon')!;
  const updateSoundIcon = () => {
    const muted = (localStorage.getItem('ab-muted') === '1');
    soundIcon.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
  };
  updateSoundIcon();
  const toggleMute = () => { const cur = (localStorage.getItem('ab-muted')==='1'); try{localStorage.setItem('ab-muted', cur?'0':'1');}catch{} updateSoundIcon(); };
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

