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

