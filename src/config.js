import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');

// Load .env if it exists (optional — defaults are used otherwise)
if (existsSync(envPath)) {
  const { config } = await import('dotenv');
  config({ path: envPath });
}

export const PORT = parseInt(process.env.PORT ?? '4747', 10);
export const APP_PASSWORD = process.env.APP_PASSWORD ?? 'antigravity';
export const CDP_PORT = parseInt(process.env.CDP_PORT ?? '7800', 10);
export const SCREENSHOT_ENABLED = process.env.SCREENSHOT_ENABLED === 'true';
export const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT ?? '';
