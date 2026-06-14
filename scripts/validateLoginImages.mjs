import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(
   join(root, 'src/pageComponents/Login/loginCardPeople.ts'),
   'utf8',
);

const srcs = [...source.matchAll(/src:\s*'([^']+)'/g)].map(([, s]) => s);

if (srcs.length === 0) {
   console.error('No src entries found in loginCardPeople.ts — check the regex');
   process.exit(1);
}

const dir = join(root, 'public', 'loginPageCardsPeople');
const missing = srcs.filter((src) => !existsSync(join(dir, src)));

if (missing.length > 0) {
   console.error('Missing login card images:');
   missing.forEach((src) => console.error(`  public/loginPageCardsPeople/${src}`));
   process.exit(1);
}

console.log(`✓ All ${srcs.length} login card images present`);
