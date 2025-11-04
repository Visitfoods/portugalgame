 

import { BackgroundMusic } from '../../core/engine/Audio';

// Importar funções de modal do main.ts
declare function showInfoModal(message: string, onClose?: () => void): void;
declare function showErrorModal(message: string, onClose?: () => void): void;

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
      <img id="result-summary-logo" src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="h-auto ab-logo-white result-summary-logo"/>
    </div>

    <div class="relative z-10 w-full flex flex-col items-center result-summary-container">
      <!-- Parabéns -->
      <div id="result-summary-title" class="text-center text-white font-[800] tracking-[0.06em] result-summary-title">PARABÉNS!</div>

      <!-- Score com troféu -->
      <div class="relative flex items-center justify-center gap-4 result-summary-score">
        <img src="/assets/graphics/trophy.svg" class="w-20 h-20 select-none" style="will-change: auto; contain: layout paint; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;" alt="Troféu"/>
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
      <div class="w-9/12 max-w-[420px] flex flex-col items-center gap-5 md:gap-6 result-summary-actions">
        <button id="submit" class="px-8 py-3 rounded-full bg-[#1f4590] text-white font-[800] text-lg shadow-[0_10px_24px_rgba(2,20,60,0.35)] border border-white/40 w-full active:scale-[.98]">SUBMETER</button>
        <button id="share" class="btn-share relative px-5 py-2 rounded-full bg-white text-[#0a2960] font-semibold text-sm md:text-base border border-white/80 shadow-[0_6px_16px_rgba(2,20,60,0.18)] w-full active:scale-[.98]">
          <img src="/assets/graphics/Share_Icon.svg" alt="" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"/>
          <span class="pl-3">Partilhar Pontuação</span>
        </button>
        <button id="again" class="px-8 py-3 rounded-full bg-white/15 text-white/90 font-semibold border border-white/60 w-full active:scale-[.98]">JOGAR NOVAMENTE</button>
      </div>

      <!-- Modal de opções de partilha -->
      <div id="share-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="w-10/12 max-w-[420px] bg-white/95 text-[#0a2960] rounded-2xl p-5 shadow-xl">
          <div class="font-[800] text-lg mb-4 text-center">PARTILHAR PONTUAÇÃO</div>
          <div class="grid grid-cols-2 gap-3">
            <button id="share-whatsapp" class="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 active:scale-[.98]">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="#25D366"/>
                </svg>
              </div>
              <span class="text-xs font-semibold">WhatsApp</span>
            </button>
            <button id="share-instagram" class="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 active:scale-[.98]">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#E4405F"/>
                </svg>
              </div>
              <span class="text-xs font-semibold">Instagram</span>
            </button>
            <button id="share-facebook" class="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 active:scale-[.98]">
              <div class="w-8 h-8 flex items-center justify-center">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
              </div>
              <span class="text-xs font-semibold">Facebook</span>
            </button>
            <button id="share-copy" class="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 active:scale-[.98]">
              <div class="w-8 h-8 flex items-center justify-center">
                <span class="text-gray-600 font-bold text-sm">📋</span>
              </div>
              <span class="text-xs font-semibold">Copiar</span>
            </button>
          </div>
          <button id="close-share-modal" class="mt-4 w-full px-4 py-2 rounded-full text-white font-semibold" style="background-color: #243b78;">Cancelar</button>
        </div>
      </div>

      <!-- Modal confirmar jogar novamente -->
      <div id="confirm-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="w-10/12 max-w-[420px] bg-white/95 text-[#0a2960] rounded-2xl p-5 shadow-xl">
          <div class="font-[800] text-sm md:text-base mb-1 whitespace-nowrap">JOGAR NOVAMENTE?</div>
          <div class="text-xs opacity-80">SE VOLTARES A JOGAR SEM SUBMETER, ESTA PONTUAÇÃO NÃO SERÁ GUARDADA.</div>
          <div class="mt-6 flex gap-3">
            <button id="cancel-modal" class="home-glass-btn flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70 text-xs whitespace-nowrap">CANCELAR</button>
            <button id="confirm-again" class="flex-1 px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-xs whitespace-nowrap">JOGAR SEM SUBMETER</button>
          </div>
        </div>
      </div>

      <!-- Modal confirmar sair sem submeter -->
      <div id="exit-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="w-10/12 max-w-[420px] bg-white/95 text-[#0a2960] rounded-2xl p-5 shadow-xl">
          <div class="font-[800] text-sm md:text-base mb-1 whitespace-nowrap">PRETENDES SAIR SEM SUBMETER?</div>
          <div class="text-xs opacity-80">SE SAÍRES AGORA SEM SUBMETER, ESTA PONTUAÇÃO NÃO SERÁ GUARDADA.</div>
          <div class="mt-6 flex gap-3">
            <button id="cancel-exit-modal" class="home-glass-btn flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70 text-xs whitespace-nowrap">CANCELAR</button>
            <button id="confirm-exit" class="flex-1 px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold text-xs whitespace-nowrap">SAIR SEM SUBMETER</button>
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

    <!-- Botão de voltar à home (canto inferior direito) -->
    <button id="home" class="ab-icon-btn fixed right-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Voltar à Home">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#243a79" d="M12 3.2l8 6.4v10a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14H10v6.1a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V9.6l8-6.4zM3.6 9L2 10.3l.8 1 .8-.6V9zm18.4 1.3L20.4 9v1.7l.8.6.8-1z"/>
      </svg>
    </button>
  `;
  let cleanupLogoAdjust: (() => void) | null = null;

  // Botões
  el.querySelector<HTMLButtonElement>('#submit')!.onclick = () => { cleanupLogoAdjust?.(); onSubmit(); };
  
    // Confirmar jogar novamente
  const againBtn = el.querySelector<HTMLButtonElement>("#again")!;
  const modal = el.querySelector<HTMLDivElement>("#confirm-modal")!;
  const cancelModal = el.querySelector<HTMLButtonElement>("#cancel-modal")!;
  const confirmAgain = el.querySelector<HTMLButtonElement>("#confirm-again")!;
  againBtn.onclick = () => { modal.classList.remove('hidden'); modal.classList.add('flex'); };
  cancelModal.onclick = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); };
  confirmAgain.onclick = () => {
    cleanupLogoAdjust?.();
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    onRetry();
  };

  // Confirmar sair sem submeter
  const homeBtn = el.querySelector<HTMLButtonElement>("#home")!;
  const exitModal = el.querySelector<HTMLDivElement>("#exit-modal")!;
  const cancelExitModal = el.querySelector<HTMLButtonElement>("#cancel-exit-modal")!;
  const confirmExit = el.querySelector<HTMLButtonElement>("#confirm-exit")!;
  homeBtn.onclick = () => { exitModal.classList.remove('hidden'); exitModal.classList.add('flex'); };
  cancelExitModal.onclick = () => { exitModal.classList.add('hidden'); exitModal.classList.remove('flex'); };
  confirmExit.onclick = () => {
    // Voltar à home sem submeter (mesmo comportamento que jogar novamente)
    cleanupLogoAdjust?.();
    onRetry();
  };
  // Função para gerar texto de partilha
  const generateShareText = async () => {
    const title = '🏆 Alves Bandeira — 50 Anos, 50 Prémios! 🎉';
    const shareUrl = 'https://saboresdeportugal.vercel.app/?utm_source=share&utm_medium=game&utm_campaign=abgame';
    let handle = '';
    try {
      const { getCachedUser } = await import('../../services/auth');
      const u = getCachedUser();
      if (u?.username) handle = ` (@${u.username})`;
    } catch {}
    const pts = `${score} ponto${score===1?'':'s'}`;
    const line1 = `🎮 Fiz ${pts} no jogo da Alves Bandeira — Sabores de Portugal${handle}!`;
    const line2 = `🔥 Consegues fazer mais?`;
    const line3 = `🎯 Joga aqui: ${shareUrl}`;
    return {
      title,
      full: `${title}\n\n${line1}\n${line2}\n${line3}`,
      url: shareUrl
    };
  };

  // Abrir modal de partilha
  el.querySelector<HTMLButtonElement>('#share')!.onclick = () => {
    const modal = el.querySelector<HTMLDivElement>('#share-modal')!;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  // Fechar modal de partilha
  el.querySelector<HTMLButtonElement>('#close-share-modal')!.onclick = () => {
    const modal = el.querySelector<HTMLDivElement>('#share-modal')!;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // Partilhar no WhatsApp
  el.querySelector<HTMLButtonElement>('#share-whatsapp')!.onclick = async () => {
    const { full } = await generateShareText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(full)}`;
    window.open(whatsappUrl, '_blank');
    const modal = el.querySelector<HTMLDivElement>('#share-modal')!;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // --- deteção de plataforma ---
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // --- copy robusto (com fallback) ---
  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); 
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    }
  }

  // --- guia rápido em popup/modal (ajusta ao teu UI) ---
  function showGuide({ platform, message }: { platform: string; message: string }) {
    const stepsIOS = [
      'Texto copiado ✅',
      'Instagram deve abrir nas Mensagens',
      'Se não, vai a Mensagens (DM)',
      'Escolher contacto',
      'Colar e enviar'
    ];
    const stepsAND = [
      'Tentando abrir direto nas DMs...',
      'Texto copiado ✅',
      'Se não abriu nas DMs, vai a Mensagens',
      'Escolher contacto',
      'Colar e enviar'
    ];
    const steps = platform === 'ios' ? stepsIOS : stepsAND;

    showInfoModal(`PARTILHAR NO INSTAGRAM\n\n${steps.map(s => '• ' + s).join('\n')}`);
  }

  // --- tentativa de abrir deep link, com fallback por tempo ---
  function tryOpen(uri: string, fallback: () => void, timeout = 1200) {
    let done = false;
    const t = setTimeout(() => {
      if (done) return;
      done = true;
      if (typeof fallback === 'function') fallback();
    }, timeout);

    // Tenta abrir a app
    window.location.href = uri;

    // nota: não há forma 100% fiável de saber se abriu.
    // usamos apenas o timeout para acionar fallback.
    setTimeout(() => { if (!done) { done = true; clearTimeout(t); } }, timeout + 50);
  }

  // --- Web Share API primeiro (melhor UX iOS/Android) ---
  async function shareViaSystem(full: string, url: string): Promise<boolean> {
    if (!navigator.share) return false;
    try {
      await navigator.share({ title: 'Sabores de Portugal', text: full, url });
      return true; // utilizador escolhe app (às vezes inclui IG)
    } catch {
      return false; // cancelou ou não disponível
    }
  }

  // --- handler principal para Instagram ---
  async function shareToInstagram() {
    const { full, url } = await generateShareText();

    // 1) Tenta o menu nativo (melhor experiência)
    const usedSystem = await shareViaSystem(full, url);
    if (usedSystem) return; // já partilhou via folha do sistema

    // 2) Fluxo específico por plataforma
    if (isAndroid) {
      // Android: Tenta múltiplas estratégias para ir direto às DMs
      const dmLinks = [
        'instagram://direct',           // Melhor opção (funciona em alguns Android)
        'instagram://messages',         // Alternativa
        'instagram://app'               // Fallback para homepage
      ];
      
      let linkIndex = 0;
      const tryNextLink = async () => {
        if (linkIndex >= dmLinks.length) {
          // Todos os deep links falharam, usar fallback
          await copyToClipboard(full);
          window.location.href = 'instagram://app';
          setTimeout(() => window.open('https://instagram.com/', '_blank'), 300);
          showGuide({ platform: 'android', message: full });
          return;
        }
        
        const currentLink = dmLinks[linkIndex];
        if (!currentLink) {
          tryNextLink();
          return;
        }
        linkIndex++;
        
        tryOpen(
          currentLink,
          () => tryNextLink(), // Se falhar, tenta o próximo
          800 // Timeout mais curto para tentar múltiplos links
        );
      };
      
      tryNextLink();
      
    } else if (isIOS) {
      // iOS: Tenta ir direto às DMs (pode não funcionar, mas tentamos)
      const iosDmLinks = [
        'instagram://direct',           // Pode funcionar em iOS mais recentes
        'instagram://app'               // Fallback para homepage
      ];
      
      let linkIndex = 0;
      const tryNextLink = async () => {
        if (linkIndex >= iosDmLinks.length) {
          // Fallback final
          await copyToClipboard(full);
          window.location.href = 'instagram://app';
          setTimeout(() => window.open('https://instagram.com/', '_blank'), 300);
          showGuide({ platform: 'ios', message: full });
          return;
        }
        
        const currentLink = iosDmLinks[linkIndex];
        if (!currentLink) {
          tryNextLink();
          return;
        }
        linkIndex++;
        
        tryOpen(
          currentLink,
          () => tryNextLink(),
          800
        );
      };
      
      tryNextLink();
      
    } else {
      // Desktop/Outros: Tentar ir direto às DMs via web
      await copyToClipboard(full);
      
      // Tenta abrir direto nas mensagens via web
      const webDmUrl = 'https://www.instagram.com/direct/inbox/';
      try {
        window.open(webDmUrl, '_blank');
        // Se falhar, abre homepage normal
        setTimeout(() => {
          window.open('https://instagram.com/', '_blank');
        }, 1000);
      } catch {
        window.open('https://instagram.com/', '_blank');
      }
      
        showInfoModal('TEXTO COPIADO! ABRE O INSTAGRAM, VAI A MENSAGENS (DM), COLA E ENVIA.');
    }
  }

  // Partilhar no Instagram
  el.querySelector<HTMLButtonElement>('#share-instagram')!.onclick = async () => {
    await shareToInstagram();
    
    const modal = el.querySelector<HTMLDivElement>('#share-modal')!;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // Partilhar no Facebook
  el.querySelector<HTMLButtonElement>('#share-facebook')!.onclick = async () => {
    const { url, title } = await generateShareText();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, '_blank');
    const modal = el.querySelector<HTMLDivElement>('#share-modal')!;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // Copiar texto
  el.querySelector<HTMLButtonElement>('#share-copy')!.onclick = async () => {
    const { full } = await generateShareText();
    try {
      await navigator.clipboard.writeText(full);
      showInfoModal('MENSAGEM DE PARTILHA COPIADA PARA A ÁREA DE TRANSFERÊNCIA! COLA NO TEU APP FAVORITO.');
    } catch {
      showErrorModal('NÃO FOI POSSÍVEL COPIAR. TENTA NOVAMENTE.');
    }
    const modal = el.querySelector<HTMLDivElement>('#share-modal')!;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  };

  // Count-up animation
  const scoreEl = el.querySelector<HTMLDivElement>('#score-num')!;
  const t0 = performance.now(); const dur = 1200;
  const ease = (t:number)=>1-Math.pow(1-t,3);
  const step = (now:number)=>{ const p=Math.min(1,(now-t0)/dur); const v=Math.round(score*ease(p)); scoreEl.textContent=v.toLocaleString('pt-PT'); if(p<1&&el.isConnected) requestAnimationFrame(step); };
  requestAnimationFrame(step);

  cleanupLogoAdjust = null;
  const logo = el.querySelector<HTMLImageElement>('#result-summary-logo');
  const titleEl = el.querySelector<HTMLDivElement>('#result-summary-title');
  let resizeRaf = 0;

  if (logo && titleEl) {
    const minWidth = 96;
    const gapPx = 12;
    const ratioSource = (logo.naturalWidth && logo.naturalHeight)
      ? logo.naturalHeight / logo.naturalWidth
      : (() => {
          const rect = logo.getBoundingClientRect();
          return rect.width ? rect.height / rect.width : 0.4;
        })();
    const ratio = ratioSource || 0.4;

    const readBaseWidth = () => {
      const prev = logo.style.width;
      logo.style.width = '';
      const measured = parseFloat(window.getComputedStyle(logo).width) || logo.getBoundingClientRect().width || minWidth;
      logo.style.width = prev;
      return measured;
    };

    const applyWidth = (width: number, forceMargin: boolean) => {
      const safeWidth = Math.max(minWidth, Math.round(width * 100) / 100);
      logo.style.width = `${safeWidth}px`;
      if (forceMargin) {
        titleEl.style.marginTop = `${Math.max(8, gapPx)}px`;
      } else {
        titleEl.style.marginTop = '';
      }
    };

    const adaptLogo = () => {
      const baseWidth = readBaseWidth();
      const baseHeight = baseWidth * ratio;
      const logoRect = logo.getBoundingClientRect();
      const titleRect = titleEl.getBoundingClientRect();
      const available = titleRect.top - logoRect.top - gapPx;

      if (!Number.isFinite(available)) return;

      if (available >= baseHeight) {
        applyWidth(baseWidth, false);
        return;
      }

      const targetHeight = Math.max(minWidth * ratio, Math.min(baseHeight, available > 0 ? available : minWidth * ratio));
      const targetWidth = Math.max(minWidth, Math.min(baseWidth, targetHeight / ratio));
      applyWidth(targetWidth, true);

      requestAnimationFrame(() => {
        const afterLogo = logo.getBoundingClientRect();
        const afterTitle = titleEl.getBoundingClientRect();
        if (afterLogo.bottom + gapPx > afterTitle.top && targetWidth > minWidth + 1) {
          const diff = (afterLogo.bottom + gapPx) - afterTitle.top;
          applyWidth(targetWidth - diff * 1.1, true);
        }
      });
    };

    const scheduleAdapt = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(adaptLogo);
    };

    const resizeListener = () => scheduleAdapt();
    const orientationListener = () => scheduleAdapt();

    window.addEventListener('resize', resizeListener);
    window.addEventListener('orientationchange', orientationListener);

    cleanupLogoAdjust = () => {
      window.removeEventListener('resize', resizeListener);
      window.removeEventListener('orientationchange', orientationListener);
      cancelAnimationFrame(resizeRaf);
    };

    setTimeout(adaptLogo, 40);
    setTimeout(adaptLogo, 200);
  }
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




















