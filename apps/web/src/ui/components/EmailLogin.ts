import { AuthService } from '../../services/auth';

export function EmailLogin(onSent: () => void, onCancel: () => void, getPendingScore?: () => number | null) {
  const wrap = document.createElement('div');
  wrap.className = 'fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm';
  wrap.innerHTML = `
    <div class="w-10/12 max-w-[420px] bg-white/95 text-[#0a2960] rounded-2xl p-5 shadow-xl">
      <div class="font-[800] text-lg mb-1">Entrar para submeter pontuação</div>
      <div class="text-sm opacity-80">Receberás um e‑mail com um link para entrar.</div>
      <div class="mt-4 space-y-3">
        <input id="email" type="email" placeholder="E‑mail" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#0a2960]/30"/>
        <div class="flex gap-3">
          <button id="cancel" class="home-glass-btn flex-1 px-4 py-2 rounded-full text-[#0a2960] border border-[#0a2960]/30 bg-white/70">Cancelar</button>
          <button id="send" class="flex-1 px-4 py-2 rounded-full bg-[#1f4590] text-white font-semibold">Enviar Link Mágico</button>
        </div>
        <div class="flex items-center gap-3">
          <div class="h-px bg-[#0a2960]/20 flex-1"></div>
          <div class="text-xs opacity-70">ou</div>
          <div class="h-px bg-[#0a2960]/20 flex-1"></div>
        </div>
        <button id="google" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] font-semibold border border-[#0a2960]/30 shadow-[0_6px_16px_rgba(2,20,60,0.18)]">Entrar com Google</button>
        <div id="msg" class="text-xs opacity-80"></div>
      </div>
    </div>
  `;

  const input = wrap.querySelector<HTMLInputElement>('#email')!;
  const btnSend = wrap.querySelector<HTMLButtonElement>('#send')!;
  const btnCancel = wrap.querySelector<HTMLButtonElement>('#cancel')!;
  const btnGoogle = wrap.querySelector<HTMLButtonElement>('#google')!;
  const msg = wrap.querySelector<HTMLDivElement>('#msg')!;

  const setBusy = (busy: boolean) => {
    [btnSend, btnCancel, btnGoogle, input].forEach((el: any) => { if (el) el.disabled = busy; });
    btnSend.style.opacity = busy ? '0.7' : '1';
    btnGoogle.style.opacity = busy ? '0.7' : '1';
  };

  const mapError = (code: string) => {
    if (!code) return 'Ocorreu um erro.';
    if (code.includes('operation-not-allowed')) return 'Método desativado no projeto Firebase.';
    if (code.includes('unauthorized-continue-uri')) return 'Domínio/URL de retorno não autorizado nas definições Firebase.';
    if (code.includes('invalid-email')) return 'E‑mail inválido.';
    if (code.includes('too-many-requests')) return 'Muitas tentativas. Tenta novamente mais tarde.';
    return code;
  };

  btnCancel.onclick = () => { onCancel(); wrap.remove(); };
  btnSend.onclick = async () => {
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Introduz um e‑mail válido.'; return; }
    setBusy(true); msg.textContent = 'A enviar…';
    try {
      const score = getPendingScore ? (getPendingScore() ?? null) : null;
      if (score != null) {
        try { localStorage.setItem('ab-pending-score', String(score)); } catch {}
      }
      const completeUrl = `${(import.meta as any).env?.VITE_AUTH_CONTINUE_URL || location.origin + "/auth-complete"}`;
      await AuthService.sendMagicLink(email, completeUrl);
      msg.textContent = 'Link enviado! Verifica o teu e‑mail.';
      setTimeout(() => { onSent(); wrap.remove(); }, 900);
    } catch (e: any) {
      const code = e?.code || e?.message || String(e);
      msg.textContent = `Falha ao enviar link. ${mapError(code)}`;
    } finally { setBusy(false); }
  };

  btnGoogle.onclick = async () => {
    setBusy(true); msg.textContent = 'A abrir Google…';
    try {
      await AuthService.signInWithGoogle();
      onSent(); wrap.remove();
      try { setTimeout(() => location.assign('/auth-complete'), 100); } catch {}
    } catch (e: any) {
      const code = e?.code || e?.message || String(e);
      msg.textContent = `Falha no Google Sign‑In. ${mapError(code)}`;
    } finally { setBusy(false); }
  };

  return wrap;
}


