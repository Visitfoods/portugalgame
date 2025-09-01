export function Home(onPlay: () => void) {
  const el = document.createElement('div');
  el.className = 'screen text-center gap-6';
  el.innerHTML = `
    <div class="flex flex-col items-center gap-4 max-w-sm">
      <img alt="Logo Alves Bandeira" src="/favicon.svg" class="w-14 h-14 opacity-90" onerror="this.style.display='none'"/>
      <h1 class="text-2xl md:text-3xl font-semibold">Apanha os sabores de Portugal</h1>
      <p class="text-white/80">Usa a câmara frontal, abre a boca no momento certo e soma pontos!</p>
      <div class="h-28"></div>
      <button class="btn" id="play">Jogar</button>
      <button class="btn btn-outline mt-2" id="how">Como jogar</button>
      <div class="text-xs text-white/60 mt-4">Requer ligação HTTPS. Compatível com Safari (iOS) e Chrome (Android).</div>
    </div>
  `;
  el.querySelector<HTMLButtonElement>('#play')!.onclick = () => onPlay();
  el.querySelector<HTMLButtonElement>('#how')!.onclick = () => alert('Mantém o rosto visível e centrado. Os ícones caem — abre a boca para os apanhar! Atenção aos “falsos”: tiram pontos.');
  return el;
}

