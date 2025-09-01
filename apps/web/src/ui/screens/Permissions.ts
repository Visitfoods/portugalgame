import { isSecureContext } from "../../platform/DeviceGuard";

export function Permissions(onAllow: () => void, onBack: () => void) {
  const el = document.createElement('div');
  el.className = 'screen text-center gap-6';
  const httpsMsg = isSecureContext() ? '' : '<div class="text-red-400 text-sm">Este site deve ser acedido via HTTPS para permitir a câmara.</div>';
  el.innerHTML = `
    <div class="flex flex-col items-center gap-4 max-w-sm">
      <h2 class="text-xl md:text-2xl font-semibold">Precisamos de acesso à câmara para jogares.</h2>
      ${httpsMsg}
      <button id="allow" class="btn mt-2">Permitir câmara</button>
      <button id="back" class="btn btn-outline mt-2">Voltar</button>
      <div class="text-xs text-white/60 mt-4">Usamos apenas a câmara frontal para detetar o rosto. Não guardamos dados no servidor.</div>
    </div>
  `;
  el.querySelector<HTMLButtonElement>('#allow')!.onclick = () => onAllow();
  el.querySelector<HTMLButtonElement>('#back')!.onclick = () => onBack();
  return el;
}

