export interface LoadingHandle {
  show(message?: string): void;
  hide(): void;
  destroy(): void;
  element(): HTMLElement;
}

export function LoadingOverlay(initialMessage = 'A preparar...'): LoadingHandle {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center bg-black pointer-events-auto';

  const wrap = document.createElement('div');
  wrap.className = 'flex flex-col items-center gap-5 text-center';

  const logo = document.createElement('img');
  logo.src = '/assets/graphics/Alves_Bandeira_logo.svg';
  logo.alt = 'Alves Bandeira';
  logo.className = 'ab-logo-white w-[120px] h-auto opacity-95';

  const spinner = document.createElement('div');
  spinner.className = 'w-10 h-10 rounded-full border-4 border-white/20 border-t-white animate-spin';

  const msg = document.createElement('div');
  msg.className = 'text-white/90 text-base font-semibold';
  msg.textContent = initialMessage;

  wrap.append(logo, spinner, msg);
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


