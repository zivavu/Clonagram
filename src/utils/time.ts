export function formatRelativeTimeShortUnit(timestamp: string): string {
   const date = new Date(timestamp);
   if (Number.isNaN(date.getTime())) return '';

   const diff = Date.now() - date.getTime();
   const MINUTE = 60_000;
   const units: [number, string][] = [
      [365 * 24 * 60 * MINUTE, 'y'],
      [30 * 24 * 60 * MINUTE, 'mo'],
      [7 * 24 * 60 * MINUTE, 'w'],
      [24 * 60 * MINUTE, 'd'],
      [60 * MINUTE, 'h'],
      [MINUTE, 'm'],
   ];

   for (const [milliseconds, label] of units) {
      if (diff >= milliseconds) return `${Math.floor(diff / milliseconds)}${label}`;
   }

   return 'just now';
}
