export function Result(score: number, onRetry: () => void) {
  const el = document.createElement('div');
  el.className = 'screen text-center gap-6';
  el.innerHTML = `
    <div class="flex flex-col items-center gap-4 max-w-sm">
      <h2 class="text-2xl font-semibold">Obrigado por jogares!</h2>
      <p class="text-white/80">Pontuação final: <span class="font-bold">${score}</span></p>
      <div class="flex gap-3">
        <button id="retry" class="btn">Tentar novamente</button>
        <button id="register" class="btn btn-outline">Registar resultado</button>
      </div>
      <form id="form" class="w-full text-left space-y-3 mt-4">
        <div>
          <label class="block text-sm opacity-80">Nome completo</label>
          <input id="name" type="text" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" placeholder="Nome completo" required />
        </div>
        <div>
          <label class="block text-sm opacity-80">Email</label>
          <input id="email" type="email" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" placeholder="email@exemplo.com" required />
        </div>
        <div>
          <label class="block text-sm opacity-80">Telemóvel (opcional)</label>
          <input id="phone" type="tel" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" placeholder="9XXXXXXXX" />
        </div>
        <button type="submit" class="btn">Submeter</button>
      </form>
      <button id="share" class="btn btn-outline">Partilhar</button>
    </div>
  `;

  el.querySelector<HTMLButtonElement>('#retry')!.onclick = () => onRetry();
  el.querySelector<HTMLButtonElement>('#register')!.onclick = () => document.getElementById('form')!.scrollIntoView({ behavior: 'smooth' });
  el.querySelector<HTMLButtonElement>('#share')!.onclick = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: 'WebAR Jogo', text: `A minha pontuação: ${score}`, url: location.href });
      } catch {}
    } else {
      alert('Partilha não suportada neste dispositivo.');
    }
  };

  const form = el.querySelector<HTMLFormElement>('#form')!;
  form.onsubmit = (e) => {
    e.preventDefault();
    const name = (el.querySelector('#name') as HTMLInputElement).value.trim();
    const email = (el.querySelector('#email') as HTMLInputElement).value.trim();
    const phone = (el.querySelector('#phone') as HTMLInputElement).value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.length < 2 || name.length > 50) return alert('Nome inválido');
    if (!emailRe.test(email)) return alert('Email inválido');
    if (phone && !/^\+?\d{9,15}$/.test(phone)) return alert('Telemóvel inválido');
    console.log('Form (MVP, sem backend):', { name, email, phone, score });
    alert('Registo efetuado localmente (MVP).');
  };

  return el;
}

