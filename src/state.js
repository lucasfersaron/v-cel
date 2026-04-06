import { WebSocket } from 'ws';

/** @type {{ messages: Array<{role: string, content: string}>, currentModel: string|null, isGenerating: boolean }} */
const state = {
  messages: [],
  currentModel: null,
  isGenerating: false,
};

/** @type {Set<WebSocket>} */
const clients = new Set();

/**
 * Merge partial state and broadcast to all connected clients.
 * @param {Partial<typeof state>} patch
 */
export function setState(patch) {
  Object.assign(state, patch);
  broadcast({ type: 'state', data: getState() });
}

/** @returns {typeof state} */
export function getState() {
  return { ...state };
}

/** @param {WebSocket} ws */
export function addClient(ws) {
  clients.add(ws);
}

/** @param {WebSocket} ws */
export function removeClient(ws) {
  clients.delete(ws);
}

/** @returns {number} */
export function clientCount() {
  return clients.size;
}

/**
 * Send JSON payload to all open WebSocket clients.
 * @param {object} data
 */
export function broadcast(data) {
  const payload = JSON.stringify(data);
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}
