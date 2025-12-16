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
            <div class="text-xs sm:text-sm"><span class="font-bold">1º vencedor:</span> 500€ em senhas de combustível Alves Bandeira</div>
            <div class="text-xs sm:text-sm"><span class="font-bold">2º vencedor:</span> 250€ em senhas de combustível Alves Bandeira</div>
            <div class="text-xs sm:text-sm"><span class="font-bold">3º vencedor:</span> 150€ em senhas de combustível Alves Bandeira</div>
            <div class="text-xs sm:text-sm"><span class="font-bold">4º ao 50º vencedor:</span> 10€ em senhas de combustível Alves Bandeira/vencedor</div>
          </div>
        </div>

        <!-- Conteúdo dos Termos -->
        <div class="p-3 sm:p-4 space-y-3 text-xs sm:text-sm leading-relaxed">
          
          <!-- Título do Regulamento -->
          <div class="text-center mb-2">
            <h2 class="font-[800] text-[#243b78] text-sm sm:text-base">Regulamento do Passatempo: "Apanha os Sabores de Portugal!"</h2>
          </div>

          <!-- 1. EMPRESA PROMOTORA -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">1. EMPRESA PROMOTORA</h4>
            <p class="text-[#0a2960]">
              O presente Passatempo denominado "Apanha os Sabores de Portugal!" é promovido pela Alves Bandeira e Companhia, S.A., com sede em Vale de Vaz 3350-110 Vila Nova de Poiares, matriculada na Conservatória do Registo Comercial de Vila Nova de Poiares sob o NIPC 500 433 402, seguidamente designada, apenas, por AB.
            </p>
          </div>

          <!-- 2. DESTINATÁRIOS -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">2. DESTINATÁRIOS</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>2.1.</strong> São destinatários do presente Passatempo todas as pessoas singulares com idade igual ou superior a dezoito anos (18) à data da sua participação, residentes em território nacional que desejem participa no Passatempo, com as exceções previstas no ponto seguinte.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>2.2.</strong> Estão excluídos deste Passatempo os sócios (ou acionistas), gerentes (ou administradores), funcionários e colaboradores do Grupo Alves Bandeira e de todas as suas empresas subsidiárias, bem como aos seus cônjuges, ascendentes e descendentes. Esta restrição aplica-se, nos seus precisos termos e com a mesma amplitude, às empresas e sua estrutura orgânico-pessoal, que sejam parceiras da AB e que estejam diretamente envolvidas no mesmo.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>2.3.</strong> A Promotora Alves Bandeira, reserva-se o direito de verificar, da forma que considerar adequada e a todo o tempo, se todos os Participantes cumprem os requisitos necessários para a sua participação.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>2.4.</strong> Tal participação implica, necessariamente, que os Participantes aceitem, integralmente e sem reservas, os Termos e Condições constantes do presente Regulamento e que cumpram o mesmo, sob pena de exclusão, os quais são, portanto, definitivos e vinculativos em tudo o que se refere a este Passatempo.
            </p>
            <p class="text-[#0a2960]">
              <strong>2.5.</strong> Os preços dos combustíveis vendidos pela Promotora na sua atividade comercial não sofrerão alterações decorrentes da realização deste Passatempo, ficando, no entanto, e como é curial, sujeitos às normais oscilações do mercado.
            </p>
          </div>

          <!-- 3. OBJETIVO DO PASSATEMPO -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">3. OBJETIVO DO PASSATEMPO</h4>
            <p class="text-[#0a2960]">
              O Passatempo tem como objetivo celebrar os 50 anos de história da Alves Bandeira, desafiando os Participantes a jogar um jogo de realidade aumentada denominado "Apanha os Sabores de Portugal", onde, virtualmente, devem captar com a boca, o maior número de alimentos tipicamente portugueses durante 60 segundos.
            </p>
          </div>

          <!-- 4. DURAÇÃO DO PASSATEMPO -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">4. DURAÇÃO DO PASSATEMPO</h4>
            <p class="text-[#0a2960]">
              O Passatempo decorrerá no período de 17/12/2025 até às 23:59:59 do dia 11/01/2026, inclusive, e estará disponível no link <a href="https://saboresdeportugal.alvesbandeira.pt" class="text-[#243b78] underline" target="_blank">saboresdeportugal.alvesbandeira.pt</a>.
            </p>
          </div>

          <!-- 5. CONDIÇÕES DE PARTICIPAÇÃO -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">5. CONDIÇÕES DE PARTICIPAÇÃO</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>5.1.</strong> Para participar no presente Passatempo e cumprindo todos os requisitos estabelecidos neste Regulamento, os Participantes terão de seguir os passos seguintes, cumulativamente:
            </p>
            <div class="ml-2 space-y-1 text-[#0a2960] mb-2">
              <p><strong>5.1.1</strong> Aceder ao link saboresdeportugal.alvesbandeira.pt para ter acesso ao jogo "Apanha os Sabores de Portugal";</p>
              <p><strong>5.1.2</strong> Clicar no botão "JOGAR";</p>
              <p><strong>5.1.3</strong> Autorizar o acesso à câmara do seu dispositivo;</p>
              <p><strong>5.1.4</strong> Jogar o jogo conforme as regras de utilização e cumprindo os procedimentos que se encontram expostos na página inicial do próprio jogo;</p>
              <p><strong>5.1.5</strong> Clicar, se assim o entenderem, no botão Submeter o resultado e fornecer o seu email, optando por uma das seguintes formas:</p>
              <div class="ml-2">
                <p>a) Entrar com Google: o sistema solicitará que indique a conta de email e pedirá o respetivo acesso direto para autenticação;</p>
                <p>b) O Participante introduz o endereço de email, clica em "Enviar Código" e recebe, nesse email, um código de validação que deverá introduzir no jogo para validar o email.</p>
              </div>
              <p><strong>5.1.6</strong> De seguida, deverá completar o registo, preenchendo o campo "Nome do Utilizador", aceitar os Termos e Condições (que incluem a Política de Privacidade) e clicar em "Guardar Registo" para confirmar a submissão. O campo "Telemóvel" é de carácter facultativo.</p>
              <p><strong>5.1.7</strong> O procedimento descrito nos números anteriores pode ser efetuado antes ou depois de jogar.</p>
            </div>
            <p class="text-[#0a2960] mb-2">
              <strong>5.2.</strong> A participação neste Passatempo não tem qualquer limitação, mas para efeitos de ranking apenas será considerado o resultado do Participante onde este obteve a pontuação mais elevada, sendo excluído qualquer outro;
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>5.3.</strong> O jogo tem a duração de 60 segundos;
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>5.4.</strong> O Participante terá de, virtualmente, captar com a boca, o maior número de produtos tipicamente portugueses e ao mesmo tempo evitar apanhar produtos que não sejam tipicamente portugueses. Por cada produto que apanhe corretamente, ganha 1 ponto. Por cada produto incorreto, perde 1 ponto.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>5.5.</strong> Os produtos considerados tipicamente portugueses que se encontram disponíveis no jogo são: bacalhau, bifana, bolo de bacalhau, bolo-rei, brisas do Liz, pastel de nata, pastel de Tentúgal, sardinha e ovos moles.
            </p>
            <p class="text-[#0a2960]">
              <strong>5.6.</strong> Não obstante não haver limite de participações, depois de efetivada a mecânica procedimental prevista no ponto 5., supra, ao mesmo cliente só pode ter uma conta no jogo, associada ao email e contacto telefónico.
            </p>
          </div>

          <!-- 6. OFERTAS -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">6. OFERTAS</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>6.1.</strong> Serão atribuídas um total de 50 ofertas, correspondentes a senhas de combustível Alves Bandeira, com a seguinte distribuição:
            </p>
            <div class="ml-2 space-y-1 text-[#0a2960] mb-2">
              <p>1º vencedor: 500€ em senhas de combustível Alves Bandeira</p>
              <p>2º vencedor: 250€ em senhas de combustível Alves Bandeira</p>
              <p>3º vencedor: 150€ em senhas de combustível Alves Bandeira</p>
              <p>Do 4º ao 50º vencedor: 10€ em senhas de combustível Alves Bandeira/vencedor</p>
            </div>
            <p class="text-[#0a2960] mb-2">
              <strong>6.2.</strong> As condições de utilização das senhas de combustível, cuja consulta também pode ser feita na própria senha, obedecem aos seguintes critérios:
            </p>
            <div class="ml-2 space-y-1 text-[#0a2960] mb-2">
              <p>a) São válidas nos postos de abastecimento da Alves Bandeira aderentes;</p>
              <p>b) Não têm prazo de validade;</p>
              <p>c) Apenas poderão ser utilizadas no pagamento de combustíveis líquidos;</p>
              <p>d) Não são cumuláveis com outros descontos ou promoções em vigor nos postos aderentes;</p>
              <p>e) Não são convertíveis em dinheiro.</p>
            </div>
            <p class="text-[#0a2960]">
              <strong>6.3.</strong> A AB reserva-se o direito de oferecer ofertas diferentes das inicialmente previstas, mas de igual valor pecuniário, caso seja forçada a proceder a essa alteração devido a circunstâncias sobre as quais não possua qualquer controlo.
            </p>
          </div>

          <!-- 7. APURAMENTO DOS VENCEDORES -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">7. APURAMENTO DOS VENCEDORES</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>7.1.</strong> No final do período do Passatempo definido no ponto 4. supra, serão apurados e escalonados em função da sua posição no ranking do jogo, os 50 Participantes (vencedores "efetivos") que tenham obtido o maior número de pontos, o que será visível no aludido ranking que se encontra disponível no próprio jogo;
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>7.2.</strong> Serão ainda apurados e escalonados os 10 Participantes que se encontrem na posição 51 a 60 do ranking, aos quais será atribuído o estatuto de "suplente" para os efeitos previstos em 7.4., infra.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>7.3.</strong> Em caso de empate entre dois ou mais Participantes, será considerado como fator de desempate o dia, hora e minutos em que foi feita a participação. O primeiro Participante que obteve essa pontuação será o contemplado, e assim sucessivamente caso existam várias com a mesma pontuação, até se encontrar os vencedores finais.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>7.4.</strong> Caso a participação de um dos vencedores não seja considerada válida, nos termos definidos no presente Regulamento, ou, por que razão seja, o email ou o contacto telefónico previsto em 7.6., infra, não se concretize, será contemplado com a oferta em causa o Participante que se encontre no lugar imediatamente a seguir no ranking, havendo lugar, assim, a uma subida de um lugar de todos os Participantes que se encontrem escalonados nos lugares abaixo e a entrada no ranking dos 50 vencedores efetivos do primeiro que se encontrar escalonado como "suplente", sendo que este procedimento terá lugar quantas as vezes que se mostrem necessárias em função das vicissitudes aqui descritas.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>7.5.</strong> Por força do previsto no ponto 5.6., supra, caso o Participante tenha submetido e validado várias participações só será considerada como elegível para receber a Oferta a participação que tenha obtido o maior número de pontos, ficando, assim, impossibilitado de ganhar mais do que uma oferta.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>7.6.</strong> Os Participantes selecionados serão contactados pela Promotora até 5 (cinco) dias após o fim do Passatempo para o contacto telefónico que facultaram no momento da sua participação, ou, não tendo indicado telemóvel, para o endereço de email associado à sua participação.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>7.7.</strong> Os selecionados serão contactados até 3 vezes num prazo máximo de 48 horas por chamada telefónica (quando exista número indicado) ou, na ausência de tal indicação, por email. Caso não atendam a nenhuma das chamadas nem respondam ao email enviado nesse prazo, a sua participação deixará de ser válida.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>7.8.</strong> Os vencedores finais serão anunciados no site <a href="https://alvesbandeira.pt" class="text-[#243b78] underline" target="_blank">alvesbandeira.pt</a> e no próprio jogo;
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>7.9.</strong> As ofertas terão de ser obrigatoriamente levantadas pelos vencedores nos postos de abastecimento acordados/combinados até ao dia 25/01/2026.
            </p>
            <p class="text-[#0a2960]">
              <strong>7.10.</strong> Os vencedores aquando da entrega da oferta terão de apresentar a sua identificação e assinar uma Declaração que prove a entrega da referida oferta.
            </p>
          </div>

          <!-- 8. TERMOS E CONDIÇÕES GERAIS -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">8. TERMOS E CONDIÇÕES GERAIS</h4>
            <div class="space-y-1 text-[#0a2960]">
              <p><strong>8.1.</strong> A participação no presente Passatempo implica a aceitação integral e incondicional dos presentes Termos e Condições pelos Participantes e as decisões da Empresa Promotora, AB, que sobre o mesmo possa vir a tomar, são consideradas definitivas.</p>
              <p><strong>8.2.</strong> Apenas são admitidas as participações que estejam em conformidade com os presentes Termos e Condições e qualquer participação por meio ou forma diversos do previsto no mesmo não será considerada.</p>
              <p><strong>8.3.</strong> A Alves Bandeira reserva-se ao direito de anular qualquer participação sempre que existam suspeitas de manipulação incorreta dos dados ou do Passatempo.</p>
              <p><strong>8.4.</strong> É proibido aos Participantes implementarem ou tentarem implementar qualquer processo de participação que não se ajuste estritamente aos presentes Termos e Condições.</p>
              <p><strong>8.5.</strong> A oferta não pode ser trocada ou substituída por dinheiro ou qualquer outro produto ou serviço.</p>
              <p><strong>8.6.</strong> A AB reserva-se o direito de fazer cessar, alterar, encurtar, atrasar ou prolongar este Passatempo a todo o tempo, sem que com isso os Participantes tenham direito a qualquer tipo de compensação, de que tipo e a que título seja.</p>
              <p><strong>8.7.</strong> No seguimento do ponto 7.6. supra, o contacto será realizado pela Promotora através de telefonema para o número de telemóvel indicado e/ou através de email para o endereço associado à participação.</p>
              <p><strong>8.8.</strong> A Alves Bandeira não se responsabiliza pela impossibilidade de contacto com os potenciais vencedores devido à incorreção do número de telemóvel e/ou do endereço de email por eles indicado, e/ou qualquer problema informático ou de comunicação.</p>
              <p><strong>8.9.</strong> Os Participantes comprometem-se a aceitar os resultados do Passatempo bem como uma eventual decisão de exclusão por parte do Promotora.</p>
              <p><strong>8.10.</strong> Em caso algum a AB será responsável pelos danos ou prejuízos resultantes da atribuição, aceitação, gozo, utilização e/ou rejeição das ofertas no âmbito do presente Passatempo.</p>
              <p><strong>8.11.</strong> A AB não se responsabiliza pela perda, roubo ou extravio da oferta, após a sua entrega aos vencedores deste Passatempo.</p>
            </div>
          </div>

          <!-- 9. RESPONSABILIDADE -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">9. RESPONSABILIDADE</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>9.1.</strong> A AB não é responsável por participações perdidas, atrasadas, incompletas, inválidas, extraviadas ou corrompidas, bem como pela impossibilidade de participação no Passatempo devido a falhas alheias às entidades nele envolvidas, ou ataques ao sistema, as quais não serão consideradas para efeitos de participação no mesmo.
            </p>
            <p class="text-[#0a2960]">
              <strong>9.2.</strong> A AB não é responsável por transmissões eletrónicas incompletas ou que tenham sofrido falhas, bem como por falhas técnicas de qualquer tipo, incluindo, mas não limitadas, a mau funcionamento de qualquer rede, "hardware" ou "software", indisponibilidade do serviço de comunicações ou falhas de rede na internet.
            </p>
          </div>

          <!-- 10. CONSULTA DO REGULAMENTO E DA TABELA -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">10. CONSULTA DO REGULAMENTO E DA TABELA</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>10.1.</strong> Os Termos e Condições estão disponíveis para consulta na página <a href="https://alvesbandeira.pt" class="text-[#243b78] underline" target="_blank">www.alvesbandeira.pt</a>.
            </p>
            <p class="text-[#0a2960]">
              <strong>10.2.</strong> A AB reserva-se no direito de alterar, a qualquer momento, os presentes Termos e Condições, sempre que o entender necessário, tornando-se as alterações efetivas após a sua publicação em <a href="https://alvesbandeira.pt" class="text-[#243b78] underline" target="_blank">www.alvesbandeira.pt</a>.
            </p>
          </div>

          <!-- 11. DADOS PESSOAIS -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">11. DADOS PESSOAIS</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>11.1.</strong> Este Passatempo está sujeito e rege-se pela Política de Privacidade e Proteção de Dados da AB que pode ser consultada no sítio da empresa. A AB garante a confidencialidade dos dados pessoais de todos os Participantes. Os dados pessoais disponibilizados são guardados e processados e destinam-se ao tratamento no âmbito deste Passatempo, efeitos de Marketing Direto e Estudos de Mercado, sendo garantido o seu tratamento legal nos termos do Regulamento Geral de Proteção de Dados, podendo os mesmos ser eliminados, consultados ou corrigidos via email para <a href="mailto:rgpd@a-bandeira.pt" class="text-[#243b78] underline">rgpd@a-bandeira.pt</a>.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>11.2.</strong> Sem prejuízo do sobredito, os dados de identificação pessoal obtidos poderão, caso tal se mostre necessário, ser disponibilizados para o apuramento de responsabilidade civil e/ou criminal, mediante solicitação legítima da autoridade judiciária competente, nos termos da legislação aplicável.
            </p>
            <p class="text-[#0a2960]">
              <strong>11.3.</strong> Os vencedores do Passatempo declaram ceder a utilização da sua imagem captada através de vídeo ou fotografia aquando da entrega da oferta, para caso assim o entenda, a AB a possa utilizar para divulgação nas redes sociais e outros meios de divulgação pública que ache comercialmente pertinentes, sem que o mesmo premiado, cedente de tal imagem, possa pedir qualquer contrapartida por essa utilização, a título de remuneração ou compensação.
            </p>
          </div>

          <!-- 12. DISPOSIÇÕES FINAIS -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">12. DISPOSIÇÕES FINAIS</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>12.1.</strong> A Alves Bandeira reserva-se o direito de modificar, em momento que achar pertinente, os termos do presente Passatempo e quaisquer regras do mesmo, incluindo a sua possível anulação antes do prazo predeterminado, comprometendo-se a informar os Participantes das novas condições em vigor relativas ao mesmo, o que fará com uma antecedência adequada e atempada e com a respetiva publicitação o mais clara e transparente possível.
            </p>
            <p class="text-[#0a2960] mb-2">
              <strong>12.2.</strong> O registo ou participação no Passatempo não cria direitos de qualquer tipo.
            </p>
            <p class="text-[#0a2960]">
              <strong>12.3.</strong> Todas as dúvidas sobre a interpretação e casos omissos nos presentes Termos e Condições serão analisadas e esclarecidas pela Promotora Alves Bandeira.
            </p>
          </div>

          <!-- 13. DIREITOS -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">13. DIREITOS</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>13.1.</strong> Todos os direitos sobre o Passatempo são propriedade da Alves Bandeira e Companhia, S.A.
            </p>
            <p class="text-[#0a2960]">
              <strong>13.2.</strong> Todas as instruções, alterações ou informações publicadas ao longo do Passatempo passarão a fazer parte integrante dos presentes Termos e Condições.
            </p>
          </div>

          <!-- 14. PUBLICIDADE DOS TERMOS E CONDIÇÕES -->
          <div>
            <h4 class="font-[800] text-[#243b78] mb-1 text-sm sm:text-base">14. PUBLICIDADE DOS TERMOS E CONDIÇÕES</h4>
            <p class="text-[#0a2960] mb-2">
              <strong>14.1.</strong> Os presentes Termos e Condições poderão ser consultados no sítio <a href="https://alvesbandeira.pt" class="text-[#243b78] underline" target="_blank">www.alvesbandeira.pt</a> e no jogo em causa;
            </p>
            <p class="text-[#0a2960]">
              <strong>14.2.</strong> A participação no presente Passatempo pressupõe a aceitação integral dos presentes Termos e Condições e a submissão expressa às decisões interpretativas que a Alves Bandeira tome relativamente ao teor do mesmo.
            </p>
          </div>

          <!-- Data -->
          <div class="mt-4 pt-3 border-t border-[#243b78]/20 mb-4">
            <p class="text-[#0a2960] text-center text-xs">
              Mealhada, 12 de dezembro de 2025
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
