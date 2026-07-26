'use client';

import { useEffect, useRef } from 'react';
import { getMuxThumbnailUrl } from '@/src/utils/mux';
import type { StoryEntry } from '../types';

// How far ahead of the viewer to warm media within the current entry. Story
// images are 25-80 KB, so two ahead covers a fast clicker without pulling down
// media that is likely never seen.
const LOOKAHEAD = 2;

function mediaUrl(media: StoryEntry['stories'][number]) {
   if (!media.url) return null;
   // Videos stream through Mux, which does its own buffering — warming the
   // poster is the useful part.
   return media.type === 'video' ? getMuxThumbnailUrl(media.url) : media.url;
}

/**
 * The URLs worth warming from a given position: the next few media of the
 * current entry, then the first media of the entry the viewer lands on next.
 * Wraps at the end of the list, matching how the viewer advances.
 */
export function selectPrefetchUrls(
   entries: StoryEntry[],
   currentUserIndex: number,
   currentStoryMediaIndex: number,
): string[] {
   const entry = entries[currentUserIndex];
   if (!entry) return [];

   const urls: string[] = [];

   for (let offset = 1; offset <= LOOKAHEAD; offset++) {
      const media = entry.stories[currentStoryMediaIndex + offset];
      if (!media) break;
      const url = mediaUrl(media);
      if (url) urls.push(url);
   }

   if (entries.length > 1) {
      const nextEntry = entries[(currentUserIndex + 1) % entries.length];
      const nextUrl = nextEntry?.stories[0] ? mediaUrl(nextEntry.stories[0]) : null;
      if (nextUrl) urls.push(nextUrl);
   }

   return [...new Set(urls)];
}

/**
 * Warms upcoming story media so navigating with the arrows renders from cache
 * instead of starting a ~500ms round trip on click.
 *
 * The prefetched URL must stay byte-identical to what the <Image> later
 * requests, or it warms a different cache entry and buys nothing. Story images
 * render with `unoptimized`, so the raw URL is what gets requested — if that
 * ever changes, this has to request the /_next/image?url=... form instead.
 */
export function useStoryMediaPrefetch(
   entries: StoryEntry[],
   currentUserIndex: number,
   currentStoryMediaIndex: number,
) {
   const warmedRef = useRef(new Set<string>());
   // Holding the Image objects keeps them from being collected before the
   // response lands, which would waste the request.
   const inFlightRef = useRef<HTMLImageElement[]>([]);

   useEffect(() => {
      const urls = selectPrefetchUrls(entries, currentUserIndex, currentStoryMediaIndex);

      for (const url of urls) {
         if (warmedRef.current.has(url)) continue;
         warmedRef.current.add(url);

         const img = new window.Image();
         // Prefetching is best-effort: a failure just means the click pays the
         // network cost it would have paid anyway.
         img.onload = img.onerror = () => {
            inFlightRef.current = inFlightRef.current.filter(i => i !== img);
         };
         img.src = url;
         inFlightRef.current.push(img);
      }
   }, [entries, currentUserIndex, currentStoryMediaIndex]);
}
