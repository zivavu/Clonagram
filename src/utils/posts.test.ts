import { describe, expect, test } from 'bun:test';
import {
   applyVisibleCommentCount,
   getPostThumbnail,
   hideLikesForNonOwners,
   nextCursorFrom,
   scopePostEngagementToUser,
} from './posts';

describe('getPostThumbnail', () => {
   test('returns the lowest-position media url', () => {
      const url = getPostThumbnail({
         images: [
            { position: 2, url: 'img-2' },
            { position: 0, url: 'img-0' },
         ],
         videos: [],
      });
      expect(url).toBe('img-0');
   });

   test('mixes videos in by position using the mux thumbnail', () => {
      const url = getPostThumbnail({
         images: [{ position: 1, url: 'img-1' }],
         videos: [{ position: 0, mux_playback_id: 'abc' }],
      });
      expect(url).toBe('https://image.mux.com/abc/thumbnail.jpg');
   });

   test('skips videos without a playback id', () => {
      const url = getPostThumbnail({
         images: [{ position: 1, url: 'img-1' }],
         videos: [{ position: 0, mux_playback_id: null }],
      });
      expect(url).toBe('img-1');
   });

   test('returns null when there is no media', () => {
      expect(getPostThumbnail({ images: [], videos: [] })).toBeNull();
   });
});

describe('hideLikesForNonOwners', () => {
   const post = {
      hide_likes: true,
      user_id: 'owner',
      like_count: 42,
   };

   test('zeroes like_count for a non-owner', () => {
      const [result] = hideLikesForNonOwners([post], 'someone-else');
      expect(result.like_count).toBe(0);
   });

   test('leaves like_count intact for the owner', () => {
      const [result] = hideLikesForNonOwners([post], 'owner');
      expect(result.like_count).toBe(42);
   });

   test('leaves like_count intact when hide_likes is false', () => {
      const [result] = hideLikesForNonOwners([{ ...post, hide_likes: false }], 'someone-else');
      expect(result.like_count).toBe(42);
   });

   test('resolves ownership through user.id', () => {
      const nested = { hide_likes: true, user: { id: 'owner' }, like_count: 7 };
      expect(hideLikesForNonOwners([nested], 'owner')[0].like_count).toBe(7);
      expect(hideLikesForNonOwners([nested], 'other')[0].like_count).toBe(0);
   });

   test('does not mutate the input post', () => {
      hideLikesForNonOwners([post], 'someone-else');
      expect(post.like_count).toBe(42);
   });
});

describe('nextCursorFrom', () => {
   test('returns last row created_at when page is full', () => {
      const rows = [{ created_at: 'a' }, { created_at: 'b' }];
      expect(nextCursorFrom(rows, 2)).toBe('b');
   });

   test('returns null when page is not full', () => {
      expect(nextCursorFrom([{ created_at: 'a' }], 2)).toBeNull();
   });

   test('returns null when the last created_at is null', () => {
      expect(nextCursorFrom([{ created_at: 'a' }, { created_at: null }], 2)).toBeNull();
   });
});

describe('applyVisibleCommentCount', () => {
   test('overrides comment_count with the visible count', () => {
      const [result] = applyVisibleCommentCount([
         { comment_count: 10, visible_comment_count: [{ count: 3 }] },
      ]);
      expect(result.comment_count).toBe(3);
   });

   test('leaves comment_count untouched when there is no visible count', () => {
      const [result] = applyVisibleCommentCount([
         { comment_count: 10, visible_comment_count: null },
      ]);
      expect(result.comment_count).toBe(10);
   });
});

describe('scopePostEngagementToUser', () => {
   test('chains eq filters, optionally prefixed', () => {
      const calls: [string, unknown][] = [];
      const query = {
         eq(column: string, value: unknown) {
            calls.push([column, value]);
            return this;
         },
      };

      scopePostEngagementToUser(query, 'user-1', 'post');

      expect(calls).toEqual([
         ['post.likes.user_id', 'user-1'],
         ['post.saves.user_id', 'user-1'],
         ['post.reposts.user_id', 'user-1'],
      ]);
   });

   test('omits the prefix when none is given', () => {
      const calls: string[] = [];
      const query = {
         eq(column: string) {
            calls.push(column);
            return this;
         },
      };

      scopePostEngagementToUser(query, 'user-1');

      expect(calls).toEqual(['likes.user_id', 'saves.user_id', 'reposts.user_id']);
   });
});
