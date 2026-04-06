import { describe, it, expect, vi, beforeEach } from 'vitest';

// WebSocket.OPEN = 1 (per ws spec)
const WS_OPEN = 1;
const WS_CLOSED = 3;

let setState, getState, addClient, removeClient, clientCount, broadcast;

beforeEach(async () => {
  vi.resetModules();
  ({ setState, getState, addClient, removeClient, clientCount, broadcast } =
    await import('../src/state.js'));
});

describe('getState / setState', () => {
  it('returns initial state shape', () => {
    const s = getState();
    expect(s).toEqual({ messages: [], currentModel: null, isGenerating: false });
  });

  it('setState merges a partial patch', () => {
    setState({ currentModel: 'claude-3' });
    expect(getState().currentModel).toBe('claude-3');
    expect(getState().messages).toEqual([]); // untouched
  });

  it('setState replaces messages array', () => {
    const msgs = [{ role: 'user', content: 'hi' }];
    setState({ messages: msgs });
    expect(getState().messages).toEqual(msgs);
  });

  it('getState returns a shallow copy, not the internal reference', () => {
    const a = getState();
    const b = getState();
    expect(a).not.toBe(b); // different object references
  });
});

describe('addClient / removeClient / clientCount', () => {
  it('clientCount starts at 0', () => {
    expect(clientCount()).toBe(0);
  });

  it('addClient increments count', () => {
    const ws = { readyState: WS_OPEN, send: vi.fn() };
    addClient(ws);
    expect(clientCount()).toBe(1);
  });

  it('removeClient decrements count', () => {
    const ws = { readyState: WS_OPEN, send: vi.fn() };
    addClient(ws);
    removeClient(ws);
    expect(clientCount()).toBe(0);
  });

  it('multiple clients tracked independently', () => {
    const ws1 = { readyState: WS_OPEN, send: vi.fn() };
    const ws2 = { readyState: WS_OPEN, send: vi.fn() };
    addClient(ws1);
    addClient(ws2);
    expect(clientCount()).toBe(2);
    removeClient(ws1);
    expect(clientCount()).toBe(1);
  });
});

describe('broadcast', () => {
  it('sends JSON payload to all OPEN clients', () => {
    const ws1 = { readyState: WS_OPEN, send: vi.fn() };
    const ws2 = { readyState: WS_OPEN, send: vi.fn() };
    addClient(ws1);
    addClient(ws2);

    broadcast({ type: 'test', value: 42 });

    const expected = JSON.stringify({ type: 'test', value: 42 });
    expect(ws1.send).toHaveBeenCalledWith(expected);
    expect(ws2.send).toHaveBeenCalledWith(expected);
  });

  it('skips clients that are not OPEN', () => {
    const openWs = { readyState: WS_OPEN, send: vi.fn() };
    const closedWs = { readyState: WS_CLOSED, send: vi.fn() };
    addClient(openWs);
    addClient(closedWs);

    broadcast({ type: 'ping' });

    expect(openWs.send).toHaveBeenCalledOnce();
    expect(closedWs.send).not.toHaveBeenCalled();
  });

  it('does nothing when no clients are connected', () => {
    expect(() => broadcast({ type: 'noop' })).not.toThrow();
  });

  it('setState triggers broadcast to connected clients', () => {
    const ws = { readyState: WS_OPEN, send: vi.fn() };
    addClient(ws);

    setState({ isGenerating: true });

    expect(ws.send).toHaveBeenCalledOnce();
    const payload = JSON.parse(ws.send.mock.calls[0][0]);
    expect(payload.type).toBe('state');
    expect(payload.data.isGenerating).toBe(true);
  });
});
