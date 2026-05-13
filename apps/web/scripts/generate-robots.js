import fs from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config } from 'dotenv';

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

config({ path: resolve(appRoot, '.env') });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
const isProduction =
  process.env.APP_ENV === 'production' || process.env.NODE_ENV === 'production';

const fullBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

const content = isProduction
  ? `User-agent: *
Disallow: /_next/
Allow: /_next/image/
Allow: /

Sitemap: ${fullBaseUrl}/sitemap.xml
`
  : `User-agent: *
Disallow: /
`;

const outPath = resolve(appRoot, 'public/robots.txt');
fs.mkdirSync(dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, content, 'utf8');
