export function isSecureContext(): boolean {
  // localhost is OK for dev
  return window.isSecureContext || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

export function isSupportedBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  const isSafari = /safari/.test(ua) && !/chrome|android/.test(ua);
  const isChrome = /chrome|crios|crmo/.test(ua);
  const isAndroidChrome = /android/.test(ua) && isChrome;
  const isiOS = /iphone|ipad|ipod/.test(ua);
  // Accept Safari (iOS) and Chrome (Android), and also desktop for dev
  return isSafari || isAndroidChrome || (!isiOS && !/android/.test(ua));
}

export function ensureAutoplayAudioGate(): void {
  // Audio playback must be triggered by user interaction on iOS. Call this once on first tap.
  const resume = () => {
    const a = new Audio();
    a.muted = true;
    a.play().catch(() => { /* ignore */ });
    document.removeEventListener('touchend', resume);
    document.removeEventListener('click', resume);
  };
  document.addEventListener('touchend', resume, { once: true });
  document.addEventListener('click', resume, { once: true });
}

