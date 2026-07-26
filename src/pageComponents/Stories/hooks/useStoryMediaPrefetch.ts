'use client';

import { useEffect, useRef } from 'react';
import { getMuxThumbnailUrl } from '@/src/utils/mux';
import type { StoryEntry } from '../types';

const LOOKAHEAD = 2;

function mediaUrl(media: StoryEntry['stories'][number]) {
   if (!media.url) return null;
   return media.type === 'video' ? getMuxThumbnailUrl(media.url) : media.url;
}

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

export function useStoryMediaPrefetch(
   entries: StoryEntry[],
   currentUserIndex: number,
   currentStoryMediaIndex: number,
) {
   const warmedRef = useRef(new Set<string>());
   const inFlightRef = useRef<HTMLImageElement[]>([]);

   useEffect(() => {
      const urls = selectPrefetchUrls(entries, currentUserIndex, currentStoryMediaIndex);

      for (const url of urls) {
         if (warmedRef.current.has(url)) continue;
         warmedRef.current.add(url);

         const img = new window.Image();
         img.onload = img.onerror = () => {
            inFlightRef.current = inFlightRef.current.filter(i => i !== img);
         };
         img.src = url;
         inFlightRef.current.push(img);
      }
   }, [entries, currentUserIndex, currentStoryMediaIndex]);
}
