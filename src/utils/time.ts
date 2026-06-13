export const MINUTE_MS = 60_000;
export const HOUR_MS = 60 * MINUTE_MS;
export const DAY_MS = 86_400_000;
export const WEEK_MS = 7 * DAY_MS;

function getDiff(isoString: string) {
   const date = new Date(isoString);
   const diff = Number.isNaN(date.getTime()) ? NaN : Date.now() - date.getTime();
   return { date, diff, days: Number.isNaN(diff) ? NaN : Math.floor(diff / DAY_MS) };
}

export function isOlderThan24h(isoString: string): boolean {
   const { diff } = getDiff(isoString);
   return diff >= DAY_MS;
}

export function formatMessageTimestamp(isoString: string): string {
   const { date, days } = getDiff(isoString);

   if (days === 1) return 'Yesterday';
   if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateSeparator(isoString: string): string {
   const { date, days } = getDiff(isoString);

   if (days === 0) return 'Today';
   if (days === 1) return 'Yesterday';
   if (days < 365) return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
   return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatGroupSeparator(isoString: string): string {
   const { date, days } = getDiff(isoString);
   const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

   if (days === 0) return timeStr;
   if (days < 7) return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${timeStr}`;
   if (days < 365)
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${timeStr}`;
   return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${timeStr}`;
}

export function formatTimestamp(isoString: string): string {
   const { date, diff, days } = getDiff(isoString);

   if (days === 0) {
      const diffMinutes = Math.floor(diff / MINUTE_MS);
      if (diffMinutes < 1) return 'now';
      if (diffMinutes < 60) return `${diffMinutes}m`;
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}h`;
   }
   if (days === 1) return 'Yesterday';
   if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatRelativeTime(timestamp: string, longUnit: boolean): string {
   const { date, diff } = getDiff(timestamp);
   if (Number.isNaN(diff)) return '';

   if (longUnit) {
      if (diff >= WEEK_MS) {
         return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
      }
      const days = Math.floor(diff / DAY_MS);
      if (diff >= DAY_MS) return `${days} ${days === 1 ? 'day' : 'days'} ago`;
      const hours = Math.floor(diff / HOUR_MS);
      if (diff >= HOUR_MS) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
      const minutes = Math.floor(diff / MINUTE_MS);
      if (diff >= MINUTE_MS) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
      return 'just now';
   }

   const units: [number, string][] = [
      [365 * 24 * HOUR_MS, 'y'],
      [30 * 24 * HOUR_MS, 'mo'],
      [7 * 24 * HOUR_MS, 'w'],
      [24 * HOUR_MS, 'd'],
      [HOUR_MS, 'h'],
      [MINUTE_MS, 'm'],
   ];

   for (const [milliseconds, label] of units) {
      if (diff >= milliseconds) return `${Math.floor(diff / milliseconds)}${label}`;
   }

   return 'just now';
}

export function formatRelativeTimeLongUnit(timestamp: string): string {
   return formatRelativeTime(timestamp, true);
}

export function formatRelativeTimeShortUnit(timestamp: string): string {
   return formatRelativeTime(timestamp, false);
}
