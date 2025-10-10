export interface LoadingHandle {
  show(message?: string): void;
  hide(): void;
  destroy(): void;
  element(): HTMLElement;
}

export function LoadingOverlay(initialMessage = 'A preparar...'): LoadingHandle {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[60] bg-[#243b78] pointer-events-auto';

  // Logotipo no topo
  const logoContainer = document.createElement('div');
  logoContainer.className = 'absolute top-4 left-1/2 -translate-x-1/2 w-full flex justify-center';
  
  const logo = document.createElement('img');
  logo.src = '/assets/graphics/Alves_Bandeira_logo.svg';
  logo.alt = 'Alves Bandeira';
  logo.className = 'w-[120px] sm:w-[150px] md:w-[180px] h-auto ab-logo-white';
  
  logoContainer.appendChild(logo);

  // Conteúdo central
  const wrap = document.createElement('div');
  wrap.className = 'flex flex-col items-center justify-center min-h-screen gap-5 text-center';

  const spinner = document.createElement('div');
  spinner.className = 'w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin';

  const msg = document.createElement('div');
  msg.className = 'text-white/90 text-base font-semibold';
  msg.textContent = initialMessage;

  wrap.append(spinner, msg);
  overlay.appendChild(logoContainer);
  overlay.appendChild(wrap);

  let mounted = false;

  function ensureMounted() {
    if (!mounted) {
      document.body.appendChild(overlay);
      mounted = true;
    }
  }

  return {
    show(message?: string) {
      ensureMounted();
      if (message) msg.textContent = message;
      overlay.style.display = '';
      overlay.style.opacity = '1';
    },
    hide() {
      overlay.style.opacity = '0';
      overlay.style.display = 'none';
    },
    destroy() {
      try { overlay.remove(); } catch {}
    },
    element() { return overlay; }
  };
}


