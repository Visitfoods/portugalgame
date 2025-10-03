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

    <!-- Logo independente -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-full flex justify-center">
      <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="w-[150px] md:w-[180px] h-auto ab-logo-white"/>
    </div>

    <div class="relative z-10 w-full flex flex-col items-center pb-[160px]">
      <!-- Título -->
      <div class="mt-20 text-white text-2xl md:text-3xl font-[800] tracking-[0.06em]">CLASSIFICAÇÃO</div>

      <!-- Quadro -->
      <div class="mt-3 w-11/12 max-w-[640px] bg-white/90 text-[#0a2960] rounded-[22px] shadow-[0_12px_28px_rgba(2,20,60,0.22)] overflow-hidden">
        <!-- Barra de pesquisa -->
        <div class="flex items-center justify-center px-4 py-3 border-b-2 border-[#1f4590]/30 text-[#1f4590]">
          <div class="flex items-center gap-2">
            <img src="/assets/graphics/lupa-icon.svg" alt="Pesquisar" class="w-[14px] h-[14px]"/>
            <input id="search" type="text" placeholder="Procurar por username" class="bg-transparent outline-none placeholder-[#75808c] text-sm placeholder:text-xs w-48"/>
          </div>
        </div>
        <!-- Lista top 5 -->
        <div id="list" class="divide-y-2 divide-[#1f4590]/30">
        </div>
      </div>

      <!-- Ações -->
      <div class="mt-8 sm:mt-10 md:mt-12 w-9/12 max-w-[420px] flex flex-col items-center gap-6 sm:gap-8">
        <button id="view-all" class="home-glass-btn px-6 py-2 rounded-full text-white font-semibold border border-white/60 bg-white/15 backdrop-blur-sm shadow-[0_6px_16px_rgba(2,20,60,0.25)] active:scale-[.98]">VER TODOS</button>
        <img id="play" src="/assets/graphics/Botao-Jogar_Normal.svg" alt="Jogar" class="btn-play w-9/12 max-w-[300px] h-auto cursor-pointer active:scale-[.98] transition"/>
      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -25s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -59s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -31s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -11s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

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

  // Modal para lista completa
  function showFullRankingModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm';
    
    modal.innerHTML = `
      <div class="relative w-full max-w-[90vw] max-h-[80vh] bg-white/95 rounded-[22px] shadow-[0_20px_40px_rgba(2,20,60,0.3)] overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b-2 border-[#1f4590]/30 bg-[#1f4590]/10">
          <h2 class="text-xl font-[800] text-[#0a2960]">Classificação Completa</h2>
          <button id="close-modal" class="w-8 h-8 rounded-full bg-[#1f4590]/20 text-[#0a2960] hover:bg-[#1f4590]/30 transition flex items-center justify-center">
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
        <div class="p-4 border-t border-[#1f4590]/20 bg-[#1f4590]/5">
          <div class="text-sm text-[#0a2960]/70 text-center">
            Total: <span id="total-count">0</span> participantes
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
            ${r.pos === 1 ? '<span class="w-8 h-8 rounded-full bg-[#ffd04a] text-[#0a2960] flex items-center justify-center text-sm font-[800]">1</span>' : 
              r.pos === 2 ? '<span class="w-8 h-8 rounded-full bg-[#c0c0c0] text-[#0a2960] flex items-center justify-center text-sm font-[800]">2</span>' :
              r.pos === 3 ? '<span class="w-8 h-8 rounded-full bg-[#cd7f32] text-white flex items-center justify-center text-sm font-[800]">3</span>' :
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
