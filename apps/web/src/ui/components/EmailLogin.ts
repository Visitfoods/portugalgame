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
        <div id="msg" class="text-xs opacity-80"></div>
      </div>
    </div>
  `;

  const input = wrap.querySelector<HTMLInputElement>('#email')!;
  const btnSend = wrap.querySelector<HTMLButtonElement>('#send')!;
  const btnCancel = wrap.querySelector<HTMLButtonElement>('#cancel')!;
  const msg = wrap.querySelector<HTMLDivElement>('#msg')!;

  const setBusy = (busy: boolean) => {
    btnSend.disabled = busy; btnCancel.disabled = busy; input.disabled = busy;
    btnSend.style.opacity = busy ? '0.7' : '1';
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
      const completeUrl = `${location.origin}/auth-complete`;
      await AuthService.sendMagicLink(email, completeUrl);
      msg.textContent = 'Link enviado! Verifica o teu e‑mail.';
      setTimeout(() => { onSent(); wrap.remove(); }, 900);
    } catch (e: any) {
      const code = e?.code || e?.message || String(e);
      msg.textContent = `Falha ao enviar link. ${code}`;
    } finally {
      setBusy(false);
    }
  };

  return wrap;
}


