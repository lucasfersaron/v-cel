import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Intercept dotenv dynamic import inside config.js (top-level await)
vi.mock('dotenv', () => ({ config: vi.fn() }));

describe('config.js — defaults', () => {
  beforeEach(() => {
    vi.resetModules();
    // Remove vars so config falls back to ?? defaults
    delete process.env.PORT;
    delete process.env.APP_PASSWORD;
    delete process.env.CDP_PORT;
    delete process.env.SCREENSHOT_ENABLED;
    delete process.env.WORKSPACE_ROOT;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('PORT defaults to 4747', async () => {
    const { PORT } = await import('../src/config.js');
    expect(PORT).toBe(4747);
  });

  it('APP_PASSWORD defaults to "antigravity"', async () => {
    const { APP_PASSWORD } = await import('../src/config.js');
    expect(APP_PASSWORD).toBe('antigravity');
  });

  it('CDP_PORT defaults to 7800', async () => {
    const { CDP_PORT } = await import('../src/config.js');
    expect(CDP_PORT).toBe(7800);
  });

  it('SCREENSHOT_ENABLED defaults to false', async () => {
    const { SCREENSHOT_ENABLED } = await import('../src/config.js');
    expect(SCREENSHOT_ENABLED).toBe(false);
  });

  it('WORKSPACE_ROOT defaults to empty string', async () => {
    const { WORKSPACE_ROOT } = await import('../src/config.js');
    expect(WORKSPACE_ROOT).toBe('');
  });
});

describe('config.js — env overrides', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('PORT is overridden by process.env.PORT', async () => {
    vi.stubEnv('PORT', '9999');
    const { PORT } = await import('../src/config.js');
    expect(PORT).toBe(9999);
  });

  it('APP_PASSWORD is overridden by process.env.APP_PASSWORD', async () => {
    vi.stubEnv('APP_PASSWORD', 'supersecret');
    const { APP_PASSWORD } = await import('../src/config.js');
    expect(APP_PASSWORD).toBe('supersecret');
  });

  it('CDP_PORT is overridden by process.env.CDP_PORT', async () => {
    vi.stubEnv('CDP_PORT', '9222');
    const { CDP_PORT } = await import('../src/config.js');
    expect(CDP_PORT).toBe(9222);
  });

  it('SCREENSHOT_ENABLED is true when set to "true"', async () => {
    vi.stubEnv('SCREENSHOT_ENABLED', 'true');
    const { SCREENSHOT_ENABLED } = await import('../src/config.js');
    expect(SCREENSHOT_ENABLED).toBe(true);
  });

  it('SCREENSHOT_ENABLED is false when set to any other string', async () => {
    vi.stubEnv('SCREENSHOT_ENABLED', 'yes');
    const { SCREENSHOT_ENABLED } = await import('../src/config.js');
    expect(SCREENSHOT_ENABLED).toBe(false);
  });
});
