import { describe, expect, test } from 'bun:test';
import {
   CreateCommentSchema,
   SendMessageSchema,
   UpdateProfileSchema,
   usernameSchema,
   validate,
} from './validation';

const UUID = '00000000-0000-4000-8000-000000000000';

describe('validate', () => {
   test('returns parsed data on success', () => {
      const result = validate(SendMessageSchema, { conversationId: UUID, content: 'hi' });
      expect(result).toEqual({ conversationId: UUID, content: 'hi' });
   });

   test('throws with a joined path/message on failure', () => {
      expect(() => validate(SendMessageSchema, { conversationId: 'nope', content: '' })).toThrow(
         /Invalid input:.*conversationId/,
      );
   });
});

describe('SendMessageSchema', () => {
   test('rejects empty content', () => {
      expect(SendMessageSchema.safeParse({ conversationId: UUID, content: '' }).success).toBe(
         false,
      );
   });

   test('rejects content over 2000 chars', () => {
      expect(
         SendMessageSchema.safeParse({ conversationId: UUID, content: 'a'.repeat(2001) }).success,
      ).toBe(false);
   });

   test('rejects a non-uuid conversation id', () => {
      expect(SendMessageSchema.safeParse({ conversationId: 'x', content: 'hi' }).success).toBe(
         false,
      );
   });
});

describe('CreateCommentSchema', () => {
   test('parentId is optional and nullable', () => {
      expect(CreateCommentSchema.safeParse({ postId: UUID, content: 'nice' }).success).toBe(true);
      expect(
         CreateCommentSchema.safeParse({ postId: UUID, content: 'nice', parentId: null }).success,
      ).toBe(true);
      expect(
         CreateCommentSchema.safeParse({ postId: UUID, content: 'nice', parentId: UUID }).success,
      ).toBe(true);
   });

   test('rejects an invalid parentId', () => {
      expect(
         CreateCommentSchema.safeParse({ postId: UUID, content: 'nice', parentId: 'x' }).success,
      ).toBe(false);
   });
});

describe('usernameSchema', () => {
   test('accepts letters, numbers, underscores, and dots', () => {
      expect(usernameSchema.safeParse('user.name_1').success).toBe(true);
   });

   test('rejects spaces and other symbols', () => {
      expect(usernameSchema.safeParse('bad name').success).toBe(false);
      expect(usernameSchema.safeParse('bad!').success).toBe(false);
   });

   test('enforces the length bounds', () => {
      expect(usernameSchema.safeParse('').success).toBe(false);
      expect(usernameSchema.safeParse('a'.repeat(31)).success).toBe(false);
      expect(usernameSchema.safeParse('a'.repeat(30)).success).toBe(true);
   });
});

describe('UpdateProfileSchema', () => {
   const base = {
      fullName: 'Jane Doe',
      username: 'jane_doe',
      bio: 'hi',
      website: null,
      gender: null,
   };

   test('accepts a valid profile', () => {
      expect(UpdateProfileSchema.safeParse(base).success).toBe(true);
   });

   test('requires a non-empty full name', () => {
      expect(UpdateProfileSchema.safeParse({ ...base, fullName: '' }).success).toBe(false);
   });

   test('rejects an invalid website url', () => {
      expect(UpdateProfileSchema.safeParse({ ...base, website: 'not-a-url' }).success).toBe(false);
   });

   test('rejects a bio over 150 chars', () => {
      expect(UpdateProfileSchema.safeParse({ ...base, bio: 'a'.repeat(151) }).success).toBe(false);
   });
});
