const day = 86_400_000;

export function isOlderThan24h(isoString: string): boolean {
   const date = new Date(isoString);
   const now = new Date();
   const diff = now.getTime() - date.getTime();
   return diff >= day;
}

export function formatMessageTimestamp(isoString: string): string {
   const date = new Date(isoString);
   const now = new Date();
   const diff = now.getTime() - date.getTime();
   const days = Math.floor(diff / day);

   if (days === 1) return 'Yesterday';
   if (days < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
   return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateSeparator(isoString: string): string {
   const date = new Date(isoString);
   const now = new Date();
   const diff = now.getTime() - date.getTime();
   const days = Math.floor(diff / day);

   if (days === 0) return 'Today';
   if (days === 1) return 'Yesterday';
   if (days < 365) return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
   return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatGroupSeparator(isoString: string): string {
   const date = new Date(isoString);
   const now = new Date();
   const diff = now.getTime() - date.getTime();
   const days = Math.floor(diff / day);
   const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

   if (days === 0) return timeStr;
   if (days < 7) return `${date.toLocaleDateString('en-US', { weekday: 'short' })} ${timeStr}`;
   if (days < 365) return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${timeStr}`;
   return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${timeStr}`;
}

export function formatTimestamp(isoString: string): string {
   const date = new Date(isoString);
   const now = new Date();
   const diff = now.getTime() - date.getTime();
   const days = Math.floor(diff / day);

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
