import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'apps', 'web', 'dist');

try {
  if (existsSync(distDir)) {
    rmSync(distDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
    console.log('[clean] Removed ' + distDir);
  } else {
    console.log('[clean] Nothing to remove.');
  }
} catch (error) {
  console.warn('[clean] Failed to remove dist directory:', error?.message || error);
  throw error;
}

