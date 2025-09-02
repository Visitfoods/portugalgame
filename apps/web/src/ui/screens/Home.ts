export function Home(onPlay: () => void) {
  const el = document.createElement('div');
  // Full-screen stage, we control layers manually
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute left-2 top-16 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud" style="--ab-cloud-dur: 10s; --ab-cloud-dx: 28px;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute right-0 top-20 w-[36%] max-w-[280px] -z-10 ab-cloud" style="--ab-cloud-dur: 11s; --ab-cloud-dx: 32px;"/>

    <!-- Conteúdo principal -->
    <div class="relative z-10 w-full flex flex-col items-center">
      <!-- Logo -->
      <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="mt-2 w-[140px] md:w-[170px] h-auto"/>

      <!-- Título + nuvens de revelação (01/02 duplicadas, desaparecem após animar) -->
      <div class="relative mt-4 w-10/12 max-w-[720px]">
        <img id="title" src="/assets/graphics/Titulo-Jogo.svg" alt="Apanha os Sabores de Portugal" class="relative z-[2] w-full h-auto ab-anim-fade-zoom-in"/>
        <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute left-[22%] top-[10%] w-[40%] max-w-[320px] z-[3] ab-reveal-cloud-left"/>
        <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute right-[22%] top-[12%] w-[38%] max-w-[310px] z-[3] ab-reveal-cloud-right"/>
      </div>

      <!-- Nuvens 05/06 pequenas por baixo do título (apenas drift) -->
      <div class="relative mt-2 w-10/12 max-w-[720px] h-8">
        <img src="/assets/graphics/Nuvem-05.svg" alt="" class="absolute left-[12%] top-0 w-[18%] opacity-90 ab-cloud" style="--ab-cloud-dx: 16px; --ab-cloud-dur: 9s;"/>
        <img src="/assets/graphics/Nuvem-06.svg" alt="" class="absolute right-[12%] top-1 w-[16%] opacity-90 ab-cloud" style="--ab-cloud-dx: 18px; --ab-cloud-dur: 9.5s;"/>
      </div>

      <!-- Botões principais -->
      <img id="play" src="/assets/graphics/Botao-Jogar_Normal.svg" alt="Jogar" class="mt-10 w-8/12 max-w-[360px] h-auto cursor-pointer active:scale-[.98] transition"/>
      <img id="how" src="/assets/graphics/Botao-ComoJogar.svg" alt="Como Jogar" class="mt-4 w-7/12 max-w-[320px] h-auto cursor-pointer active:scale-[.98] transition"/>

      <!-- Ícones inferiores -->
      <div class="mt-6 flex items-center justify-center gap-6 md:gap-8 mb-[72px] md:mb-[84px]">
        <img id="settings" src="/assets/graphics/Botao-Settings.svg" alt="Definições" class="w-[52px] md:w-[56px] h-auto cursor-pointer"/>
        <img id="ranking" src="/assets/graphics/Botao-Ranking.svg" alt="Ranking" class="w-[52px] md:w-[56px] h-auto cursor-pointer"/>
        <img id="info" src="/assets/graphics/Botao-Info.svg" alt="Informação" class="w-[52px] md:w-[56px] h-auto cursor-pointer"/>
      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute left-[-120px] bottom-[40px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud" style="--ab-cloud-dur: 13s; --ab-cloud-dx: 40px;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute right-[-120px] bottom-[36px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud" style="--ab-cloud-dur: 14s; --ab-cloud-dx: 44px;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-0 w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Nota de compatibilidade -->
    <div class="absolute left-0 right-0 bottom-2 text-center text-[11px] text-white/85 z-[2] px-4">
      Requer ligação HTTPS. Compatível com Safari (iOS) e Chrome (Android).
    </div>
  `;

  // Ligações
  // Estado pressed do botão JOGAR
  const playBtn = el.querySelector<HTMLImageElement>('#play')!;
  const playSrcNormal = '/assets/graphics/Botao-Jogar_Normal.svg';
  const playSrcPressed = '/assets/graphics/Botao-Jogar_Pressed.svg';
  const setPressed = (pressed: boolean) => {
    playBtn.src = pressed ? playSrcPressed : playSrcNormal;
  };
  playBtn.onpointerdown = () => setPressed(true);
  playBtn.onpointerup = () => setPressed(false);
  playBtn.onpointerleave = () => setPressed(false);
  playBtn.onpointercancel = () => setPressed(false);
  playBtn.onclick = () => onPlay();
  el.querySelector<HTMLImageElement>('#how')!.onclick = () => alert('Mantém o rosto visível e centrado. Os ícones caem — abre a boca para os apanhar! Atenção aos “falsos”: tiram pontos.');
  el.querySelector<HTMLImageElement>('#settings')!.onclick = () => alert('Definições: em breve.');
  el.querySelector<HTMLImageElement>('#ranking')!.onclick = () => alert('Ranking: em breve.');
  el.querySelector<HTMLImageElement>('#info')!.onclick = () => alert('Projeto Alves Bandeira — WebAR jogo promocional.');

  return el;
}
