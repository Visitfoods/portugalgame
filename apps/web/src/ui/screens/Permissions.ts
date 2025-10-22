import { isSecureContext, ensureAutoplayAudioGate } from "../../platform/DeviceGuard";

// Importar funções de modal do main.ts
declare function showErrorModal(message: string, onClose?: () => void): void;

export function Permissions(onAllow: () => void, onBack: () => void) {
  const el = document.createElement('div');
  el.className = 'screen text-center gap-6 bg-[#243b78]';
  const httpsMsg = isSecureContext() ? '' : '<div class="text-red-400 text-sm">Este site deve ser acedido via HTTPS para permitir a câmara.</div>';
  el.innerHTML = `
    <div class="flex flex-col items-center gap-4 max-w-sm">
      <h2 class="text-xs md:text-sm font-semibold text-center whitespace-nowrap uppercase">PRECISAMOS DE ACESSO À CÂMARA PARA JOGARES</h2>
      ${httpsMsg}
      <button id="allow" class="px-6 py-3 rounded-full bg-[#1f4590] text-white font-medium shadow active:scale-[.98] transition uppercase">PERMITIR CÂMARA</button>
      <button id="back" class="px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 active:scale-[.98] transition uppercase">VOLTAR</button>
      <div class="text-xs text-white/60 mt-4 text-center uppercase">USAMOS APENAS A CÂMARA FRONTAL PARA DETETAR O ROSTO. NÃO GUARDAMOS DADOS NO SERVIDOR.</div>
    </div>
  `;
  el.querySelector<HTMLButtonElement>('#allow')!.onclick = async () => {
    try {
      try { ensureAutoplayAudioGate(); } catch {}
      // Pre-request camera on explicit user gesture to satisfy iOS
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      // Immediately stop tracks; game screen will re-open it
      stream.getTracks().forEach(t => t.stop());
      onAllow();
    } catch (e) {
      console.error('Camera permission error:', e);
      showErrorModal('NÃO FOI POSSÍVEL ACEDER À CÂMARA. VERIFICA PERMISSÕES DO BROWSER.');
    }
  };
  el.querySelector<HTMLButtonElement>('#back')!.onclick = () => onBack();
  return el;
}
