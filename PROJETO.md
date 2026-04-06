# v-cel

Remote chat mobile para sessões Antigravity (Windsurf AI).

**Inspiração:** [OmniAntigravityRemoteChat](https://github.com/diegosouzapw/OmniAntigravityRemoteChat)
**Repo:** https://github.com/lucasfersaron/v-cel.git

---

## O que faz

Espelha o chat do Antigravity no celular em tempo real via CDP (Chrome DevTools Protocol).
Permite enviar mensagens, trocar modelos e gerenciar janelas direto do smartphone.

---

## Stack

| Camada | Tech |
|--------|------|
| Backend | Node.js + Express + WebSocket |
| Frontend | Vanilla JS (mobile browser) |
| Protocolo | Chrome DevTools Protocol (CDP) |
| Tunnel | ngrok (porta 4747) |
| Testes | Vitest |

---

## Setup de Desenvolvimento

```bash
# Pré-requisito: Antigravity com debugging port
antigravity . --remote-debugging-port=7800

# Iniciar servidor
npm run start:web   # porta 4747

# Tunnel remoto
npx ngrok http 4747

# Ou tudo via npx
npx omni-antigravity-remote-chat
```

---

## Estrutura Planejada

```
src/
├── server.js         # Express + WS + CDP actions
├── config.js         # env vars, constantes
├── state.js          # estado compartilhado
├── cdp/
│   └── connection.js # CDP discovery
└── utils/            # network, process, hash
public/               # interface mobile
scripts/              # SSL, installers
test/                 # suite de validação
```

---

## Variáveis de Ambiente

| Var | Default | Descrição |
|-----|---------|-----------|
| `APP_PASSWORD` | `antigravity` | Autenticação |
| `PORT` | `4747` | Porta do servidor |
| `WORKSPACE_ROOT` | — | Root do filesystem exposto |
| `SCREENSHOT_ENABLED` | `false` | Timeline de screenshots |

---

## Agentes

| Agente | Responsabilidade |
|--------|-----------------|
| `@dev` | Implementação Node.js/Express/CDP |
| `@qa` | Testes Vitest |
| `@devops` | git push, ngrok, deploy |
