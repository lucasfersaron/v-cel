/**
 * WebSocket upgrade authentication tests.
 *
 * Instead of importing server.js (which has CDP side-effects and calls
 * server.listen on import), we replicate the exact same upgrade auth handler
 * in a self-contained test server. This validates the auth logic in isolation
 * without requiring a live CDP connection.
 */
import http from 'http';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

const TEST_PASSWORD = 'test-password';

let server;
let port;

// Mirrors the auth pattern in src/server.js lines 26-38
function createAuthServer(password) {
  const wss = new WebSocketServer({ noServer: true });
  const srv = http.createServer();

  srv.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, 'http://localhost');
    const provided = url.searchParams.get('password');

    if (provided !== password) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });

  return srv;
}

beforeAll(() => {
  server = createAuthServer(TEST_PASSWORD);
  return new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});

afterAll(() => {
  return new Promise((resolve) => server.close(resolve));
});

describe('WebSocket upgrade auth', () => {
  it('accepts connection with correct password', () => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${port}?password=${TEST_PASSWORD}`);
      ws.on('open', () => {
        ws.close();
        resolve();
      });
      ws.on('error', reject);
      setTimeout(() => reject(new Error('timeout')), 2000);
    });
  });

  it('rejects connection with wrong password → 401', () => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${port}?password=wrong`);
      ws.on('unexpected-response', (_req, res) => {
        expect(res.statusCode).toBe(401);
        resolve();
      });
      ws.on('open', () => reject(new Error('should not have connected')));
      ws.on('error', (err) => {
        // ws may emit error instead of unexpected-response on some Node versions
        if (err.message.includes('401') || err.message.includes('Unexpected server response')) {
          resolve();
        } else {
          reject(err);
        }
      });
      setTimeout(() => reject(new Error('timeout')), 2000);
    });
  });

  it('rejects connection with no password → 401', () => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${port}`);
      ws.on('unexpected-response', (_req, res) => {
        expect(res.statusCode).toBe(401);
        resolve();
      });
      ws.on('open', () => reject(new Error('should not have connected')));
      ws.on('error', (err) => {
        if (err.message.includes('401') || err.message.includes('Unexpected server response')) {
          resolve();
        } else {
          reject(err);
        }
      });
      setTimeout(() => reject(new Error('timeout')), 2000);
    });
  });
});
