# PRD-001: v-cel Consolidation

**Product:** v-cel — Remote Chat Mobile for Antigravity Sessions
**Type:** Brownfield Consolidation
**Author:** @pm (Morgan)
**Date:** 2026-04-06
**Status:** Draft

---

## 1. Problem Statement

v-cel has a functional MVP (2 commits) but the implementation was done without story-driven tracking. The task.md is completely outdated (all checkboxes unchecked despite code existing), CDP selectors are unvalidated against the real Antigravity UI, there are zero tests, and one P2 feature (multi-window) is missing.

The project needs consolidation before it can be considered production-ready for daily use.

---

## 2. Current State Assessment

### What Exists (Implemented)

| Component | File | Status |
|-----------|------|--------|
| Express + WebSocket server | `src/server.js` | Working |
| Environment config | `src/config.js` | Working |
| Shared state + broadcast | `src/state.js` | Working |
| CDP connection + polling | `src/cdp/connection.js` | Unvalidated selectors |
| Mobile UI (HTML) | `public/index.html` | Working |
| WebSocket client | `public/app.js` | Working |
| Auth (WS upgrade) | `src/server.js:26-38` | Working |
| Start script | `start.sh` | Working |
| README | `README.md` | Complete |
| .env.example | `.env.example` | Complete |

### What's Missing

| Item | Priority | Risk |
|------|----------|------|
| CDP selectors not validated against real Antigravity DOM | P0 | HIGH — app may not work at all |
| Zero test files (vitest in devDeps, unused) | P1 | MEDIUM — no regression safety |
| task.md outdated (no checkboxes reflect reality) | P1 | LOW — project tracking broken |
| Multi-window switching | P2 | LOW — nice-to-have |
| `test/` directory missing | P1 | LOW — structural |
| Model switching selectors unvalidated | P2 | MEDIUM — feature may not work |

---

## 3. Goals

### Primary Goal
Make v-cel reliably mirror and interact with Antigravity chat from a mobile device.

### Success Criteria
1. CDP selectors correctly extract messages from Antigravity UI
2. Sending messages from mobile reaches Antigravity input
3. State sync latency < 2 seconds (polling interval)
4. Test coverage on core modules (config, state, server auth)
5. task.md reflects actual project state

---

## 4. Scope

### In Scope (This Epic)
- Validate/fix CDP selectors against real Antigravity DOM
- Create test suite for core modules
- Update task.md to reflect reality
- Validate send-message flow end-to-end

### Out of Scope (Future)
- Multi-window switching (P2 — separate epic)
- Screenshot timeline feature
- SSL/HTTPS setup
- PWA manifest for mobile install

---

## 5. Technical Considerations

### CDP Selector Risk
The current selectors in `src/cdp/connection.js` are generic guesses:
- `[role="article"]` for messages
- `[data-model]` / `[data-testid="model-selector"]` for model detection
- `[contenteditable="true"]` / `textarea[placeholder]` for input
- `[aria-label="Send"]` / `button[type="submit"]` for send button

These MUST be validated by inspecting the real Antigravity DOM via CDP. The entire product depends on these selectors being correct.

### Test Strategy
- Unit tests: `config.js`, `state.js` (pure logic, no CDP needed)
- Integration test: WebSocket auth flow (mock server)
- CDP tests: require running Antigravity instance (manual/CI exclusion)

---

## 6. Epic Breakdown

### EPIC-VCEL-001: Project Consolidation

| Story | Title | Agent | Priority |
|-------|-------|-------|----------|
| S1 | Update task.md to reflect current state | @dev | P0 |
| S2 | Validate CDP selectors against Antigravity DOM | @dev | P0 |
| S3 | Create Vitest suite for core modules | @qa | P1 |
| S4 | End-to-end validation of send-message flow | @qa | P1 |

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Antigravity DOM changes between versions | Selectors break | Document exact Antigravity version tested; make selectors configurable |
| CDP port not available | App can't connect | Already handled — retry logic in connection.js |
| ngrok rate limits | Mobile access blocked | Document alternative tunnels (cloudflared, localtunnel) |

---

*PRD created by @pm (Morgan) for v-cel consolidation.*
*Handoff to: @sm (River) for story creation.*
