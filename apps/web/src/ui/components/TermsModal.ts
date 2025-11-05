// Modal de Termos e Condições reutilizável
export function showTermsModal(): void {
  // Verificar se já existe um modal aberto
  const existingModal = document.querySelector('#terms-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'terms-modal';
  modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4';
  
  modal.innerHTML = `
    <div class="w-full max-w-[90vw] max-h-[85vh] bg-white text-[#0a2960] rounded-[18px] shadow-[0_20px_40px_rgba(2,20,60,0.3)] overflow-hidden flex flex-col">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between p-4 bg-[#243b78] text-white">
        <h2 class="text-lg font-[800] tracking-[0.06em]">TERMOS E CONDIÇÕES</h2>
        <button id="close-terms" class="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors" aria-label="Fechar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      
      <!-- Conteúdo scrollable -->
      <div class="flex-1 overflow-y-auto">
        <!-- Seção Prémios -->
        <div class="p-3 sm:p-4 border-b-2 border-[#243b78]/30 bg-[#243b78]">
          <h3 class="text-base sm:text-lg font-[800] text-white text-center mb-2">PRÉMIOS</h3>
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
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">Responsável pelo Tratamento</h4>
            <p class="text-[#0a2960] leading-relaxed">
              GRUPO ALVES BANDEIRA, S.A. (NIPC 509 654 185), Zona Industrial da Pedrulha, Lote 12, 3050-183 Casal Comba (Mealhada), Tel. +351 231 244 200, e-mail: rgpd@a-bandeira.pt
            </p>
            <p class="text-[#0a2960] mt-1">
              <a href="https://grupoalvesbandeira.com" target="_blank" class="text-[#243b78] underline">grupoalvesbandeira.com</a>
            </p>
          </div>

          <!-- Encarregada de Proteção de Dados -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">Encarregada de Proteção de Dados (DPO)</h4>
            <p class="text-[#0a2960] leading-relaxed">
              Ana Maria Ferreira e Sousa — contacto: Zona Industrial da Pedrulha, Lote 12, 3050-183 Casal Comba, Tel. +351 231 244 200, e-mail: rgpd@a-bandeira.pt
            </p>
            <p class="text-[#0a2960] mt-1">
              <a href="https://alvesbandeira.pt" target="_blank" class="text-[#243b78] underline">alvesbandeira.pt</a>
            </p>
          </div>

          <!-- Âmbito -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">1) Âmbito</h4>
            <p class="text-[#0a2960] leading-relaxed">
              Esta política aplica-se ao jogo WebAR "Apanha os Sabores de Portugal", acessível via browser móvel, no âmbito das comemorações dos 50 anos da Alves Bandeira, e a qualquer página de resultado/submissão associada.
            </p>
          </div>

          <!-- Que dados tratamos -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">2) Que dados tratamos</h4>
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
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">3) Finalidades e fundamentos jurídicos</h4>
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
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">4) Menores</h4>
            <p class="text-[#0a2960] leading-relaxed">
              Para serviços da sociedade de informação, em Portugal o consentimento do menor é válido a partir dos 13 anos; abaixo desta idade é necessário consentimento dos representantes legais.
            </p>
          </div>

          <!-- Períodos de conservação -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">5) Períodos de conservação</h4>
            <div class="space-y-2 text-[#0a2960] leading-relaxed">
              <p><strong>Dados de jogo não identificáveis:</strong> até 12 meses para análise antifraude e melhoria técnica.</p>
              <p><strong>Participações não vencedoras:</strong> até 6 meses após fim da campanha.</p>
              <p><strong>Vencedores:</strong> até 5 anos (contabilidade/obrigações legais).</p>
            </div>
          </div>

          <!-- Direitos dos titulares -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">6) Direitos dos titulares</h4>
            <p class="text-[#0a2960] leading-relaxed">
              O participante pode exercer acesso, retificação, apagamento, limitação, portabilidade, oposição, e retirar consentimento. Pedidos para <a href="mailto:rgpd@a-bandeira.pt" class="text-[#243b78] underline">rgpd@a-bandeira.pt</a> ou por correio para a morada acima. Tem ainda o direito de reclamar junto da CNPD (<a href="https://www.cnpd.pt" target="_blank" class="text-[#243b78] underline">www.cnpd.pt</a>).
            </p>
          </div>

          <!-- Segurança -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">7) Segurança</h4>
            <p class="text-[#0a2960] leading-relaxed">
              Medidas proporcionais: pseudonimização/limitação de dados, HTTPS, controlo de acessos, rate-limit e verificação de integridade no submit do score, logging de erros sem PII, auditorias internas e orientação do DPO.
            </p>
          </div>

          <!-- Atualizações -->
          <div class="mb-4">
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">8) Atualizações</h4>
            <p class="text-[#0a2960] leading-relaxed">
              Esta política pode ser atualizada durante a campanha; a versão vigente será publicada na página do jogo.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Rodapé -->
      <div class="p-4 border-t border-[#243b78]/20 bg-gray-50">
        <button id="accept-terms" class="w-full px-6 py-3 bg-[#243b78] text-white font-semibold rounded-full hover:bg-[#1e2f5f] transition-colors">
          ACEITAR E FECHAR
        </button>
      </div>
    </div>
  `;

  // Event listeners
  const closeModal = () => {
    modal.remove();
  };

  // Fechar ao clicar no X ou no botão aceitar
  modal.querySelector('#close-terms')!.addEventListener('click', closeModal);
  modal.querySelector('#accept-terms')!.addEventListener('click', closeModal);

  // Fechar ao clicar no fundo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fechar com ESC
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Adicionar ao documento
  document.body.appendChild(modal);

  // Focar no botão de fechar para acessibilidade
  setTimeout(() => {
    const closeBtn = modal.querySelector('#close-terms') as HTMLButtonElement;
    closeBtn?.focus();
  }, 100);
}
