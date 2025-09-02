export function Home(onPlay: () => void) {
  const el = document.createElement('div');
  el.className = 'screen text-center gap-6';
  el.innerHTML = `
    <div class="absolute inset-0 -z-10 bg-gradient-to-b from-[#0b3a86] via-[#0e56b3] to-[#1081d3]"></div>
    <div class="flex flex-col items-center gap-6 w-full max-w-sm">
      <img alt="Alves Bandeira" src="/assets/graphics/Alves_Bandeira_logo.svg" class="w-24 h-auto drop-shadow"/>
      <div class="text-white/90 text-lg tracking-wide">alves bandeira</div>

      <div class="mt-2 px-5 py-3 bg-white/90 rounded-2xl text-[#0a2960] shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <div class="text-[11px] tracking-[0.2em] font-semibold opacity-80">SCORE</div>
        <div class="text-4xl font-extrabold leading-none">0</div>
      </div>

      <div class="h-12"></div>
      <button id="play" class="px-10 py-4 rounded-full bg-[#0a2960] text-white font-bold text-lg shadow-[0_8px_20px_rgba(2,20,60,0.5)] border border-white/30">JOGAR</button>
      <button id="how" class="mt-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/30">Como jogar</button>

      <div class="text-xs text-white/80 mt-6">Requer ligação HTTPS. Compatível com Safari (iOS) e Chrome (Android).</div>
    </div>
  `;
  el.querySelector<HTMLButtonElement>('#play')!.onclick = () => onPlay();
  el.querySelector<HTMLButtonElement>('#how')!.onclick = () => alert('Mantém o rosto visível e centrado. Os ícones caem — abre a boca para os apanhar! Atenção aos “falsos”: tiram pontos.');
  return el;
}
