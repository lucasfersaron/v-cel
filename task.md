# v-cel — Task Board

## P0 — Setup inicial

- [ ] Inicializar repo local com `git init` + conectar ao remote `lucasfersaron/v-cel`
- [ ] Criar `package.json` com dependências base (express, ws, vitest)
- [ ] Criar estrutura de pastas (`src/`, `public/`, `scripts/`, `test/`)
- [ ] Implementar `src/config.js` — env vars e constantes
- [ ] Implementar `src/state.js` — estado compartilhado + tipos JSDoc
- [ ] Implementar `src/cdp/connection.js` — CDP discovery (porta 7800)
- [ ] Implementar `src/server.js` — Express + WebSocket server (porta 4747)

## P1 — Interface mobile

- [ ] Criar `public/index.html` — UI mobile base
- [ ] Criar `public/app.js` — WebSocket client + DOM updates
- [ ] Implementar mirroring de chat em tempo real (<100ms)
- [ ] Implementar envio de mensagens pelo celular

## P2 — Features

- [ ] Troca de modelo AI (Claude, Gemini, GPT)
- [ ] Multi-window switching
- [ ] Autenticação por senha (`APP_PASSWORD`)
- [ ] ngrok integration docs

## P3 — Qualidade

- [ ] Suite de testes Vitest
- [ ] `.env.example` documentado
- [ ] README.md com setup completo
