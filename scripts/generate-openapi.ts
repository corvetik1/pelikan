#!/usr/bin/env ts-node
/**
 * generate-openapi.ts
 *
 * Temporary script that outputs the current OpenAPI specification to stdout.
 * Later we will replace this with real generation from Zod schemas, but for now
 * it keeps CI workflow consistent.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function main(): void {
  const specPath = join(__dirname, '..', 'docs', 'openapi.json');
  let content = existsSync(specPath) ? readFileSync(specPath, 'utf8') : '';
  // Placeholder: in future generate spec dynamically. For now just ensure file exists.
  if (!content.trim()) {
    content = JSON.stringify({
      openapi: '3.0.3',
      info: { title: 'Pelican Bay API', version: '1.0.0' },
      paths: {},
    }, null, 2);
    console.warn('openapi.json missing or empty – wrote fallback minimal spec.');
  }

  writeFileSync(specPath, content, 'utf8');
  console.log(`OpenAPI spec ensured (${content.length} bytes).`);
}

main();
