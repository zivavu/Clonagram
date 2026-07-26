import { describe, expect, test } from 'bun:test';
import type { StoryEntry } from '../types';
import { selectPrefetchUrls } from './useStoryMediaPrefetch';

function media(url: string, type: 'image' | 'video' = 'image') {
   return {
      storyId: url,
      type,
      url,
      blurDataUrl: null,
      unsplashAttribution: null,
      timestamp: '2026-07-25T00:00:00Z',
   };
}

function entry(slug: string, urls: ReturnType<typeof media>[]): StoryEntry {
   return {
      userId: slug,
      slug,
      username: slug,
      avatarUrl: null,
      timestamp: '2026-07-25T00:00:00Z',
      stories: urls,
   };
}

describe('selectPrefetchUrls', () => {
   test('warms the next two media of the current entry plus the next entry first', () => {
      const entries = [
         entry('a', [media('a0'), media('a1'), media('a2'), media('a3')]),
         entry('b', [media('b0'), media('b1')]),
      ];

      expect(selectPrefetchUrls(entries, 0, 0)).toEqual(['a1', 'a2', 'b0']);
   });

   test('stops at the end of the current entry media', () => {
      const entries = [entry('a', [media('a0'), media('a1')]), entry('b', [media('b0')])];

      expect(selectPrefetchUrls(entries, 0, 1)).toEqual(['b0']);
   });

   test('wraps to the first entry from the last one', () => {
      const entries = [entry('a', [media('a0')]), entry('b', [media('b0'), media('b1')])];

      expect(selectPrefetchUrls(entries, 1, 0)).toEqual(['b1', 'a0']);
   });

   test('warms the Mux thumbnail for video media rather than the stream', () => {
      const entries = [entry('a', [media('a0'), media('playback-id', 'video')])];

      expect(selectPrefetchUrls(entries, 0, 0)).toEqual([
         'https://image.mux.com/playback-id/thumbnail.jpg',
      ]);
   });

   test('does not repeat a url that is both next-in-entry and next-entry first', () => {
      const entries = [entry('a', [media('a0'), media('shared')]), entry('b', [media('shared')])];

      expect(selectPrefetchUrls(entries, 0, 0)).toEqual(['shared']);
   });

   test('returns nothing for a single entry with no further media', () => {
      expect(selectPrefetchUrls([entry('a', [media('a0')])], 0, 0)).toEqual([]);
   });

   test('handles an out-of-range entry index', () => {
      expect(selectPrefetchUrls([], 0, 0)).toEqual([]);
   });
});
