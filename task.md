# v-cel — Task Board

## P0 — Setup inicial

- [x] Inicializar repo local com `git init` + conectar ao remote `lucasfersaron/v-cel`
- [x] Criar `package.json` com dependências base (express, ws, vitest)
- [x] Criar estrutura de pastas (`src/`, `public/`) — `test/` pendente (S3), `scripts/` não necessário
- [x] Implementar `src/config.js` — env vars e constantes
- [x] Implementar `src/state.js` — estado compartilhado + tipos JSDoc
- [x] Implementar `src/cdp/connection.js` — CDP discovery (porta 7800)
- [x] Implementar `src/server.js` — Express + WebSocket server (porta 4747)

## P1 — Interface mobile

- [x] Criar `public/index.html` — UI mobile base
- [x] Criar `public/app.js` — WebSocket client + DOM updates
- [ ] Implementar mirroring de chat em tempo real — código existe, seletores CDP não validados (S2)
- [ ] Implementar envio de mensagens pelo celular — código existe, seletores CDP não validados (S2/S4)

## P2 — Features

- [ ] Troca de modelo AI (Claude, Gemini, GPT) — código existe, seletores não validados (S2)
- [ ] Multi-window switching — não implementado
- [x] Autenticação por senha (`APP_PASSWORD`)
- [x] ngrok integration docs (README.md)

## P3 — Qualidade

- [x] Suite de testes Vitest — 25 testes passando (S3 DONE)
- [x] `.env.example` documentado
- [x] README.md com setup completo
