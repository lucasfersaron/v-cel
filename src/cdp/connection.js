import CDP from 'chrome-remote-interface';
import { CDP_PORT } from '../config.js';
import { setState } from '../state.js';

const POLL_INTERVAL_MS = 2000;
const RETRY_DELAY_MS = 5000;

let client = null;
let pollTimer = null;
let connected = false;

export function isConnected() {
  return connected;
}

/**
 * Start CDP connection to Antigravity.
 * Retries automatically on failure.
 */
export async function connect() {
  try {
    const targets = await CDP.List({ port: CDP_PORT });
    const page = targets.find((t) => t.type === 'page');

    if (!page) {
      throw new Error('No page target found');
    }

    client = await CDP({ target: page.webSocketDebuggerUrl });
    await client.Runtime.enable();

    connected = true;
    console.log(`[CDP] Connected to Antigravity (${page.title ?? page.url})`);

    client.on('disconnect', () => {
      connected = false;
      client = null;
      stopPolling();
      console.log('[CDP] Disconnected — retrying in 5s...');
      setTimeout(connect, RETRY_DELAY_MS);
    });

    startPolling();
  } catch (err) {
    connected = false;
    client = null;
    console.log(`[CDP] Antigravity not found on port ${CDP_PORT} — retrying in 5s...`);
    setTimeout(connect, RETRY_DELAY_MS);
  }
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(poll, POLL_INTERVAL_MS);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

async function poll() {
  if (!client) return;

  try {
    const result = await client.Runtime.evaluate({
      expression: `
        JSON.stringify({
          messages: Array.from(document.querySelectorAll('[role="article"]')).map(el => ({
            role: el.dataset.role || (el.querySelector('[data-message-author-role]')?.dataset.messageAuthorRole) || 'unknown',
            content: el.textContent.trim()
          })),
          model: document.querySelector('[data-model]')?.dataset.model
            ?? document.querySelector('[data-testid="model-selector"]')?.textContent.trim()
            ?? null,
          isGenerating: !!(document.querySelector('[aria-busy="true"]')
            || document.querySelector('[aria-label*="Stop"]')
            || document.querySelector('[data-testid="stop-button"]'))
        })
      `,
      returnByValue: true,
    });

    if (result.result?.value) {
      const parsed = JSON.parse(result.result.value);
      setState(parsed);
    }
  } catch (err) {
    // CDP call failed — disconnect handler will trigger reconnect
  }
}

/**
 * Send a message to the Antigravity chat input.
 * @param {string} text
 */
export async function sendMessage(text) {
  if (!client) throw new Error('CDP not connected');

  await client.Runtime.evaluate({
    expression: `
      (function() {
        const input = document.querySelector('[contenteditable="true"]')
          || document.querySelector('textarea[placeholder]');
        if (!input) return false;
        input.focus();
        document.execCommand('insertText', false, ${JSON.stringify(text)});
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const send = document.querySelector('[aria-label="Send"]')
          || document.querySelector('button[type="submit"]')
          || document.querySelector('[data-testid="send-button"]');
        if (send) send.click();
        return true;
      })()
    `,
    returnByValue: true,
  });
}

/**
 * Stop the current AI generation.
 */
export async function stopGeneration() {
  if (!client) throw new Error('CDP not connected');

  await client.Runtime.evaluate({
    expression: `
      (document.querySelector('[aria-label*="Stop"]')
        || document.querySelector('[data-testid="stop-button"]'))?.click()
    `,
  });
}

/**
 * Switch the AI model.
 * @param {string} modelName
 */
export async function switchModel(modelName) {
  if (!client) throw new Error('CDP not connected');

  await client.Runtime.evaluate({
    expression: `
      (function() {
        const selector = document.querySelector('[data-testid="model-selector"]')
          || document.querySelector('[data-model]')
          || document.querySelector('[aria-label*="model"]');
        if (selector) selector.click();
        setTimeout(() => {
          const option = Array.from(document.querySelectorAll('[role="option"]'))
            .find(el => el.textContent.includes(${JSON.stringify(modelName)}));
          if (option) option.click();
        }, 300);
      })()
    `,
  });
}
