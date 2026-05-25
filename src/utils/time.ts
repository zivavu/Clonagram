export function formatRelativeTimeLongUnit(timestamp: string): string {
   const date = new Date(timestamp);
   if (Number.isNaN(date.getTime())) return '';

   const diff = Date.now() - date.getTime();
   const MINUTE = 60_000;
   const HOUR = 60 * MINUTE;
   const DAY = 24 * HOUR;
   const WEEK = 7 * DAY;

   if (diff >= WEEK) {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
   }
   const days = Math.floor(diff / DAY);
   if (diff >= DAY) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
   const hours = Math.floor(diff / HOUR);
   if (diff >= HOUR) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
   const minutes = Math.floor(diff / MINUTE);
   if (diff >= MINUTE) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
   return 'just now';
}

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
