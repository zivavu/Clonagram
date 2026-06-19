import { join } from 'node:path';

const PHASES = [
   { name: 'Generate profiles', file: 'generate.ts' },
   { name: 'Process images & videos', file: 'process.ts' },
   { name: 'Seed database', file: 'seed.ts' },
];

async function runPhase(name: string, filePath: string) {
   const width = 52;
   const label = `  ${name}  `;
   const pad = Math.max(0, Math.floor((width - label.length) / 2));
   console.log(`\n${'━'.repeat(width)}`);
   console.log(`${' '.repeat(pad)}${label}`);
   console.log('━'.repeat(width));

   const proc = Bun.spawn(['bun', 'run', filePath], {
      stdout: 'inherit',
      stderr: 'inherit',
      env: process.env,
   });

   const exitCode = await proc.exited;
   if (exitCode !== 0) throw new Error(`"${name}" exited with code ${exitCode}`);
}

async function main() {
   const start = Date.now();
   const dir = import.meta.dirname;

   for (const { name, file } of PHASES) {
      await runPhase(name, join(dir, file));
   }

   const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1);
   console.log(`\n${'━'.repeat(52)}`);
   console.log(`  ✓ All phases complete in ${elapsed}m`);
   console.log('━'.repeat(52));
}

main().catch(err => {
   console.error(err instanceof Error ? err.message : err);
   process.exit(1);
});
