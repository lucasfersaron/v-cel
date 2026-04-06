# Story S2: Validate CDP Selectors Against Antigravity DOM

**Epic:** EPIC-VCEL-001 — Project Consolidation
**PRD:** PRD-001-v-cel-consolidation
**Priority:** P0
**Assigned to:** @dev (Dex)
**Status:** Draft
**Estimated effort:** 15 min

---

## Description

The CDP selectors in `src/cdp/connection.js` are generic guesses that have never been validated against the real Antigravity UI. Without correct selectors, the entire product is non-functional. This story requires connecting to a running Antigravity instance and inspecting the actual DOM.

---

## Acceptance Criteria

- [ ] AC1: Connect to Antigravity via CDP port 7800 and list available page targets
- [ ] AC2: Identify correct selector for chat messages (currently `[role="article"]`)
- [ ] AC3: Identify correct selector for model indicator (currently `[data-model]` / `[data-testid="model-selector"]`)
- [ ] AC4: Identify correct selector for chat input (currently `[contenteditable="true"]` / `textarea[placeholder]`)
- [ ] AC5: Identify correct selector for send button (currently `[aria-label="Send"]` / `button[type="submit"]`)
- [ ] AC6: Identify correct selector for stop button (currently `[aria-label*="Stop"]` / `[data-testid="stop-button"]`)
- [ ] AC7: Identify correct selector for generating state (currently `[aria-busy="true"]`)
- [ ] AC8: Update `src/cdp/connection.js` with validated selectors
- [ ] AC9: Document Antigravity version tested in a comment at top of `connection.js`

---

## Technical Notes

### Inspection Method

1. Start Antigravity with `--remote-debugging-port=7800`
2. Open `http://localhost:7800/json` to see targets
3. Use CDP `Runtime.evaluate` with `document.querySelectorAll(...)` to test each selector
4. Alternatively, open `chrome://inspect` and connect to the Antigravity page

### Current Selectors to Validate (connection.js:69-83)

```javascript
// Messages
document.querySelectorAll('[role="article"]')

// Model
document.querySelector('[data-model]')?.dataset.model
document.querySelector('[data-testid="model-selector"]')?.textContent

// Generating state
document.querySelector('[aria-busy="true"]')
document.querySelector('[aria-label*="Stop"]')
document.querySelector('[data-testid="stop-button"]')
```

### Send flow selectors (connection.js:105-117)

```javascript
// Input
document.querySelector('[contenteditable="true"]')
document.querySelector('textarea[placeholder]')

// Send button
document.querySelector('[aria-label="Send"]')
document.querySelector('button[type="submit"]')
document.querySelector('[data-testid="send-button"]')
```

---

## Preconditions

- Antigravity installed and running with `--remote-debugging-port=7800`
- An active chat session open in Antigravity (to have DOM elements present)

---

## File List

- `src/cdp/connection.js` — UPDATE (selectors in poll(), sendMessage(), stopGeneration(), switchModel())

---

## Definition of Done

- [ ] All selectors validated against real Antigravity DOM
- [ ] connection.js updated with working selectors
- [ ] Antigravity version documented
- [ ] Poll function returns actual messages from live session
