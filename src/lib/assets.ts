import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** True when a file exists under `public/` for the given URL path. */
export function publicAssetExists(publicPath: string): boolean {
  return existsSync(join(process.cwd(), 'public', publicPath.replace(/^\//, '')));
}
