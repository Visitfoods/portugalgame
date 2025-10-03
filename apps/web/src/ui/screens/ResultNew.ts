export function Result(score: number, onRetry: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';

  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>

    <!-- Nuvens topo -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: -18s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -9s;"/>

    <div class="relative z-10 w-full flex flex-col items-center">
      <!-- Logo -->
      <div class="relative mt-0 w-full h-[130px] flex items-start justify-center overflow-visible pt-3 md:pt-4">
        <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="relative z-[10] w-[150px] md:w-[180px] h-auto ab-logo-white"/>
      </div>

      <!-- Título -->
      <img src="/assets/graphics/Titulo-Jogo.svg" alt="Apanha os Sabores de Portugal" class="mt-4 w-10/12 max-w-[720px] h-auto"/>

      <!-- Cartão de pontuação e formulário -->
      <div class="mt-4 w-11/12 max-w-[680px] bg-white/10 backdrop-blur-sm rounded-[22px] border border-white/25 text-white p-4 sm:p-5">
        <div class="flex items-center justify-center gap-3 sm:gap-4">
          <img src="/assets/graphics/trophy.svg" alt="Troféu" class="w-14 h-14 sm:w-16 sm:h-16 select-none"/>
          <div class="flex flex-col items-start leading-none">
            <div id="score-num" class="text-5xl sm:text-6xl font-[800]">0</div>
            <div class="mt-1 text-[10px] sm:text-xs tracking-[0.22em] font-bold uppercase opacity-90">PONTOS</div>
          </div>
        </div>

        <form id="form" class="mt-3 space-y-2.5">
          <input id="name" type="text" placeholder="Nome" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60" required/>
          <input id="email" type="email" placeholder="E-mail" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60" required/>
          <input id="phone" type="tel" placeholder="Telemóvel (opcional)" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60"/>

          <!-- Consentimento compacto com toggle para ver mais -->
          <div class="mt-1">
            <label class="flex items-start gap-3 text-[11px] text-white/80">
              <input id="consent" type="checkbox" class="mt-0.5 accent-[#1c8aff]"/>
              <span>
                Autorizo o tratamento dos meus dados para participação e contacto.
                <button type="button" id="consent-toggle" class="underline underline-offset-2 text-white/90">Ver termos</button>
              </span>
            </label>
            <div id="consent-more" class="hidden text-[11px] text-white/70 mt-2 leading-snug">
              Autorizo a recolha e tratamento dos meus dados pessoais exclusivamente para participação no jogo, apuramento e entrega de prémios e comunicação associada à campanha. Os dados não serão partilhados com terceiros para outros fins e serão eliminados após o término da iniciativa, salvo obrigação legal.
            </div>
          </div>

          <div class="mt-3 flex flex-col items-center gap-2.5">
            <button type="submit" id="save" class="px-7 py-3 rounded-full bg-[#2472ba] text-white font-bold text-base shadow-[0_8px_20px_rgba(2,20,60,0.35)] border border-white/50 w-full sm:w-auto">GUARDAR REGISTO</button>
            <button type="button" id="again" class="px-7 py-3 rounded-full bg-white/20 text-white font-semibold border border-white/60 w-full sm:w-auto">JOGAR NOVAMENTE</button>
          </div>
        </form>
      </div>
    <!-- Bot�o de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>

</div>

    <!-- Nuvens base + elemento gráfico -->
    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -25s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -59s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -31s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -11s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>
  `;

  const again = el.querySelector<HTMLButtonElement>('#again')!;
  const form = el.querySelector<HTMLFormElement>('#form')!;
  const consentToggle = el.querySelector<HTMLButtonElement>('#consent-toggle')!;
  const consentMore = el.querySelector<HTMLDivElement>('#consent-more')!;

  again.onclick = () => onRetry();
  consentToggle.onclick = () => {
    const hidden = consentMore.classList.contains('hidden');
    consentMore.classList.toggle('hidden', !hidden);
    consentToggle.textContent = hidden ? 'Esconder termos' : 'Ver termos';
  };

  // Count-up animation para o score
  const scoreEl = el.querySelector<HTMLDivElement>('#score-num');
  if (scoreEl) {
    const target = Math.max(0, Number(score) || 0);
    const t0 = performance.now();
    const dur = 1200;
    const ease = (t:number)=>1-Math.pow(1-t,3);
    const step = (now:number)=>{
      const p = Math.min(1, (now - t0)/dur);
      const val = Math.round(target * ease(p));
      scoreEl.textContent = val.toLocaleString('pt-PT');
      if (p < 1 && el.isConnected) requestAnimationFrame(step);
      else scoreEl.textContent = target.toLocaleString('pt-PT');
    };
    requestAnimationFrame(step);
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = (el.querySelector('#name') as HTMLInputElement).value.trim();
    const email = (el.querySelector('#email') as HTMLInputElement).value.trim();
    const phone = (el.querySelector('#phone') as HTMLInputElement).value.trim();
    const consent = (el.querySelector('#consent') as HTMLInputElement).checked;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.length < 2 || name.length > 50) return alert('Nome inválido');
    if (!emailRe.test(email)) return alert('E-mail inválido');
    if (phone && !/^\+?\d{9,15}$/.test(phone)) return alert('Telemóvel inválido');
    if (!consent) return alert('Necessário consentimento para registar.');
    console.log('Registo (MVP):', { name, email, phone, score });
    alert('Registo guardado (local).');
  };

  // Som on/off com persist�ncia
  const soundBtn = el.querySelector<HTMLButtonElement>("#sound");
  const soundIcon = el.querySelector<HTMLImageElement>("#sound-icon");
  if (soundBtn && soundIcon) {
    const updateSoundIcon = () => {
      const muted = (localStorage.getItem("ab-muted") === "1");
      soundIcon.src = muted ? "/assets/graphics/Icon_Volume-Muted.svg" : "/assets/graphics/icon_Volume-On.svg";
      try {
        soundBtn.setAttribute("aria-pressed", muted ? "true" : "false");
        soundBtn.title = muted ? "Som desligado" : "Som ligado";
        soundIcon.classList.remove("ab-icon-swap");
        void (soundIcon as any).offsetWidth;
        soundIcon.classList.add("ab-icon-swap");
      } catch {}
    };
    const toggleMute = () => {
      const current = (localStorage.getItem("ab-muted") === "1");
      try { localStorage.setItem("ab-muted", current ? "0" : "1"); } catch {}
      updateSoundIcon();
    };
    updateSoundIcon();
    soundBtn.onclick = () => toggleMute();
    soundBtn.addEventListener("touchstart", (e) => { try { e.preventDefault(); } catch {} toggleMute(); }, { passive: false });
    soundBtn.onkeydown = (e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleMute(); } };
  }
  // Press feedback para �cones e glass buttons
  el.querySelectorAll<HTMLButtonElement>(".ab-icon-btn, .home-glass-btn").forEach(btn => {
    const set = (on: boolean) => btn.classList.toggle("is-pressing", on);
    btn.addEventListener("pointerdown", () => set(true));
    ["pointerup","pointerleave","pointercancel"].forEach(evt => btn.addEventListener(evt, () => set(false)));
  });
  return el;
}



