import { describe, expect, test } from 'bun:test';
import type { ConversationSummary } from '@/src/queries/conversations';
import {
   getConversationAvatars,
   getConversationDisplayName,
   getMessagePreview,
   isGroupConversation,
   isUnread,
} from './conversations';

const ME = 'me';

const participant = (id: string, username: string, fullName: string | null = null) => ({
   user_id: id,
   role: 'member',
   user: { id, username, full_name: fullName, avatar_url: `${username}.jpg` },
});

const me = participant(ME, 'me_user', 'Me');
const alice = participant('alice', 'alice', 'Alice A');
const bob = participant('bob', 'bob', null);

describe('getConversationDisplayName', () => {
   test('uses an explicit title when present', () => {
      expect(getConversationDisplayName([me, alice], ME, 'Trip Squad')).toBe('Trip Squad');
   });

   test('joins other participants, preferring full_name', () => {
      expect(getConversationDisplayName([me, alice, bob], ME)).toBe('Alice A, bob');
   });

   test('excludes the auth user', () => {
      expect(getConversationDisplayName([me, alice], ME)).toBe('Alice A');
   });
});

describe('getConversationAvatars', () => {
   test('returns up to three other participants', () => {
      const many = [me, alice, bob, participant('c', 'carol'), participant('d', 'dave')];
      const avatars = getConversationAvatars(many, ME);
      expect(avatars).toHaveLength(3);
      expect(avatars.map(a => a.id)).toEqual(['alice', 'bob', 'c']);
   });
});

describe('isGroupConversation', () => {
   test('true for more than two participants', () => {
      expect(isGroupConversation([me, alice, bob])).toBe(true);
      expect(isGroupConversation([me, alice])).toBe(false);
   });
});

describe('getMessagePreview', () => {
   test('empty preview stays empty', () => {
      expect(getMessagePreview(null, 'alice', ME, [me, alice])).toBe('');
   });

   test('non-"sent" previews pass through verbatim', () => {
      expect(getMessagePreview('hello there', 'alice', ME, [me, alice])).toBe('hello there');
   });

   test('prefixes "You" when the auth user sent it', () => {
      expect(getMessagePreview('sent a photo', ME, ME, [me, alice])).toBe('You sent a photo');
   });

   test('prefixes the sender username', () => {
      expect(getMessagePreview('sent an image', 'alice', ME, [me, alice])).toBe(
         'alice sent an image',
      );
   });

   test('falls back to "Someone" for an unknown sender', () => {
      expect(getMessagePreview('sent a photo', 'ghost', ME, [me, alice])).toBe(
         'Someone sent a photo',
      );
   });
});

describe('isUnread', () => {
   const summary = (over: {
      last_message_at: string | null;
      last_message_sender_id: string | null;
      last_read_at: string | null;
   }) =>
      ({
         last_read_at: over.last_read_at,
         conversation: {
            last_message_at: over.last_message_at,
            last_message_sender_id: over.last_message_sender_id,
         },
      }) as unknown as ConversationSummary;

   test('false with no last message', () => {
      expect(
         isUnread(
            summary({ last_message_at: null, last_message_sender_id: 'alice', last_read_at: null }),
            ME,
         ),
      ).toBe(false);
   });

   test('false when the auth user sent the last message', () => {
      expect(
         isUnread(
            summary({
               last_message_at: '2026-01-02T00:00:00Z',
               last_message_sender_id: ME,
               last_read_at: null,
            }),
            ME,
         ),
      ).toBe(false);
   });

   test('true when never read', () => {
      expect(
         isUnread(
            summary({
               last_message_at: '2026-01-02T00:00:00Z',
               last_message_sender_id: 'alice',
               last_read_at: null,
            }),
            ME,
         ),
      ).toBe(true);
   });

   test('true when the last message is newer than last read', () => {
      expect(
         isUnread(
            summary({
               last_message_at: '2026-01-02T00:00:00Z',
               last_message_sender_id: 'alice',
               last_read_at: '2026-01-01T00:00:00Z',
            }),
            ME,
         ),
      ).toBe(true);
   });

   test('false when already read past the last message', () => {
      expect(
         isUnread(
            summary({
               last_message_at: '2026-01-01T00:00:00Z',
               last_message_sender_id: 'alice',
               last_read_at: '2026-01-02T00:00:00Z',
            }),
            ME,
         ),
      ).toBe(false);
   });
});
