#!/bin/zsh
# v-cel — inicia tudo com um comando

ANTIGRAVITY="/Users/lucas/.antigravity/antigravity/bin/antigravity"
DIR="$(cd "$(dirname "$0")" && pwd)"

# Cria .env se não existir
if [ ! -f "$DIR/.env" ]; then
  cp "$DIR/.env.example" "$DIR/.env"
  echo "✅ .env criado a partir do .env.example"
fi

echo ""
echo "🚀 Iniciando Antigravity com CDP na porta 7800..."
"$ANTIGRAVITY" . --remote-debugging-port=7800 &
ANTGRAV_PID=$!

sleep 3

echo "🌐 Iniciando servidor v-cel na porta 4747..."
node "$DIR/src/server.js" &
SERVER_PID=$!

sleep 2

echo ""
echo "📱 Para acessar do celular, rode em outro terminal:"
echo "   ngrok http 4747"
echo ""
echo "🔑 Senha padrão: antigravity (mude no .env)"
echo ""
echo "Pressione Ctrl+C para encerrar tudo."

# Aguarda e encerra tudo junto
trap "echo ''; echo '👋 Encerrando...'; kill $ANTGRAV_PID $SERVER_PID 2>/dev/null; exit 0" INT
wait
