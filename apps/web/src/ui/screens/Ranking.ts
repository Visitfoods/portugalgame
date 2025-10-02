export interface RankEntry { pos: number; name: string; score: number; email?: string }
import { topScores, searchByUsername } from '../../services/score';

export function Ranking(onPlay: () => void, onBack?: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';

  let top: RankEntry[] = [];

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

      <!-- Título -->
      <div class="mt-2 text-white text-2xl md:text-3xl font-[800] tracking-[0.06em]">CLASSIFICAÇÃO</div>

      <!-- Quadro -->
      <div class="mt-3 w-11/12 max-w-[640px] bg-white/90 text-[#0a2960] rounded-[22px] shadow-[0_12px_28px_rgba(2,20,60,0.22)] overflow-hidden">
        <!-- Barra de pesquisa -->
        <div class="flex items-center gap-2 px-4 py-3 border-b-2 border-[#1f4590]/30 text-[#1f4590]">
          <img src="/assets/graphics/lupa-icon.svg" alt="Pesquisar" class="w-[18px] h-[18px]"/>
          <input id="search" type="text" placeholder="Procurar por username" class="flex-1 bg-transparent outline-none placeholder-[#1f4590]/70"/>
        </div>
        <!-- Lista top 5 -->
        <div id="list" class="divide-y-2 divide-[#1f4590]/30">
        </div>
      </div>

      <!-- Ações -->
      <div class="mt-5 w-9/12 max-w-[420px] flex flex-col items-center gap-4">
        <button id="view-all" class="home-glass-btn px-6 py-2 rounded-full text-white font-semibold border border-white/60 bg-white/15 backdrop-blur-sm shadow-[0_6px_16px_rgba(2,20,60,0.25)] active:scale-[.98]">VER TODOS</button>
        <img id="play" src="/assets/graphics/Botao-Jogar_Normal.svg" alt="Jogar" class="btn-play w-9/12 max-w-[300px] h-auto cursor-pointer active:scale-[.98] transition"/>
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

    <!-- Botão Home (centro inferior) -->
    <button id="home" class="ab-icon-btn fixed left-1/2 -translate-x-1/2 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Início">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#243a79" d="M12 3.2l8 6.4v10a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14H10v6.1a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V9.6l8-6.4zM3.6 9L2 10.3l.8 1 .8-.6V9zm18.4 1.3L20.4 9v1.7l.8.6.8-1z"/>
      </svg>
    </button>
  `;

  // Render list
  const list = el.querySelector<HTMLDivElement>('#list')!;
  function renderRows(rows: RankEntry[]) {
    list.innerHTML = rows.map(r => `
      <div class="grid grid-cols-[38px_1fr_auto] items-center px-4 py-3">
        <div class="text-[#1f4590] font-[800] text-xl flex items-center justify-center">${r.pos === 1 ? '<span class=\'w-9 h-9 rounded-full bg-[#ffd04a] text-[#0a2960] flex items-center justify-center text-base font-[800]\'>1</span>' : r.pos}</div>
        <div class="text-[#0a2960] font-[800] pl-2">${r.name}</div>
        <div class="text-[#0a2960] font-[800] pr-3 text-right">${r.score}</div>
      </div>
    `).join('');
  }
  function toUniqueByUsername(rows: { username: string; score: number }[], max = 50) {
    const seen = new Set<string>();
    const out: RankEntry[] = [];
    for (const r of rows) {
      const key = r.username?.toLowerCase?.() || '';
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push({ pos: out.length + 1, name: r.username, score: r.score });
      if (out.length >= max) break;
    }
    return out;
  }

  (async () => {
    try {
      // Buscar mais registos e depois deduplicar por username para ficar só o melhor de cada jogador
      const rows = await topScores(300);
      top = toUniqueByUsername(rows, 50);
      renderRows(top);
    } catch {
      renderRows([]);
    }
  })();

  // Search by username
  const search = el.querySelector<HTMLInputElement>('#search')!;
  search.oninput = () => {
    const q = search.value.trim().toLowerCase();
    if (!q) { renderRows(top); return; }
    (async () => {
      try {
        const rows = await searchByUsername(q, 120);
        // Ordenar por pontuação desc e deduplicar para reter apenas o melhor por username
        rows.sort((a,b) => (b.score||0) - (a.score||0));
        const mapped = toUniqueByUsername(rows, 50);
        renderRows(mapped.length ? mapped : top);
      } catch {
        renderRows(top);
      }
    })();
  };

  // Buttons
  el.querySelector<HTMLImageElement>('#play')!.onclick = () => onPlay();
  el.querySelector<HTMLButtonElement>('#view-all')!.onclick = () => alert('Lista completa em breve.');

  // Botão Home - voltar à Home
  el.querySelector<HTMLButtonElement>('#home')!.onclick = () => { if (onBack) onBack(); };

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

  // Press feedback
  el.querySelectorAll<HTMLButtonElement>('.ab-icon-btn, .home-glass-btn').forEach(btn => {
    const set = (on:boolean)=>btn.classList.toggle('is-pressing', on);
    btn.addEventListener('pointerdown',()=>set(true));
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,()=>set(false)));
  });

  return el;
}
