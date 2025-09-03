export function Result(score: number, onRetry: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';

  const ptScore = score.toLocaleString('pt-PT');

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
        <div class="text-center tracking-[0.25em] text-white/80 text-[11px]">PONTUAÇÃO</div>
        <div class="text-center text-4xl sm:text-5xl font-extrabold my-1">${ptScore}</div>

        <form id="form" class="mt-3 space-y-2.5">
          <input id="name" type="text" placeholder="Nome" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60" required/>
          <input id="email" type="email" placeholder="E-mail" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60" required/>
          <input id="phone" type="tel" placeholder="Telemóvel" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60" required/>

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
            <button type="button" id="again" class="px-7 py-3 rounded-full bg-white/20 text-white font-semibold border border-white/60 w-full sm:w-auto">JOGAR OUTRA VEZ</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Nuvens base + elemento gráfico -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute left-[-120px] bottom-[40px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -25s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute right-[-120px] bottom-[36px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -31s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-0 w-full h-[140px] md:h-[180px] object-cover z-[1]"/>
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

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = (el.querySelector('#name') as HTMLInputElement).value.trim();
    const email = (el.querySelector('#email') as HTMLInputElement).value.trim();
    const phone = (el.querySelector('#phone') as HTMLInputElement).value.trim();
    const consent = (el.querySelector('#consent') as HTMLInputElement).checked;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.length < 2 || name.length > 50) return alert('Nome inválido');
    if (!emailRe.test(email)) return alert('E-mail inválido');
    if (!/^\+?\d{9,15}$/.test(phone)) return alert('Telemóvel inválido');
    if (!consent) return alert('Necessário consentimento para registar.');
    console.log('Registo (MVP):', { name, email, phone, score });
    alert('Registo guardado (local).');
  };

  return el;
}
