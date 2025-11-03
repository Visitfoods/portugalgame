import { BackgroundMusic } from '../../core/engine/Audio';

export function TermsAndConditions(onBack: () => void) {
  const el = document.createElement('div');
  el.className = 'screen p-0 overflow-hidden';

  el.innerHTML = `
    <!-- Fundo -->
    <img src="/assets/graphics/Background.svg" alt="" class="absolute inset-0 -z-20 w-full h-full object-cover min-h-screen"/>

    <!-- Nuvens topo (marquee infinito com instâncias desfasadas) -->
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-14 left-0 w-[34%] max-w-[260px] -z-10 opacity-90 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 46s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-01.svg" alt="" class="absolute top-24 left-0 w-[28%] max-w-[220px] -z-10 opacity-70 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 54s; --ab-delay: -23s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-20 right-0 w-[36%] max-w-[280px] -z-10 opacity-85 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 52s; --ab-delay: -26s;"/>
    <img src="/assets/graphics/Nuvem-02.svg" alt="" class="absolute top-10 right-0 w-[30%] max-w-[230px] -z-10 opacity-60 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 40s; --ab-delay: -20s;"/>

    <div class="relative z-10 w-full flex flex-col items-center pb-[160px] min-h-screen justify-center">
      <!-- Título -->
      <div class="mt-8 sm:mt-12 md:mt-16 text-white text-2xl md:text-3xl font-[800] tracking-[0.06em] text-center mb-1 sm:mb-2">
        TERMOS E CONDIÇÕES
      </div>

      <!-- Container principal bem próximo do título -->
      <div class="mt-0 sm:mt-1 w-10/12 sm:w-11/12 max-w-[580px] sm:max-w-[640px] bg-white/90 text-[#0a2960] rounded-[18px] sm:rounded-[22px] shadow-[0_12px_28px_rgba(2,20,60,0.22)] overflow-hidden max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
        
        <!-- Seção Prémios -->
        <div class="p-3 sm:p-4 border-b-2 border-[#243b78]/30 bg-[#243b78]">
          <h2 class="text-base sm:text-lg font-[800] text-white text-center mb-2">PRÉMIOS</h2>
          <div class="space-y-1 text-white text-center">
            <div class="text-xs sm:text-sm"><span class="font-bold">1º prémio:</span> 500€ em senhas de combustível</div>
            <div class="text-xs sm:text-sm"><span class="font-bold">2º prémio:</span> 250€ em senhas de combustível</div>
            <div class="text-xs sm:text-sm"><span class="font-bold">3º prémio:</span> 150€ em senhas de combustível</div>
            <div class="text-xs sm:text-sm"><span class="font-bold">4º ao 50º:</span> 10€ em senhas de combustível</div>
          </div>
        </div>

        <!-- Conteúdo dos Termos -->
        <div class="p-3 sm:p-4 space-y-3 text-xs sm:text-sm">
          
          <!-- Responsável pelo Tratamento -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">Responsável pelo Tratamento</h3>
            <p class="text-[#0a2960] leading-relaxed">
              GRUPO ALVES BANDEIRA, S.A. (NIPC 509 654 185), Zona Industrial da Pedrulha, Lote 12, 3050-183 Casal Comba (Mealhada), Tel. +351 231 244 200, e-mail: rgpd@a-bandeira.pt
            </p>
            <p class="text-[#0a2960] mt-1">
              <a href="https://grupoalvesbandeira.com" class="text-[#243b78] underline">grupoalvesbandeira.com</a>
            </p>
          </div>

          <!-- Encarregada de Proteção de Dados -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">Encarregada de Proteção de Dados (DPO)</h3>
            <p class="text-[#0a2960] leading-relaxed">
              Ana Maria Ferreira e Sousa — contacto: Zona Industrial da Pedrulha, Lote 12, 3050-183 Casal Comba, Tel. +351 231 244 200, e-mail: rgpd@a-bandeira.pt
            </p>
            <p class="text-[#0a2960] mt-1">
              <a href="https://alvesbandeira.pt" class="text-[#243b78] underline">alvesbandeira.pt</a>
            </p>
          </div>

          <!-- Âmbito -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">1) Âmbito</h3>
            <p class="text-[#0a2960] leading-relaxed">
              Esta política aplica-se ao jogo WebAR "Apanha os Sabores de Portugal", acessível via browser móvel, no âmbito das comemorações dos 50 anos da Alves Bandeira, e a qualquer página de resultado/submissão associada.
            </p>
          </div>

          <!-- Que dados tratamos -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">2) Que dados tratamos</h3>
            <div class="space-y-2 text-[#0a2960] leading-relaxed">
              <p><strong>Identificação e contacto:</strong> nome, e-mail, telemóvel (apenas quando o participante submete o resultado).</p>
              <p><strong>Dados de jogo:</strong> pontuação, tempo de jogo, instante do primeiro acerto, número de acertos/erros, eventuais indicadores anti-fraude.</p>
              <p><strong>Dados técnicos mínimos:</strong> data/hora, endereço IP truncado/pseudonimizado, user-agent/tipo de dispositivo, erros da aplicação.</p>
              <p><strong>Imagem da câmara:</strong> processada localmente no dispositivo para detetar a posição da boca; não é enviada nem gravada por defeito.</p>
              <p><strong>Cookies/armazenamento local:</strong> apenas os estritamente necessários ao funcionamento.</p>
            </div>
          </div>

          <!-- Finalidades -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">3) Finalidades e fundamentos jurídicos</h3>
            <div class="space-y-2 text-[#0a2960] leading-relaxed">
              <p><strong>Execução do passatempo/jogo:</strong> permitir jogar, calcular pontuação e apresentar resultados.</p>
              <p><strong>Gestão de participações e entrega de prémios:</strong> validações, contacto com vencedores, prevenção de fraude.</p>
              <p><strong>Comunicações operacionais:</strong> e-mails/SMS sobre a participação e resultados.</p>
              <p><strong>Marketing opcional:</strong> envio de comunicações comerciais apenas com consentimento.</p>
              <p><strong>Cumprimento de obrigações legais:</strong> fiscais/contabilísticas associadas à atribuição de prémios.</p>
            </div>
          </div>

          <!-- Menores -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">4) Menores</h3>
            <p class="text-[#0a2960] leading-relaxed">
              Para serviços da sociedade de informação, em Portugal o consentimento do menor é válido a partir dos 13 anos; abaixo desta idade é necessário consentimento dos representantes legais.
            </p>
          </div>

          <!-- Períodos de conservação -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">5) Períodos de conservação</h3>
            <div class="space-y-2 text-[#0a2960] leading-relaxed">
              <p><strong>Dados de jogo não identificáveis:</strong> até 12 meses para análise antifraude e melhoria técnica.</p>
              <p><strong>Participações não vencedoras:</strong> até 6 meses após fim da campanha.</p>
              <p><strong>Vencedores:</strong> até 5 anos (contabilidade/obrigações legais).</p>
            </div>
          </div>

          <!-- Direitos dos titulares -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">6) Direitos dos titulares</h3>
            <p class="text-[#0a2960] leading-relaxed">
              O participante pode exercer acesso, retificação, apagamento, limitação, portabilidade, oposição, e retirar consentimento. Pedidos para <a href="mailto:rgpd@a-bandeira.pt" class="text-[#243b78] underline">rgpd@a-bandeira.pt</a> ou por correio para a morada acima. Tem ainda o direito de reclamar junto da CNPD (<a href="https://www.cnpd.pt" class="text-[#243b78] underline">www.cnpd.pt</a>).
            </p>
          </div>

          <!-- Segurança -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">7) Segurança</h3>
            <p class="text-[#0a2960] leading-relaxed">
              Medidas proporcionais: pseudonimização/limitação de dados, HTTPS, controlo de acessos, rate-limit e verificação de integridade no submit do score, logging de erros sem PII, auditorias internas e orientação do DPO.
            </p>
          </div>

          <!-- Atualizações -->
          <div>
            <h3 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">8) Atualizações</h3>
            <p class="text-[#0a2960] leading-relaxed">
              Esta política pode ser atualizada durante a campanha; a versão vigente será publicada na página do jogo.
            </p>
          </div>

        </div>
      </div>

    </div>

    <!-- Nuvens base + elemento gráfico -->
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[40px] left-[-120px] w-[85%] max-w-[820px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 70s; --ab-delay: 0s;"/>
    <img src="/assets/graphics/Nuvem-03.svg" alt="" class="absolute bottom-[28px] left-[-140px] w-[70%] max-w-[700px] z-0 opacity-20 ab-cloud-marquee-right" style="--ab-cloud-scroll-dur: 62s; --ab-delay: -35s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[36px] right-[-120px] w-[95%] max-w-[920px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 64s; --ab-delay: -32s;"/>
    <img src="/assets/graphics/Nuvem-04.svg" alt="" class="absolute bottom-[22px] right-[-140px] w-[72%] max-w-[720px] z-0 opacity-20 ab-cloud-marquee-right"  style="--ab-cloud-scroll-dur: 76s; --ab-delay: -38s;"/>
    <img src="/assets/graphics/Graphic-Element01.svg" alt="" class="absolute left-0 right-0 bottom-[-60px] w-full h-[140px] md:h-[180px] object-cover z-[1]"/>

    <!-- Botão de som (canto inferior esquerdo) -->
    <button id="sound" class="ab-icon-btn fixed left-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px)" aria-label="Som">
      <img id="sound-icon" src="/assets/graphics/icon_Volume-On.svg" alt=""/>
    </button>

    <!-- Botão Home (canto inferior direito) -->
    <button id="home" class="ab-icon-btn fixed right-5 z-[40] pointer-events-auto" style="bottom: calc(env(safe-area-inset-bottom, 0px) + 20px);" aria-label="Início">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#243a79" d="M12 3.2l8 6.4v10a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V14H10v6.1a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1V9.6l8-6.4zM3.6 9L2 10.3l.8 1 .8-.6V9zm18.4 1.3L20.4 9v1.7l.8.6.8-1z"/>
      </svg>
    </button>
  `;

  // Event listeners
  el.querySelector<HTMLButtonElement>('#home')!.onclick = () => onBack();

  // Som on/off com persistência
  const soundBtn = el.querySelector<HTMLButtonElement>('#sound')!;
  const soundIcon = el.querySelector<HTMLImageElement>('#sound-icon')!;
  const updateSoundIcon = () => {
    const muted = (localStorage.getItem('ab-muted') === '1');
    soundIcon.src = muted ? '/assets/graphics/Icon_Volume-Muted.svg' : '/assets/graphics/icon_Volume-On.svg';
    try {
      soundBtn.setAttribute('aria-pressed', muted ? 'true' : 'false');
      soundBtn.title = muted ? 'Som desligado' : 'Som ligado';
      soundIcon.classList.remove('ab-icon-swap');
      void (soundIcon as any).offsetWidth;
      soundIcon.classList.add('ab-icon-swap');
    } catch {}
  };
  updateSoundIcon();
  
  const toggleMute = () => {
    const current = (localStorage.getItem('ab-muted') === '1');
    try { localStorage.setItem('ab-muted', current ? '0' : '1'); } catch {}
    updateSoundIcon();
    try { BackgroundMusic.syncFromStorage(); } catch {}
  };
  
  soundBtn.onclick = () => toggleMute();
  soundBtn.addEventListener('touchstart', (e) => { try { e.preventDefault(); } catch {} toggleMute(); }, { passive: false });
  soundBtn.onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMute(); }
  };

  return el;
}
