const DAY_MS = 86_400_000;

function getDateDiff(isoString: string): {
   date: Date;
   now: Date;
   diff: number;
   days: number;
} {
   const date = new Date(isoString);
   const now = new Date();
   const diff = now.getTime() - date.getTime();
   return { date, now, diff, days: Math.floor(diff / DAY_MS) };
}

export function isOlderThan24h(isoString: string): boolean {
   const { diff } = getDateDiff(isoString);
   return diff >= DAY_MS;
}

export function formatMessageTimestamp(isoString: string): string {
   const { date, days } = getDateDiff(isoString);

   if (days === 1) return 'Yesterday';
   if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateSeparator(isoString: string): string {
   const { date, days } = getDateDiff(isoString);

   if (days === 0) return 'Today';
   if (days === 1) return 'Yesterday';
   if (days < 365) return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
   return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatGroupSeparator(isoString: string): string {
   const { date, days } = getDateDiff(isoString);
   const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

   if (days === 0) return timeStr;
   if (days < 7) return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${timeStr}`;
   if (days < 365)
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${timeStr}`;
   return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${timeStr}`;
}

export function formatTimestamp(isoString: string): string {
   const { date, diff, days } = getDateDiff(isoString);

   if (days === 0) {
      const diffMinutes = Math.floor(diff / 60_000);
      if (diffMinutes < 1) return 'now';
      if (diffMinutes < 60) return `${diffMinutes}m`;
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}h`;
   }
   if (days === 1) return 'Yesterday';
   if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

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
