# Story S4: End-to-End Validation of Send-Message Flow

**Epic:** EPIC-VCEL-001 — Project Consolidation
**PRD:** PRD-001-v-cel-consolidation
**Priority:** P1
**Assigned to:** @qa (Quinn)
**Status:** Draft
**Estimated effort:** 15 min
**Depends on:** S2 (selectors must be validated first)

---

## Description

Validate the complete send-message flow from mobile UI to Antigravity chat input. This is the core user journey: user types on phone → message reaches Antigravity → AI responds → response mirrors back to phone.

---

## Acceptance Criteria

- [ ] AC1: Mobile UI sends `{type: 'send-message', content: 'test'}` via WebSocket
- [ ] AC2: Server receives message and calls `sendMessage()` in CDP connection
- [ ] AC3: CDP `Runtime.evaluate` executes on Antigravity page
- [ ] AC4: Text appears in Antigravity chat input field
- [ ] AC5: Send button is triggered (message is submitted)
- [ ] AC6: Antigravity AI response appears in poll() within 2 seconds of completion
- [ ] AC7: Response is broadcast to mobile client via WebSocket state update
- [ ] AC8: Mobile UI renders the AI response in chat container

---

## Technical Notes

### Test Flow

```
Mobile (app.js)           Server (server.js)         CDP (connection.js)        Antigravity
     |                          |                          |                        |
     |-- WS: send-message ----->|                          |                        |
     |                          |-- sendMessage(text) ----->|                        |
     |                          |                          |-- Runtime.evaluate ---->|
     |                          |                          |   (insert text + click) |
     |                          |                          |                        |-- AI generates
     |                          |                          |<-- poll() reads DOM ----|
     |                          |<-- setState(messages) ----|                        |
     |<-- WS: state update -----|                          |                        |
     |   (render new message)   |                          |                        |
```

### Validation Method

1. Start Antigravity with CDP port 7800
2. Start v-cel server (`npm run dev`)
3. Open mobile UI in browser (`http://localhost:4747`)
4. Authenticate with password
5. Send a test message (e.g., "Hello from v-cel test")
6. Verify message appears in Antigravity
7. Wait for AI response
8. Verify response appears in mobile UI

---

## Preconditions

- S2 completed (CDP selectors validated)
- Antigravity running with `--remote-debugging-port=7800`
- v-cel server running on port 4747

---

## File List

No code changes expected — this is a validation story. If issues found:
- `src/cdp/connection.js` — POTENTIAL FIX (sendMessage flow)
- `public/app.js` — POTENTIAL FIX (rendering)

---

## Definition of Done

- [ ] Full round-trip message flow works (phone → Antigravity → phone)
- [ ] Latency from AI completion to mobile display < 2s (poll interval)
- [ ] No console errors on server or client during flow
