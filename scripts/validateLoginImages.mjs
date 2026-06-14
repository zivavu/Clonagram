import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(root, 'src/pageComponents/Login/loginCardPeople.ts'), 'utf8');

const srcs = [...source.matchAll(/src:\s*'([^']+)'/g)].map(([, s]) => s);

if (srcs.length === 0) {
   process.exit(1);
}

const dir = join(root, 'public', 'loginPageCardsPeople');
const missing = srcs.filter(src => !existsSync(join(dir, src)));

if (missing.length > 0) {
   for (const src of missing) {
      process.stderr.write(`  public/loginPageCardsPeople/${src}\n`);
   }
   process.exit(1);
}
