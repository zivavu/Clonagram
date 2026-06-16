export interface UnsplashAttribution {
   photographerName: string;
   photographerUrl: string;
   photoUrl: string;
}

export function parseUnsplashAttribution(value: unknown): UnsplashAttribution | null {
   if (
      typeof value === 'object' &&
      value !== null &&
      'photographerName' in value &&
      'photographerUrl' in value &&
      'photoUrl' in value
   ) {
      return value as UnsplashAttribution;
   }
   return null;
}
