# Story S3: Create Vitest Suite for Core Modules

**Epic:** EPIC-VCEL-001 — Project Consolidation
**PRD:** PRD-001-v-cel-consolidation
**Priority:** P1
**Assigned to:** @qa (Quinn)
**Status:** Draft
**Estimated effort:** 15 min

---

## Description

vitest is installed as a devDependency but there are zero test files and no `test/` directory. Create a test suite covering the core modules that don't require a live CDP connection: `config.js`, `state.js`, and WebSocket auth in `server.js`.

---

## Acceptance Criteria

- [x] AC1: Create `test/` directory at project root
- [x] AC2: Create `test/config.test.js` — tests for config defaults and env override
- [x] AC3: Create `test/state.test.js` — tests for setState, getState, addClient, removeClient, broadcast
- [x] AC4: Create `test/server-auth.test.js` — tests for WebSocket upgrade auth (accept valid password, reject invalid)
- [x] AC5: All tests pass with `npm test`
- [x] AC6: No tests require running Antigravity/CDP (pure unit tests)

---

## Technical Notes

### config.test.js

- Test default values when no env vars set (PORT=4747, APP_PASSWORD='antigravity', CDP_PORT=7800)
- Test that env vars override defaults (set process.env before import)
- Note: config.js uses top-level await for dotenv — may need dynamic import in tests

### state.test.js

- Test `setState({messages: [...]})` updates state
- Test `getState()` returns copy (not reference)
- Test `addClient(ws)` / `removeClient(ws)` / `clientCount()`
- Test `broadcast()` sends to all open clients, skips closed ones
- Mock WebSocket objects with `readyState` and `send()` method

### server-auth.test.js

- Test WebSocket connection with correct password → accepted
- Test WebSocket connection with wrong password → 401
- Test WebSocket connection with no password → 401
- Use supertest or direct HTTP upgrade request

---

## File List

- `test/config.test.js` — CREATE
- `test/state.test.js` — CREATE
- `test/server-auth.test.js` — CREATE

---

## Definition of Done

- [x] `npm test` passes with 0 failures (25 tests)
- [x] At least 3 test files covering config, state, server auth
- [x] No CDP dependency in any test
