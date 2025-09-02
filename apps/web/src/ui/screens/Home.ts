export function Home(onPlay: () => void) {
  const el = document.createElement('div');
  // Full-screen stage, we control layers manually
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo (marquee infinito com instâncias desfasadas) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: -18s;"/>
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-24 left-0 w-[28%] max-w-[220px] -z-10 opacity-70 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 54s; --ab-delay: -41s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-left"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -9s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[30%] max-w-[230px] -z-10 opacity-60 ab-cloud-marquee-left"  style="--ab-cloud-scroll-dur: 40s; --ab-delay: -27s;"/>

    <!-- Conteúdo principal -->
    <div class="relative z-10 w-full flex flex-col items-center">
      <!-- Logo com parallax de nuvens (algumas atrás e outras à frente) -->
      <div class="relative mt-0 w-full h-[150px] flex items-start justify-center overflow-visible">
        <!-- Nuvem atrás do logotipo -->
        <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-8 left-0 w-[28%] max-w-[240px] opacity-70 z-[5] ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 56s; --ab-delay: -18s;"/>
        <!-- Logotipo -->
        <img id="ab-logo" src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="relative z-[10] w-[170px] md:w-[200px] h-auto"/>
        <!-- Nuvem à frente do logotipo -->
        <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[26%] max-w-[220px] opacity-80 z-[20] ab-cloud-marquee-left" style="--ab-cloud-scroll-dur: 50s; --ab-delay: -32s;"/>
      </div>

      <!-- Título + nuvens de revelação (01/02 clonadas, muito maiores e com animações diferentes) -->
      <div class="relative mt-4 w-10/12 max-w-[720px] overflow-visible">
        <img id="title" src="/assets/graphics/Titulo-Jogo.svg" alt="Apanha os Sabores de Portugal" class="relative z-[2] w-full h-auto ab-anim-fade-zoom-in"/>
        <!-- Clones enormes para o efeito de revelar -->
        <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute left-[-10%] top-[-6%] w-[120%] z-[3] ab-reveal-cloud-left"/>
        <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute right-[-10%] top-[-8%] w-[126%] z-[3] ab-reveal-cloud-right"/>
      </div>

      <!-- Nuvens 05/06 pequenas por baixo do título (marquee lento) -->
      <div class="relative mt-2 w-10/12 max-w-[720px] h-8 overflow-visible">
        <img src="/assets/graphics/Nuvem-05.svg" alt="" class="absolute top-0 left-0 w-[18%] opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 60s; --ab-delay: -12s;"/>
        <img src="/assets/graphics/Nuvem-06.svg" alt="" class="absolute top-1 right-0 w-[16%] opacity-90 ab-cloud-marquee-left"  style="--ab-cloud-scroll-dur: 58s; --ab-delay: -33s;"/>
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
    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -25s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -59s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-left"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -31s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-left"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -11s;"/>
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
