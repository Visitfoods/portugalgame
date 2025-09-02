export function Home(onPlay: () => void) {
  const el = document.createElement('div');
  // Full-screen stage, we control layers manually
  el.className = 'screen p-0 overflow-hidden';
  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute left-2 top-16 w-[34%] max-w-[260px] -z-10 opacity-90"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute right-0 top-20 w-[36%] max-w-[280px] -z-10"/>

    <!-- Conteúdo principal -->
    <div class="relative z-10 w-full flex flex-col items-center">
      <!-- Logo -->
      <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="mt-8 w-[120px] md:w-[140px] h-auto"/>

      <!-- Título do jogo -->
      <img src="/assets/graphics/Titulo-Jogo.svg" alt="Apanha os Sabores de Portugal" class="mt-6 w-10/12 max-w-[720px] h-auto"/>

      <!-- Botões principais -->
      <img id="play" src="/assets/graphics/Botao-Jogar.svg" alt="Jogar" class="mt-10 w-8/12 max-w-[360px] h-auto cursor-pointer active:scale-[.98] transition"/>
      <img id="how" src="/assets/graphics/Botao-ComoJogar.svg" alt="Como Jogar" class="mt-4 w-7/12 max-w-[320px] h-auto cursor-pointer active:scale-[.98] transition"/>

      <!-- Ícones inferiores -->
      <div class="mt-6 flex items-center justify-center gap-6 md:gap-8 mb-[120px]">
        <img id="settings" src="/assets/graphics/Botao-Settings.svg" alt="Definições" class="w-[64px] h-auto cursor-pointer"/>
        <img id="ranking" src="/assets/graphics/Botao-Ranking.svg" alt="Ranking" class="w-[64px] h-auto cursor-pointer"/>
        <img id="info" src="/assets/graphics/Botao-Info.svg" alt="Informação" class="w-[64px] h-auto cursor-pointer"/>
      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute left-0 bottom-[92px] w-[50%] max-w-[420px] -z-0"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute right-0 bottom-[88px] w-[58%] max-w-[520px] -z-0"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-0 w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Nota de compatibilidade -->
    <div class="absolute left-0 right-0 bottom-2 text-center text-[11px] text-white/85 z-[2] px-4">
      Requer ligação HTTPS. Compatível com Safari (iOS) e Chrome (Android).
    </div>
  `;

  // Ligações
  el.querySelector<HTMLImageElement>('#play')!.onclick = () => onPlay();
  el.querySelector<HTMLImageElement>('#how')!.onclick = () => alert('Mantém o rosto visível e centrado. Os ícones caem — abre a boca para os apanhar! Atenção aos “falsos”: tiram pontos.');
  el.querySelector<HTMLImageElement>('#settings')!.onclick = () => alert('Definições: em breve.');
  el.querySelector<HTMLImageElement>('#ranking')!.onclick = () => alert('Ranking: em breve.');
  el.querySelector<HTMLImageElement>('#info')!.onclick = () => alert('Projeto Alves Bandeira — WebAR jogo promocional.');

  return el;
}
