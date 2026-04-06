import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import { WebSocketServer } from 'ws';
import { PORT, APP_PASSWORD } from './config.js';
import { addClient, removeClient, clientCount, getState } from './state.js';
import { connect, isConnected, sendMessage, stopGeneration, switchModel } from './cdp/connection.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Serve mobile UI
app.use(express.static(join(__dirname, '..', 'public')));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', cdp: isConnected(), clients: clientCount() });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// WebSocket upgrade with password auth
server.on('upgrade', (req, socket, head) => {
  const url = new URL(req.url, `http://localhost`);
  const password = url.searchParams.get('password');

  if (password !== APP_PASSWORD) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  addClient(ws);

  // Send current state immediately on connect
  ws.send(JSON.stringify({ type: 'state', data: getState() }));

  ws.on('message', async (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    try {
      if (msg.type === 'send-message' && msg.content) {
        await sendMessage(String(msg.content));
      } else if (msg.type === 'stop-generation') {
        await stopGeneration();
      } else if (msg.type === 'switch-model' && msg.model) {
        await switchModel(String(msg.model));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', message: err.message }));
    }
  });

  ws.on('close', () => {
    removeClient(ws);
  });
});

server.listen(PORT, () => {
  console.log(`[v-cel] Server running on http://localhost:${PORT}`);
  console.log(`[v-cel] WebSocket: ws://localhost:${PORT}?password=<senha>`);
});

// Start CDP connection (non-blocking — retries automatically)
connect();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[v-cel] Shutting down...');
  wss.close();
  server.close(() => process.exit(0));
});
