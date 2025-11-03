export interface RankEntry { pos: number; name: string; score: number; email?: string }
import { topScores, searchByUsername } from '../../services/score';

import { BackgroundMusic } from '../../core/engine/Audio';

export function Ranking(onPlay: () => void, onBack?: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';

  let top: RankEntry[] = [];

  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover min-h-screen"/>

    <!-- Nuvens topo (marquee infinito com instâncias desfasadas) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-24 left-0 w-[28%] max-w-[220px] -z-10 opacity-70 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 54s; --ab-delay: -23s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -26s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[30%] max-w-[230px] -z-10 opacity-60 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 40s; --ab-delay: -20s;"/>

    <div class="ranking-container relative z-10 w-full flex flex-col items-center pb-[160px] min-h-screen justify-start pt-[120px] sm:pt-[140px] md:pt-[160px]">
      <!-- Título -->
      <div class="ranking-title mt-1 sm:mt-2 text-white text-xl md:text-2xl font-[800] tracking-[0.06em]">CLASSIFICAÇÃO</div>

      <!-- Quadro -->
      <div class="ranking-card mt-3 sm:mt-4 w-10/12 sm:w-11/12 max-w-[580px] sm:max-w-[640px] bg-white/90 text-[#0a2960] rounded-[16px] sm:rounded-[20px] shadow-[0_8px_20px_rgba(2,20,60,0.18)] overflow-hidden">
        <!-- Barra de pesquisa -->
        <div class="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-[#1f4590]/30 text-[#1f4590]">
          <div class="flex items-center gap-2">
            <img src="/assets/graphics/lupa-icon.svg" alt="Pesquisar" class="w-[12px] sm:w-[14px] h-[12px] sm:h-[14px]"/>
            <input id="search" type="text" placeholder="Procurar por username" class="bg-transparent outline-none placeholder-[#75808c] text-xs sm:text-sm placeholder:text-xs w-40 sm:w-48"/>
          </div>
        </div>
        <!-- Lista top 5 -->
        <div id="list" class="divide-y-2 divide-[#1f4590]/30">
        </div>
      </div>

      <!-- Secção de Prémios Compacta -->
      <div class="prizes-section mt-3 sm:mt-4 w-10/12 sm:w-11/12 max-w-[580px] sm:max-w-[640px] bg-white rounded-[12px] border border-[#e5e7eb] shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        <!-- Header compacto -->
        <div class="flex items-center justify-center px-2 py-1.5 border-b border-[#e5e7eb] bg-white">
          <img src="/assets/graphics/trophy.svg" alt="Troféu" class="w-4 h-4"/>
          <span class="text-[#0a2960] font-[700] text-xs ml-1">50 PRÉMIOS</span>
        </div>
        
        <!-- Prémios em grid 2x2 -->
        <div class="grid grid-cols-2 gap-2 p-2">
          <!-- 1º Prémio -->
          <div class="flex items-center justify-center gap-1 bg-gradient-to-br from-[#ffd04a] to-[#ffb347] border border-[#ffd04a] rounded px-2 py-1">
            <span class="text-[#0a2960] font-[800] text-xs">1º</span>
            <span class="text-[#0a2960] font-[600] text-xs">500€</span>
          </div>
          
          <!-- 2º Prémio -->
          <div class="flex items-center justify-center gap-1 bg-gradient-to-br from-[#243b78] to-[#1a2d5a] border border-[#243b78] rounded px-2 py-1">
            <span class="text-white font-[800] text-xs">2º</span>
            <span class="text-white font-[600] text-xs">250€</span>
          </div>
          
          <!-- 3º Prémio -->
          <div class="flex items-center justify-center gap-1 bg-gradient-to-br from-[#1a2d5a] to-[#0f1a3a] border border-[#1a2d5a] rounded px-2 py-1">
            <span class="text-white font-[800] text-xs">3º</span>
            <span class="text-white font-[600] text-xs">150€</span>
          </div>
          
          <!-- 4º ao 50º Prémio -->
          <div class="flex items-center justify-center gap-1 bg-gradient-to-br from-[#2472ba] to-[#1c5a9a] border border-[#2472ba] rounded px-2 py-1">
            <span class="text-white font-[800] text-xs">4º-50º</span>
            <span class="text-white font-[600] text-xs">10€</span>
          </div>
        </div>
        
        <!-- Nota sobre combustível -->
        <div class="px-2 pb-1.5 pt-1">
          <p class="text-[#0a2960]/70 text-[9px] text-center font-[500]">
            * Prémios em combustível
          </p>
        </div>
      </div>

      <!-- Ações -->
      <div class="actions-section mt-4 sm:mt-5 w-9/12 max-w-[420px] flex flex-col items-center gap-3 sm:gap-4">
        <button id="view-all" class="home-glass-btn px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-white font-semibold text-sm sm:text-base border border-white/60 bg-white/15 backdrop-blur-sm shadow-[0_6px_16px_rgba(2,20,60,0.25)] active:scale-[.98]">VER TODOS</button>
        <img id="play" src="/assets/graphics/Botao-Jogar_Normal.svg" alt="Jogar" class="btn-play w-5/12 max-w-[160px] h-auto cursor-pointer active:scale-[.98] transition"/>
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

    <!-- Botão Home (canto inferior direito) -->
    <button id="home" class="ab-icon-btn fixed right-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Início">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#243a79" d="M12 3.2l8 6.4v10a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14H10v6.1a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V9.6l8-6.4zM3.6 9L2 10.3l.8 1 .8-.6V9zm18.4 1.3L20.4 9v1.7l.8.6.8-1z"/>
      </svg>
    </button>

  `;

  // Render list
  const list = el.querySelector<HTMLDivElement>('#list')!;
  
  function renderRows(rows: RankEntry[]) {
    // Mostra apenas os primeiros 3 lugares
    const top3 = rows.slice(0, 3);
    list.innerHTML = top3.map(r => `
      <div class="grid grid-cols-[32px_1fr_auto] sm:grid-cols-[38px_1fr_auto] items-center px-3 sm:px-4 py-2 sm:py-3">
        <div class="text-[#1f4590] font-[800] text-lg sm:text-xl flex items-center justify-center">${r.pos === 1 ? '<span class=\'w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#ffd04a] text-[#0a2960] flex items-center justify-center text-sm sm:text-base font-[800]\'>1</span>' : r.pos === 2 ? '<span class=\'w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#243b78] text-white flex items-center justify-center text-sm sm:text-base font-[800]\'>2</span>' : r.pos === 3 ? '<span class=\'w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#1a2d5a] text-white flex items-center justify-center text-sm sm:text-base font-[800]\'>3</span>' : r.pos}</div>
        <div class="text-[#0a2960] font-[800] pl-1 sm:pl-2 text-sm sm:text-base">${r.name}</div>
        <div class="text-[#0a2960] font-[800] pr-2 sm:pr-3 text-right text-sm sm:text-base">${r.score}</div>
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
      renderRows(top); // Mostra apenas top 3 por defeito
    } catch {
      renderRows([]);
    }
  })();

  // Search by username - filter locally loaded data
  const search = el.querySelector<HTMLInputElement>('#search');
  if (!search) {
    console.error('Search input not found!');
  } else {
    search.oninput = () => {
      const q = search.value.trim().toLowerCase();
      console.log('Search query:', q);
      if (!q) { 
        console.log('Empty query, showing top scores');
        renderRows(top); 
        return; 
      }
      
      // Filter locally loaded data instead of querying database
      const filtered = top.filter(entry => 
        entry.name.toLowerCase().startsWith(q)
      );
      console.log('Filtered results:', filtered.length, 'entries');
      renderRows(filtered);
    };
  }

  // Buttons
  el.querySelector<HTMLImageElement>('#play')!.onclick = () => onPlay();
  el.querySelector<HTMLButtonElement>('#view-all')!.onclick = () => showFullRankingModal();

  // Botão Home - voltar à Home
  el.querySelector<HTMLButtonElement>('#home')!.onclick = () => { if (onBack) onBack(); };

  // Som on/off com persistência
  const soundBtn = el.querySelector<HTMLButtonElement>('#sound')!;
  const soundIcon = el.querySelector<HTMLImageElement>('#sound-icon')!;
  const updateSoundIcon = () => {
    const muted = (localStorage.getItem('ab-muted') === '1');
    soundIcon.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
  };
  const toggleMute = () => {
    const cur = (localStorage.getItem('ab-muted')==='1');
    try{localStorage.setItem('ab-muted', cur?'0':'1');}catch{}
    updateSoundIcon();
    try { BackgroundMusic.syncFromStorage(); } catch {}
  };
  updateSoundIcon();
  soundBtn.onclick = () => toggleMute();
  soundBtn.addEventListener('touchstart', (e)=>{ try{e.preventDefault();}catch{} toggleMute(); }, {passive:false});

  // Press feedback
  el.querySelectorAll<HTMLButtonElement>('.ab-icon-btn, .home-glass-btn').forEach(btn => {
    const set = (on:boolean)=>btn.classList.toggle('is-pressing', on);
    btn.addEventListener('pointerdown',()=>set(true));
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>btn.addEventListener(ev,()=>set(false)));
  });

  // Modal para lista completa
  function showFullRankingModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
    
    modal.innerHTML = `
      <div class="relative w-full max-w-[90vw] max-h-[80vh] bg-white/95 rounded-[22px] shadow-[0_20px_40px_rgba(2,20,60,0.3)] overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b-2 border-[#243b78]/30 bg-[#243b78]">
          <h2 class="text-xl md:text-2xl font-[800] text-white">CLASSIFICAÇÃO COMPLETA</h2>
          <button id="close-modal" class="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30 transition flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- Search -->
        <div class="p-4 border-b border-[#1f4590]/20">
          <div class="relative">
            <input id="modal-search" type="text" placeholder="Procurar por username..." 
                   class="w-full px-4 py-2 pl-10 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 border border-[#1f4590]/30 focus:outline-none focus:ring-2 focus:ring-[#1f4590]/30"/>
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1f4590]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        
        <!-- List -->
        <div id="modal-list" class="max-h-[50vh] overflow-y-auto">
          <!-- Lista será preenchida aqui -->
        </div>
        
        <!-- Footer -->
        <div class="p-4 border-t border-[#243b78]/30 bg-[#243b78]">
          <div class="text-xl font-[800] text-white text-center">
            TOTAL: <span id="total-count">0</span> PARTICIPANTES
          </div>
        </div>
      </div>
    `;

    // Função para renderizar a lista no modal
    function renderModalList(rows: RankEntry[]) {
      const modalList = modal.querySelector<HTMLDivElement>('#modal-list')!;
      const totalCount = modal.querySelector<HTMLSpanElement>('#total-count')!;
      
      totalCount.textContent = rows.length.toString();
      
      if (rows.length === 0) {
        modalList.innerHTML = `
          <div class="p-8 text-center text-[#0a2960]/60">
            <div class="text-lg font-semibold mb-2">Nenhum resultado encontrado</div>
            <div class="text-sm">Tenta uma pesquisa diferente</div>
          </div>
        `;
        return;
      }

      modalList.innerHTML = rows.map((r, index) => `
        <div class="grid grid-cols-[50px_1fr_80px] items-center px-4 py-3 hover:bg-[#1f4590]/5 transition">
          <div class="text-[#1f4590] font-[800] text-lg flex items-center justify-center">
            ${r.pos === 1 ? '<span class="w-8 h-8 rounded-full bg-[#ffd04a] text-[#0a2960] flex items-center justify-center text-lg font-[800]">1</span>' : 
              r.pos === 2 ? '<span class="w-8 h-8 rounded-full bg-[#243b78] text-white flex items-center justify-center text-lg font-[800]">2</span>' :
              r.pos === 3 ? '<span class="w-8 h-8 rounded-full bg-[#1a2d5a] text-white flex items-center justify-center text-lg font-[800]">3</span>' :
              r.pos}
          </div>
          <div class="text-[#0a2960] font-[600] pl-2">@${r.name}</div>
          <div class="text-[#0a2960] font-[800] text-right pr-3">${r.score}</div>
        </div>
      `).join('');
    }

    // Carregar dados completos
    (async () => {
      try {
        const allRows = await topScores(1000); // Buscar mais registos
        const allUnique = toUniqueByUsername(allRows, 1000);
        renderModalList(allUnique);
        
        // Search no modal
        const modalSearch = modal.querySelector<HTMLInputElement>('#modal-search')!;
        modalSearch.oninput = () => {
          const query = modalSearch.value.trim().toLowerCase();
          if (!query) {
            renderModalList(allUnique);
            return;
          }
          const filtered = allUnique.filter(entry => 
            entry.name.toLowerCase().includes(query)
          );
          renderModalList(filtered);
        };
      } catch (error) {
        console.error('Error loading full ranking:', error);
        renderModalList([]);
      }
    })();

    // Fechar modal
    modal.querySelector<HTMLButtonElement>('#close-modal')!.onclick = () => {
      modal.remove();
    };
    
    // Fechar ao clicar fora
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };

    // ESC para fechar
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    document.body.appendChild(modal);
  }

  return el;
}
