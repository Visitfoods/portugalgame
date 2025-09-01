Alves Bandeira — WebAR Jogo (MVP)

Setup

- Node 18+ recomendado
- Instalar deps: `npm install`
- Dev: `npm run dev`
- Build: `npm run build` e `npm run preview`

Notas

- MVP usa MediaPipe FaceMesh para landmarks (CDN jsDelivr). No futuro, MindAR/Three pode ser integrado conforme plano.
- Render do jogo em Canvas 2D. Tracking ~20fps; render a 60fps.
- Ajustar thresholds de boca em `src/core/ar/MouthOpenDetector.ts`.
- UI e textos PT-PT mínimos. Assets são placeholders; substituir por SVGs em `src/assets` (não bloqueante).

Limitações

- Sem backend (formulário apenas valida e faz `console.log`).
- Necessário HTTPS em dispositivos reais para acesso à câmara.

Assets (ícones dos objetos)

- Coloque as imagens dos objetos em:
  - `apps/web/public/assets/items/good/` — itens “portugueses” (valem +1)
  - `apps/web/public/assets/items/bad/`  — itens “falsos” (valem −1)
- Formatos: SVG preferível (ou PNG @2x). Tamanho sugerido: 96–128px.
- Nomeação: kebab-case, p.ex. `galo.svg`, `guitarra.svg`, `pizza.svg`.
- Referência no código: a partir da raiz do site, p.ex. `/assets/items/good/galo.svg`.

Sugestão futura

- Criar `apps/web/src/assets/items.manifest.ts` para listar os ficheiros disponíveis e pesos de spawn.
- Trocar o render atual (círculos) por sprites carregados com `HTMLImageElement` e `drawImage` no `GameLoop`.

