// v-cel — Mobile WebSocket client for Antigravity mirror

const PASSWORD_KEY = 'v_cel_password';

// DOM refs
const statusDot = document.getElementById('status-dot');
const modelBadge = document.getElementById('model-badge');
const generatingIndicator = document.getElementById('generating-indicator');
const chatContainer = document.getElementById('chat-container');
const emptyState = document.getElementById('empty-state');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const stopBtn = document.getElementById('stop-btn');

let ws = null;
let reconnectTimer = null;

function getPassword() {
  let pwd = sessionStorage.getItem(PASSWORD_KEY);
  if (!pwd) {
    pwd = prompt('Senha de acesso:') ?? 'antigravity';
    sessionStorage.setItem(PASSWORD_KEY, pwd);
  }
  return pwd;
}

function getWsUrl() {
  const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const password = encodeURIComponent(getPassword());
  return `${proto}//${location.host}?password=${password}`;
}

function connect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  try {
    ws = new WebSocket(getWsUrl());
  } catch {
    scheduleReconnect();
    return;
  }

  ws.onopen = () => {
    statusDot.classList.add('connected');
    modelBadge.textContent = 'conectado';
  };

  ws.onmessage = (event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      return;
    }

    if (msg.type === 'state') {
      renderState(msg.data);
    } else if (msg.type === 'error') {
      console.error('[v-cel] Server error:', msg.message);
    }
  };

  ws.onclose = (event) => {
    statusDot.classList.remove('connected');
    modelBadge.textContent = 'desconectado';
    generatingIndicator.classList.remove('visible');

    // Clear stored password on auth failure (code 1006 = abnormal, 4001 = unauthorized)
    if (event.code === 4001) {
      sessionStorage.removeItem(PASSWORD_KEY);
    }

    scheduleReconnect();
  };

  ws.onerror = () => {
    // onclose will handle reconnect
  };
}

function scheduleReconnect() {
  reconnectTimer = setTimeout(connect, 3000);
}

function renderState(data) {
  // Update model badge
  if (data.currentModel) {
    modelBadge.textContent = data.currentModel;
  }

  // Update generating indicator
  generatingIndicator.classList.toggle('visible', !!data.isGenerating);

  // Render messages
  if (!data.messages || data.messages.length === 0) {
    chatContainer.innerHTML = '';
    chatContainer.appendChild(emptyState);
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  // Only re-render if content changed (avoid scroll jumps)
  const newContent = JSON.stringify(data.messages);
  if (chatContainer.dataset.lastContent === newContent) return;
  chatContainer.dataset.lastContent = newContent;

  const wasAtBottom = isScrolledToBottom();

  chatContainer.innerHTML = '';
  for (const msg of data.messages) {
    const div = document.createElement('div');
    const role = (msg.role ?? 'unknown').toLowerCase();
    div.className = `message ${role === 'user' ? 'user' : role === 'assistant' || role === 'ai' ? 'ai' : 'unknown'}`;
    div.textContent = msg.content ?? '';
    chatContainer.appendChild(div);
  }

  if (wasAtBottom || data.isGenerating) {
    scrollToBottom();
  }
}

function isScrolledToBottom() {
  const el = chatContainer;
  return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
  const content = messageInput.value.trim();
  if (!content || !ws || ws.readyState !== WebSocket.OPEN) return;

  ws.send(JSON.stringify({ type: 'send-message', content }));
  messageInput.value = '';
  messageInput.style.height = 'auto';
}

// Events
sendBtn.addEventListener('click', sendMessage);

stopBtn.addEventListener('click', () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'stop-generation' }));
  }
});

messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize textarea
messageInput.addEventListener('input', () => {
  messageInput.style.height = 'auto';
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 120)}px`;
});

// Start
connect();
