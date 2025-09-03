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
      <div class="relative mt-0 w-full h-[130px] flex items-start justify-center overflow-visible">
        <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="relative z-[10] w-[150px] md:w-[180px] h-auto ab-logo-white"/>
      </div>

      <!-- Título -->
      <img src="/assets/graphics/Titulo-Jogo.svg" alt="Apanha os Sabores de Portugal" class="mt-4 w-10/12 max-w-[720px] h-auto"/>

      <!-- Cartão de pontuação e formulário -->
      <div class="mt-6 w-10/12 max-w-[720px] bg-white/10 backdrop-blur-sm rounded-[26px] border border-white/25 text-white p-5 sm:p-7">
        <div class="text-center tracking-[0.25em] text-white/85 text-[12px]">PONTUAÇÃO</div>
        <div class="text-center text-5xl sm:text-6xl font-extrabold my-2">${ptScore}</div>

        <form id="form" class="mt-4 space-y-3">
          <input id="name" type="text" placeholder="Nome" class="w-full px-4 py-3 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60" required/>
          <input id="email" type="email" placeholder="E-mail" class="w-full px-4 py-3 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60" required/>
          <input id="phone" type="tel" placeholder="Telemóvel" class="w-full px-4 py-3 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60" required/>
          <input id="code" type="text" placeholder="Código (opcional)" class="w-full px-4 py-3 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-white/60"/>
          <label class="flex items-start gap-3 text-sm text-white/85 mt-1">
            <input id="consent" type="checkbox" class="mt-1 accent-[#1c8aff]"/>
            <span>Autorizo o tratamento dos meus dados para efeitos de participação no jogo e contacto sobre prémios/campanhas.</span>
          </label>

          <div class="mt-4 flex flex-col items-center gap-3">
            <button type="submit" id="save" class="px-8 py-4 rounded-full bg-[#2472ba] text-white font-bold text-lg shadow-[0_8px_20px_rgba(2,20,60,0.35)] border border-white/50 w-full sm:w-auto">GUARDAR REGISTO</button>
            <button type="button" id="again" class="px-8 py-4 rounded-full bg-white/20 text-white font-bold border border-white/60 w-full sm:w-auto">JOGAR OUTRA VEZ</button>
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

  again.onclick = () => onRetry();

  form.onsubmit = (e) => {
    e.preventDefault();
    const name = (el.querySelector('#name') as HTMLInputElement).value.trim();
    const email = (el.querySelector('#email') as HTMLInputElement).value.trim();
    const phone = (el.querySelector('#phone') as HTMLInputElement).value.trim();
    const code = (el.querySelector('#code') as HTMLInputElement).value.trim();
    const consent = (el.querySelector('#consent') as HTMLInputElement).checked;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.length < 2 || name.length > 50) return alert('Nome inválido');
    if (!emailRe.test(email)) return alert('E-mail inválido');
    if (!/^\+?\d{9,15}$/.test(phone)) return alert('Telemóvel inválido');
    if (!consent) return alert('Necessário consentimento para registar.');
    console.log('Registo (MVP):', { name, email, phone, code, score });
    alert('Registo guardado (local).');
  };

  return el;
}

