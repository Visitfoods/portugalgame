export function Register(onSaved: () => void, onCancel: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';

  el.innerHTML = `
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover"/>
    
    <!-- Logo independente -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[10] w-full flex justify-center">
      <img src="/assets/graphics/Alves_Bandeira_logo.svg" alt="Alves Bandeira" class="w-[150px] md:w-[180px] h-auto ab-logo-white"/>
    </div>
    
    <div class="relative z-10 w-full flex flex-col items-center">
      <div class="mt-20 text-white text-2xl md:text-3xl font-[800] tracking-[0.06em]">Completa o teu registo</div>

      <div class="mt-3 w-11/12 max-w-[680px] bg-white/90 text-[#0a2960] rounded-[22px] shadow-[0_12px_28px_rgba(2,20,60,0.22)] overflow-hidden p-5">
        <form id="form" class="space-y-3">
          <div class="flex items-center justify-center gap-3">
            <img src="/assets/graphics/trophy.svg" alt="Troféu" class="w-12 h-12 select-none"/>
            <div class="text-xs tracking-[0.22em] font-bold uppercase opacity-60">REGISTO</div>
          </div>
          <input id="username" type="text" placeholder="Nome de utilizador" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#1f4590]/30"/>
          <input id="phone" type="tel" placeholder="Telemóvel (opcional)" class="w-full px-4 py-2.5 rounded-full bg-white text-[#0a2960] placeholder-[#0a2960]/60 shadow border border-[#1f4590]/30"/>

          <div class="text-[11px] opacity-80">
            <label class="flex items-start gap-3">
              <input id="consent" type="checkbox" class="mt-0.5 accent-[#1c8aff]"/>
              <span>
                Autorizo o tratamento dos meus dados para participação e contacto.
                <a href="#" class="underline underline-offset-2">Ver termos</a>
              </span>
            </label>
          </div>

          <div class="mt-2 flex flex-col items-center gap-2.5">
            <button id="save" type="submit" class="px-7 py-3 rounded-full bg-[#1f4590] text-white font-semibold shadow-[0_8px_20px_rgba(2,20,60,0.35)] border border-[#0a2960]/20 w-full sm:w-auto">GUARDAR REGISTO</button>
            <button id="cancel" type="button" class="px-7 py-3 rounded-full bg-white/20 text-[#0a2960] font-semibold border border-[#0a2960]/30 w-full sm:w-auto">CANCELAR</button>
            <div id="msg" class="text-xs"></div>
          </div>
        </form>
      </div>
    </div>

    <!-- Nuvens base com marquee e clones desfasados para loop contínuo -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: -10s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -41s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 64s; --ab-delay: -20s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -58s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>
  `;

  const form = el.querySelector<HTMLFormElement>('#form')!;
  const msg = el.querySelector<HTMLDivElement>('#msg')!;
  const cancel = el.querySelector<HTMLButtonElement>('#cancel')!;

  cancel.onclick = () => onCancel();

  form.onsubmit = async (e) => {
    e.preventDefault();
    const username = (el.querySelector('#username') as HTMLInputElement).value.trim();
    const phone = (el.querySelector('#phone') as HTMLInputElement).value.trim();
    const consent = (el.querySelector('#consent') as HTMLInputElement).checked;

    // Validar username
    if (phone && !/^\+?\d{9,15}$/.test(phone)) { msg.textContent = 'Telemóvel inválido.'; msg.style.color = '#a11'; return; }
    if (!consent) { msg.textContent = 'Necessário consentimento.'; msg.style.color = '#a11'; return; }

    try {
      msg.textContent = 'A guardar…'; msg.style.color = '#555';
      const { getCachedUser, setCachedUser } = await import('../../services/auth');
      const { ensureFirestoreOnline } = await import('../../lib/firebase');
      const { validateUsername, isUsernameAvailable, claimUsername, upsertBasicProfile } = await import('../../services/user');
      const cached = getCachedUser();
      if (!cached?.uid) { msg.textContent = 'Sessão inválida. Volta a iniciar sessão.'; msg.style.color = '#a11'; return; }
      const v = validateUsername(username);
      if (!v.ok) { msg.textContent = `Username inválido (${v.reason}).`; msg.style.color = '#a11'; return; }
      
      // Tentar conectar ao Firestore com melhor tratamento de erro
      try { 
        await ensureFirestoreOnline(); 
      } catch (firebaseError: any) {
        console.warn('Firebase connection issue:', firebaseError);
        if (firebaseError?.code === 'unavailable' || firebaseError?.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
          msg.textContent = 'Erro de ligação. Verifica se tens ad-blocker ativo ou tenta novamente.'; 
          msg.style.color = '#a11'; 
          return;
        }
        // Continuar mesmo com erro de ligação para tentar operações offline
      }
      
      const free = await isUsernameAvailable(username);
      if (!free) { msg.textContent = 'Username indisponível.'; msg.style.color = '#a11'; return; }
      const prof = await claimUsername(cached.uid, cached.email, username, undefined);
      await upsertBasicProfile(cached.uid, cached.email, username, { phone, consent: true });
      setCachedUser({ uid: prof.uid, email: prof.email, username: prof.username, displayName: prof.displayName || username });
      msg.textContent = 'Registo guardado!'; msg.style.color = '#1f7a2f';
      setTimeout(() => onSaved(), 300);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error?.code === 'unavailable' || error?.message?.includes('ERR_BLOCKED_BY_CLIENT')) {
        msg.textContent = 'Erro de ligação. Verifica se tens ad-blocker ativo ou tenta novamente.'; 
        msg.style.color = '#a11';
      } else if (error?.message?.includes('username indisponível')) {
        msg.textContent = 'Username indisponível.'; 
        msg.style.color = '#a11';
      } else {
        msg.textContent = 'Falha ao guardar. Tenta novamente.'; 
        msg.style.color = '#a11';
      }
    }
  };

  return el;
}


