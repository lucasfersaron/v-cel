# v-cel

Remote chat mobile para sessões [Antigravity](https://antigravity.run) via Chrome DevTools Protocol.

Espelha o chat do Antigravity no celular em tempo real. Permite enviar mensagens e controlar a sessão direto do smartphone.

---

## Como usar

### Pré-requisito

Antigravity instalado. Verifique com:
```bash
antigravity --version
```

### 1. Instalar

```bash
git clone https://github.com/lucasfersaron/v-cel.git
cd v-cel
npm install
```

### 2. Configurar

```bash
cp .env.example .env
# Edite .env e mude APP_PASSWORD para uma senha forte
```

### 3. Iniciar tudo

```bash
./start.sh
```

Em outro terminal, para acessar do celular:
```bash
ngrok http 4747
```

Abra o link `https://xxxx.ngrok-free.app` no celular e use a senha configurada.

---

## Variáveis de ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `APP_PASSWORD` | `antigravity` | Senha de acesso à UI mobile |
| `PORT` | `4747` | Porta do servidor |
| `CDP_PORT` | `7800` | Porta CDP do Antigravity |
| `WORKSPACE_ROOT` | — | Diretório raiz exposto (opcional) |
| `SCREENSHOT_ENABLED` | `false` | Timeline de screenshots |

---

## Stack

| Camada | Tech |
|--------|------|
| Backend | Node.js + Express + WebSocket |
| Frontend | Vanilla JS (mobile browser) |
| Protocolo | Chrome DevTools Protocol (CDP) |
| Tunnel | ngrok |

---

## Estrutura

```
src/
├── server.js         # Express + WebSocket server
├── config.js         # Variáveis de ambiente
├── state.js          # Estado global + broadcast
└── cdp/
    └── connection.js # CDP discovery + polling + comandos
public/
├── index.html        # UI mobile
└── app.js            # WebSocket client
start.sh              # Script de inicialização completa
```

---

## Inspiração

[OmniAntigravityRemoteChat](https://github.com/diegosouzapw/OmniAntigravityRemoteChat)
