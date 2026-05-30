# Direct Messages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all mock DM data with real Supabase data, add real-time messaging, group chat management, per-participant folder assignment (Primary/General/Requests), and request accept/block/delete.

**Architecture:** Server components fetch initial data and pass it as `initialData` to client components. React Query manages client-side cache. Supabase Realtime channels subscribe per-conversation for live message delivery and per-user for sidebar updates. The DM folder (primary/general/requests) is stored as a column on `conversation_participants`, separate from `role` (member/admin).

**Tech Stack:** Next.js 16 (App Router), Supabase JS v2, @tanstack/react-query, StyleX, Zustand (existing store for NewMessageModal)

---

## File Map

**New files:**
- `supabase/migrations/20260530000001_dm_folders.sql`
- `src/queries/conversations.ts`
- `src/queries/messages.ts`
- `src/actions/dm/createConversation.ts`
- `src/actions/dm/sendMessage.ts`
- `src/actions/dm/markConversationRead.ts`
- `src/actions/dm/acceptRequest.ts`
- `src/actions/dm/deleteRequest.ts`
- `src/actions/dm/blockAndDeleteRequest.ts`
- `src/actions/dm/leaveConversation.ts`
- `src/actions/dm/deleteConversation.ts`
- `src/actions/dm/updateGroupName.ts`
- `src/actions/dm/addParticipants.ts`
- `src/actions/dm/removeParticipant.ts`
- `src/actions/dm/toggleMute.ts`
- `src/pageComponents/DirectMessages/components/ConversationList/index.tsx`
- `src/pageComponents/DirectMessages/components/ChatView/index.tsx`
- `src/pageComponents/DirectMessages/components/ChatView/MessageInput.tsx`
- `src/pageComponents/DirectMessages/components/ChatView/RequestActions.tsx`
- `src/pageComponents/DirectMessages/components/GroupDetailsPanel/index.tsx`
- `src/pageComponents/DirectMessages/components/GroupDetailsPanel/index.stylex.ts`
- `src/utils/conversations.ts`

**Modified files:**
- `src/types/database.ts` — add `folder`, `is_muted`, `last_message_at` to `conversation_participants`; add `last_message_preview`, `last_message_at`, `last_message_sender_id` to `conversations`
- `src/pageComponents/DirectMessages/index.tsx` — use real queries, mount ChatView + ConversationList
- `src/pageComponents/DirectMessages/components/RecipientsSidebar/index.tsx` — pass real data to ConversationList
- `src/pageComponents/DirectMessages/components/RecipientsSidebar/RequestsContent.tsx` — use real query
- `src/pageComponents/DirectMessages/components/RecipientsSidebar/ThreadItem.tsx` — update props to use ConversationSummary
- `src/pageComponents/DirectMessages/components/NewMessageModal/index.tsx` — real user search + createConversation

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/20260530000001_dm_folders.sql`

- [ ] **Step 1: Write migration**

```sql
-- Add folder + mute to conversation_participants
ALTER TABLE conversation_participants
  ADD COLUMN folder text NOT NULL DEFAULT 'primary',
  ADD COLUMN is_muted boolean NOT NULL DEFAULT false,
  ADD COLUMN last_message_at timestamptz DEFAULT now();

-- Index for fast sidebar ordering
CREATE INDEX conversation_participants_last_message_idx
  ON conversation_participants(user_id, last_message_at DESC);

ALTER TABLE conversation_participants
  ADD CONSTRAINT conversation_participants_folder_check
    CHECK (folder IN ('primary', 'general', 'requests'));

ALTER TABLE conversation_participants
  ADD CONSTRAINT conversation_participants_role_check
    CHECK (role IN ('member', 'admin'));

-- Denormalised last-message fields on conversations (avoids N+1 for thread list)
ALTER TABLE conversations
  ADD COLUMN last_message_preview text,
  ADD COLUMN last_message_at timestamptz,
  ADD COLUMN last_message_sender_id uuid REFERENCES profiles(id);

CREATE INDEX conversation_participants_folder_idx
  ON conversation_participants(user_id, folder);
```

> **Note:** `supabase/` is gitignored. Apply this migration manually via the Supabase dashboard SQL editor or `supabase db push` if you have the CLI set up.

- [ ] **Step 2: Update `src/types/database.ts`**

In the `conversation_participants` `Row` block, add:
```typescript
folder: string;
is_muted: boolean;
last_message_at: string | null;
```
In `Insert` and `Update`, add:
```typescript
folder?: string;
is_muted?: boolean;
last_message_at?: string | null;
```

In the `conversations` `Row` block, add:
```typescript
last_message_at: string | null;
last_message_preview: string | null;
last_message_sender_id: string | null;
```
In `Insert` and `Update`, add all three as optional (`?: string | null`).

---

## Task 2: Conversation Queries

**Files:**
- Create: `src/queries/conversations.ts`

- [ ] **Step 1: Write the query file**

```typescript
import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function getConversationsQuery(
   supabase: SupabaseClient<Database>,
   authUserId: string,
   folder: 'primary' | 'general' | 'requests',
) {
   return supabase
      .from('conversation_participants')
      .select(
         `conversation_id,
         folder,
         is_muted,
         last_read_at,
         role,
         conversation:conversations!conversation_id(
            id,
            title,
            updated_at,
            last_message_preview,
            last_message_at,
            last_message_sender_id,
            participants:conversation_participants(
               user_id,
               role,
               user:profiles!user_id(id, username, full_name, avatar_url)
            )
         )`,
      )
      .eq('user_id', authUserId)
      .eq('folder', folder)
      .order('last_message_at', { ascending: false });
}

export type ConversationSummaries = QueryData<ReturnType<typeof getConversationsQuery>>;
export type ConversationSummary = ConversationSummaries[number];

export function getConversationQuery(
   supabase: SupabaseClient<Database>,
   conversationId: string,
) {
   return supabase
      .from('conversations')
      .select(
         `id, title, updated_at, last_message_preview, last_message_at, last_message_sender_id,
         participants:conversation_participants(
            user_id,
            role,
            is_muted,
            folder,
            user:profiles!user_id(id, username, full_name, avatar_url)
         )`,
      )
      .eq('id', conversationId)
      .single();
}

export type ConversationDetail = QueryData<ReturnType<typeof getConversationQuery>>;
```

- [ ] **Step 2: Verify build passes**
```
bun run build
```

---

## Task 3: Message Queries

**Files:**
- Create: `src/queries/messages.ts`
- Create: `src/utils/conversations.ts`

- [ ] **Step 1: Write message query**

```typescript
// src/queries/messages.ts
import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function getMessagesQuery(
   supabase: SupabaseClient<Database>,
   conversationId: string,
) {
   return supabase
      .from('messages')
      .select(
         `id, content, created_at, sender_id, is_deleted, reply_to_id,
         sender:profiles!sender_id(id, username, full_name, avatar_url)`,
      )
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });
}

export type ConversationMessages = QueryData<ReturnType<typeof getMessagesQuery>>;
export type ConversationMessage = ConversationMessages[number];
```

- [ ] **Step 2: Write conversation display utilities**

```typescript
// src/utils/conversations.ts
import type { ConversationSummary } from '@/src/queries/conversations';
import type { ConversationDetail } from '@/src/queries/conversations';

type Participant = {
   user_id: string;
   role: string;
   user: { id: string; username: string; full_name: string | null; avatar_url: string | null };
};

export function getConversationDisplayName(
   participants: Participant[],
   authUserId: string,
   title?: string | null,
): string {
   if (title) return title;
   const others = participants.filter(p => p.user_id !== authUserId);
   return others.map(p => p.user.full_name || p.user.username).join(', ');
}

export function getConversationAvatars(
   participants: Participant[],
   authUserId: string,
): Array<{ id: string; avatar_url: string | null; username: string }> {
   return participants
      .filter(p => p.user_id !== authUserId)
      .slice(0, 3)
      .map(p => ({ id: p.user.id, avatar_url: p.user.avatar_url, username: p.user.username }));
}

export function isGroupConversation(participants: Participant[]): boolean {
   return participants.length > 2;
}

export function isUnread(
   summary: ConversationSummary,
   authUserId: string,
): boolean {
   if (!summary.conversation.last_message_at) return false;
   if (summary.conversation.last_message_sender_id === authUserId) return false;
   if (!summary.last_read_at) return true;
   return new Date(summary.conversation.last_message_at) > new Date(summary.last_read_at);
}
```

- [ ] **Step 3: Verify build passes**
```
bun run build
```

---

## Task 4: Server Actions — Send Message & Mark Read

**Files:**
- Create: `src/actions/dm/sendMessage.ts`
- Create: `src/actions/dm/markConversationRead.ts`

- [ ] **Step 1: Write sendMessage**

```typescript
// src/actions/dm/sendMessage.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function sendMessage(conversationId: string, content: string): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const trimmed = content.trim();
   if (!trimmed) return;

   const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: authProfile.id,
      content: trimmed,
   });
   if (msgError) throw msgError;

   const now = new Date().toISOString();

   // Update denormalised last-message fields used for thread list ordering + preview
   const [{ error: convError }, { error: partError }] = await Promise.all([
      supabase
         .from('conversations')
         .update({
            last_message_preview: trimmed.slice(0, 100),
            last_message_at: now,
            last_message_sender_id: authProfile.id,
            updated_at: now,
         })
         .eq('id', conversationId),
      supabase
         .from('conversation_participants')
         .update({ last_message_at: now })
         .eq('conversation_id', conversationId),
   ]);
   if (convError) throw convError;
   if (partError) throw partError;
}
```

- [ ] **Step 2: Write markConversationRead**

```typescript
// src/actions/dm/markConversationRead.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function markConversationRead(conversationId: string): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id);
}
```

- [ ] **Step 3: Verify build**
```
bun run build
```

---

## Task 5: Server Action — Create Conversation

**Files:**
- Create: `src/actions/dm/createConversation.ts`

- [ ] **Step 1: Write createConversation**

When creating a conversation, each invitee gets `folder = 'primary'` if they follow the creator, `folder = 'requests'` otherwise. The creator always gets `folder = 'primary'` and `role = 'admin'`.

```typescript
// src/actions/dm/createConversation.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function createConversation(participantIds: string[]): Promise<string> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const allIds = [...new Set([authProfile.id, ...participantIds])];

   // For 1:1, check if conversation already exists between these two users
   if (allIds.length === 2) {
      const otherId = participantIds[0];
      const { data: existing } = await supabase
         .from('conversation_participants')
         .select('conversation_id')
         .eq('user_id', authProfile.id)
         .in(
            'conversation_id',
            (
               await supabase
                  .from('conversation_participants')
                  .select('conversation_id')
                  .eq('user_id', otherId)
            ).data?.map(r => r.conversation_id) ?? [],
         )
         .limit(1)
         .maybeSingle();
      if (existing) return existing.conversation_id;
   }

   const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({ title: null })
      .select('id')
      .single();
   if (convError || !conv) throw convError ?? new Error('Failed to create conversation');

   // Check which invitees follow the creator
   const { data: followers } = await supabase
      .from('follows')
      .select('follower_id')
      .in('follower_id', participantIds)
      .eq('following_id', authProfile.id);
   const followerSet = new Set((followers ?? []).map(r => r.follower_id));

   const participants = [
      { conversation_id: conv.id, user_id: authProfile.id, role: 'admin', folder: 'primary' },
      ...participantIds.map(uid => ({
         conversation_id: conv.id,
         user_id: uid,
         role: 'member',
         folder: followerSet.has(uid) ? 'primary' : 'requests',
      })),
   ];

   const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participants);
   if (partError) throw partError;

   return conv.id;
}
```

- [ ] **Step 2: Verify build**
```
bun run build
```

---

## Task 6: Server Actions — Request Management

**Files:**
- Create: `src/actions/dm/acceptRequest.ts`
- Create: `src/actions/dm/deleteRequest.ts`
- Create: `src/actions/dm/blockAndDeleteRequest.ts`

- [ ] **Step 1: Write acceptRequest**

```typescript
// src/actions/dm/acceptRequest.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function acceptRequest(conversationId: string): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('conversation_participants')
      .update({ folder: 'primary' })
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id);
   if (error) throw error;
}
```

- [ ] **Step 2: Write deleteRequest**

```typescript
// src/actions/dm/deleteRequest.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function deleteRequest(conversationId: string): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id);
   if (error) throw error;
}
```

- [ ] **Step 3: Write blockAndDeleteRequest**

```typescript
// src/actions/dm/blockAndDeleteRequest.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function blockAndDeleteRequest(
   conversationId: string,
   senderUserId: string,
): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   await Promise.all([
      supabase
         .from('blocks')
         .insert({ blocker_id: authProfile.id, blocked_id: senderUserId })
         .then(({ error }) => { if (error) throw error; }),
      supabase
         .from('conversation_participants')
         .delete()
         .eq('conversation_id', conversationId)
         .eq('user_id', authProfile.id)
         .then(({ error }) => { if (error) throw error; }),
   ]);
}
```

- [ ] **Step 4: Verify build**
```
bun run build
```

---

## Task 7: Server Actions — Group Management

**Files:**
- Create: `src/actions/dm/leaveConversation.ts`
- Create: `src/actions/dm/deleteConversation.ts`
- Create: `src/actions/dm/updateGroupName.ts`
- Create: `src/actions/dm/addParticipants.ts`
- Create: `src/actions/dm/removeParticipant.ts`
- Create: `src/actions/dm/toggleMute.ts`

- [ ] **Step 1: Write leaveConversation and deleteConversation**

```typescript
// src/actions/dm/leaveConversation.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function leaveConversation(conversationId: string): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');
   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id);
   if (error) throw error;
}
```

```typescript
// src/actions/dm/deleteConversation.ts — same as leaveConversation (removes self)
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function deleteConversation(conversationId: string): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');
   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id);
   if (error) throw error;
}
```

- [ ] **Step 2: Write updateGroupName**

```typescript
// src/actions/dm/updateGroupName.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function updateGroupName(conversationId: string, title: string): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const { data: participant } = await supabase
      .from('conversation_participants')
      .select('role')
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id)
      .single();
   if (participant?.role !== 'admin') throw new Error('Only admins can rename the group');

   const { error } = await supabase
      .from('conversations')
      .update({ title: title.trim() || null })
      .eq('id', conversationId);
   if (error) throw error;
}
```

- [ ] **Step 3: Write addParticipants and removeParticipant**

```typescript
// src/actions/dm/addParticipants.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function addParticipants(
   conversationId: string,
   userIds: string[],
): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const rows = userIds.map(uid => ({
      conversation_id: conversationId,
      user_id: uid,
      role: 'member',
      folder: 'primary',
   }));
   const { error } = await supabase.from('conversation_participants').upsert(rows, {
      onConflict: 'conversation_id,user_id',
      ignoreDuplicates: true,
   });
   if (error) throw error;
}
```

```typescript
// src/actions/dm/removeParticipant.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function removeParticipant(
   conversationId: string,
   userId: string,
): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const { data: self } = await supabase
      .from('conversation_participants')
      .select('role')
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id)
      .single();
   if (self?.role !== 'admin') throw new Error('Only admins can remove members');

   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
   if (error) throw error;
}
```

- [ ] **Step 4: Write toggleMute**

```typescript
// src/actions/dm/toggleMute.ts
'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function toggleMute(conversationId: string, muted: boolean): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');
   const { error } = await supabase
      .from('conversation_participants')
      .update({ is_muted: muted })
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id);
   if (error) throw error;
}
```

- [ ] **Step 5: Verify build**
```
bun run build
```

- [ ] **Step 6: Commit**
```
git add src/actions/dm/ src/queries/conversations.ts src/queries/messages.ts src/utils/conversations.ts src/types/database.ts
git commit -m "Add DM queries and server actions"
```

---

## Task 8: ConversationList Client Component

Replaces the mock thread list in `RecipientsSidebar`. Subscribes to `messages` INSERT events to keep thread previews live.

**Files:**
- Create: `src/pageComponents/DirectMessages/components/ConversationList/index.tsx`

- [ ] **Step 1: Write ConversationList**

```typescript
'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { getConversationsQuery, type ConversationSummaries } from '@/src/queries/conversations';
import { isUnread, getConversationDisplayName, getConversationAvatars } from '@/src/utils/conversations';
import { formatTimestamp } from '@/src/utils/formatters';
import UserAvatar from '@/src/components/UserAvatar';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { styles } from '../RecipientsSidebar/index.stylex';

interface ConversationListProps {
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   currentFolderHref: string;
   initialData: ConversationSummaries;
}

export default function ConversationList({
   authUserId,
   folder,
   currentFolderHref,
   initialData,
}: ConversationListProps) {
   const queryClient = useQueryClient();
   const queryKey = ['conversations', folder, authUserId];

   const { data: conversations = initialData } = useQuery({
      queryKey,
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await getConversationsQuery(supabase, authUserId, folder);
         if (error) throw error;
         return data ?? [];
      },
      initialData,
      staleTime: 30_000,
   });

   useEffect(() => {
      const supabase = createBrowserClient();
      const channel = supabase
         .channel(`conversations-list-${authUserId}-${folder}`)
         .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'messages' },
            () => {
               queryClient.invalidateQueries({ queryKey });
            },
         )
         .subscribe();
      return () => { supabase.removeChannel(channel); };
   }, [authUserId, folder, queryClient, queryKey]);

   return (
      <div {...stylex.props(styles.messagesList)}>
         {conversations.length === 0 && (
            <span style={{ padding: '16px 32px', fontSize: '0.875rem' }}>
               No conversations yet
            </span>
         )}
         {conversations.map(summary => {
            const conv = summary.conversation;
            const displayName = getConversationDisplayName(conv.participants, authUserId, conv.title);
            const avatars = getConversationAvatars(conv.participants, authUserId);
            const unread = isUnread(summary, authUserId);
            const href = `${currentFolderHref}/${conv.id}`;

            return (
               <Link key={conv.id} href={href} {...stylex.props(styles.threadItem)}>
                  <UserAvatar
                     src={avatars[0]?.avatar_url ?? null}
                     alt={displayName}
                     size={56}
                     userId={avatars[0]?.id}
                  />
                  <div {...stylex.props(styles.threadContent)}>
                     <span {...stylex.props(styles.threadName, unread && styles.threadNameUnread)}>
                        {displayName}
                     </span>
                     <div {...stylex.props(styles.threadPreviewRow)}>
                        <span
                           {...stylex.props(
                              styles.threadPreview,
                              unread && styles.threadPreviewUnread,
                           )}
                        >
                           {conv.last_message_preview ?? 'No messages yet'}
                        </span>
                        {conv.last_message_at && (
                           <span {...stylex.props(styles.threadTimestamp)}>
                              {' · '}
                              {formatTimestamp(conv.last_message_at)}
                           </span>
                        )}
                     </div>
                  </div>
                  {unread && <div {...stylex.props(styles.unreadDot)} />}
               </Link>
            );
         })}
      </div>
   );
}
```

- [ ] **Step 2: Verify build**
```
bun run build
```

---

## Task 9: ChatView — Messages + Input + Real-Time

**Files:**
- Create: `src/pageComponents/DirectMessages/components/ChatView/index.tsx`
- Create: `src/pageComponents/DirectMessages/components/ChatView/MessageInput.tsx`

- [ ] **Step 1: Write MessageInput**

```typescript
// MessageInput.tsx
'use client';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AiOutlineSmile } from 'react-icons/ai';
import { IoMicOutline } from 'react-icons/io5';
import { LuSticker } from 'react-icons/lu';
import { TbPhoto } from 'react-icons/tb';
import { sendMessage } from '@/src/actions/dm/sendMessage';
import { styles } from '../../index.stylex';

interface MessageInputProps {
   conversationId: string;
   onSent: () => void;
}

export default function MessageInput({ conversationId, onSent }: MessageInputProps) {
   const [text, setText] = useState('');
   const [sending, setSending] = useState(false);

   async function handleSend() {
      if (!text.trim() || sending) return;
      setSending(true);
      try {
         await sendMessage(conversationId, text);
         setText('');
         onSent();
      } finally {
         setSending(false);
      }
   }

   return (
      <div {...stylex.props(styles.inputContainer)}>
         <div {...stylex.props(styles.inputWrapper)}>
            <AiOutlineSmile {...stylex.props(styles.inputIcon)} />
            <input
               {...stylex.props(styles.inputField)}
               type="text"
               placeholder="Message..."
               value={text}
               onChange={e => setText(e.target.value)}
               onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSend();
                  }
               }}
               disabled={sending}
            />
            <IoMicOutline {...stylex.props(styles.inputIcon)} />
            <TbPhoto {...stylex.props(styles.inputIcon)} />
            <LuSticker {...stylex.props(styles.inputIcon)} />
         </div>
      </div>
   );
}
```

- [ ] **Step 2: Write ChatView**

```typescript
// ChatView/index.tsx
'use client';
import * as stylex from '@stylexjs/stylex';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { HiOutlineVideoCamera } from 'react-icons/hi2';
import { IoCallOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { markConversationRead } from '@/src/actions/dm/markConversationRead';
import { getConversationQuery, type ConversationDetail } from '@/src/queries/conversations';
import { getMessagesQuery, type ConversationMessages } from '@/src/queries/messages';
import {
   getConversationDisplayName,
   getConversationAvatars,
   isGroupConversation,
} from '@/src/utils/conversations';
import { formatGroupSeparator } from '@/src/utils/formatters';
import UserAvatar from '@/src/components/UserAvatar';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import Link from 'next/link';
import { styles } from '../../index.stylex';
import MessageInput from './MessageInput';
import RequestActions from './RequestActions';

interface ChatViewProps {
   conversationId: string;
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   initialMessages: ConversationMessages;
   initialConversation: ConversationDetail;
   onInfoClick: () => void;
}

export default function ChatView({
   conversationId,
   authUserId,
   folder,
   initialMessages,
   initialConversation,
   onInfoClick,
}: ChatViewProps) {
   const queryClient = useQueryClient();
   const messagesEndRef = useRef<HTMLDivElement>(null);
   const messagesKey = ['messages', conversationId];

   const { data: messages = initialMessages } = useQuery({
      queryKey: messagesKey,
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await getMessagesQuery(supabase, conversationId);
         if (error) throw error;
         return data ?? [];
      },
      initialData: initialMessages,
      staleTime: 0,
   });

   const { data: conversation = initialConversation } = useQuery({
      queryKey: ['conversation', conversationId],
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await getConversationQuery(supabase, conversationId);
         if (error) throw error;
         return data;
      },
      initialData: initialConversation,
      staleTime: 30_000,
   });

   // Realtime subscription
   useEffect(() => {
      const supabase = createBrowserClient();
      const channel = supabase
         .channel(`messages-${conversationId}`)
         .on(
            'postgres_changes',
            {
               event: 'INSERT',
               schema: 'public',
               table: 'messages',
               filter: `conversation_id=eq.${conversationId}`,
            },
            () => {
               queryClient.invalidateQueries({ queryKey: messagesKey });
               markConversationRead(conversationId);
            },
         )
         .subscribe();
      return () => { supabase.removeChannel(channel); };
   }, [conversationId, queryClient]);

   // Mark read on mount and scroll to bottom
   useEffect(() => {
      markConversationRead(conversationId);
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
   }, [conversationId]);

   // Scroll to bottom on new messages
   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages.length]);

   const participants = conversation?.participants ?? [];
   const displayName = getConversationDisplayName(participants, authUserId, conversation?.title);
   const avatars = getConversationAvatars(participants, authUserId);
   const isGroup = isGroupConversation(participants);
   const isRequest = folder === 'requests';
   const otherParticipant = participants.find(p => p.user_id !== authUserId)?.user;

   const MS_PER_DAY = 86_400_000;

   return (
      <>
         <div {...stylex.props(styles.chatTopBar)}>
            <div {...stylex.props(styles.chatTopBarRecipient)}>
               <UserAvatar
                  src={avatars[0]?.avatar_url ?? null}
                  alt={displayName}
                  size={44}
                  userId={avatars[0]?.id}
               />
               <div>
                  <div {...stylex.props(styles.chatTopBarRecipientName)}>{displayName}</div>
                  {!isGroup && otherParticipant && (
                     <OtherUserUsername
                        style={styles.chatTopBarRecipientUsername}
                        userProfile={otherParticipant}
                     />
                  )}
               </div>
            </div>
            <div {...stylex.props(styles.chatTopBarActions)}>
               <IoCallOutline {...stylex.props(styles.chatTopBarActionIcon)} />
               <HiOutlineVideoCamera {...stylex.props(styles.chatTopBarActionIcon)} />
               <IoInformationCircleOutline
                  {...stylex.props(styles.chatTopBarActionIcon)}
                  onClick={onInfoClick}
               />
            </div>
         </div>

         <div {...stylex.props(styles.messagesContainer)}>
            {!isGroup && otherParticipant && (
               <div {...stylex.props(styles.chatProfileHeader)}>
                  <UserAvatar
                     src={otherParticipant.avatar_url}
                     alt={otherParticipant.username}
                     size={96}
                     userId={otherParticipant.id}
                  />
                  <OtherUserUsername
                     style={styles.chatProfileUsername}
                     userProfile={otherParticipant}
                  />
                  <div {...stylex.props(styles.chatProfileSubtitle)}>Clonagram</div>
                  <Link
                     href={`/profile/${otherParticipant.username}`}
                     {...stylex.props(styles.chatProfileButton)}
                  >
                     View profile
                  </Link>
               </div>
            )}

            {messages.map((msg, idx) => {
               const isSent = msg.sender_id === authUserId;
               const prevMsg = idx > 0 ? messages[idx - 1] : null;
               const nextMsg = idx < messages.length - 1 ? messages[idx + 1] : null;
               const isLastInGroup = !nextMsg || nextMsg.sender_id !== msg.sender_id;
               const gapToPrev = prevMsg
                  ? new Date(msg.created_at ?? '').getTime() -
                    new Date(prevMsg.created_at ?? '').getTime()
                  : Infinity;
               const showSeparator = gapToPrev > MS_PER_DAY;

               return (
                  <div key={msg.id} style={{ display: 'contents' }}>
                     {showSeparator && msg.created_at && (
                        <div {...stylex.props(styles.dateSeparator)}>
                           <span {...stylex.props(styles.dateSeparatorText)}>
                              {formatGroupSeparator(msg.created_at)}
                           </span>
                        </div>
                     )}
                     <div
                        {...stylex.props(
                           styles.messageRow,
                           isSent ? styles.messageRowSent : styles.messageRowReceived,
                        )}
                     >
                        {!isSent && (
                           <div {...stylex.props(styles.messageAvatarSlot)}>
                              {isLastInGroup && (
                                 <UserAvatar
                                    src={msg.sender.avatar_url}
                                    alt={msg.sender.username}
                                    size={28}
                                    userId={msg.sender.id}
                                 />
                              )}
                           </div>
                        )}
                        <div
                           {...stylex.props(
                              styles.messageBubble,
                              isSent ? styles.messageBubbleSent : styles.messageBubbleReceived,
                           )}
                        >
                           {msg.content}
                        </div>
                     </div>
                  </div>
               );
            })}
            <div ref={messagesEndRef} />
         </div>

         {isRequest ? (
            <RequestActions
               conversationId={conversationId}
               senderUserId={participants.find(p => p.user_id !== authUserId)?.user_id ?? ''}
               senderProfile={otherParticipant ?? null}
            />
         ) : (
            <MessageInput
               conversationId={conversationId}
               onSent={() =>
                  queryClient.invalidateQueries({ queryKey: messagesKey })
               }
            />
         )}
      </>
   );
}
```

- [ ] **Step 3: Verify build**
```
bun run build
```

---

## Task 10: RequestActions Component

**Files:**
- Create: `src/pageComponents/DirectMessages/components/ChatView/RequestActions.tsx`

- [ ] **Step 1: Write RequestActions**

```typescript
'use client';
import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Separator } from '@radix-ui/react-separator';
import { acceptRequest } from '@/src/actions/dm/acceptRequest';
import { deleteRequest } from '@/src/actions/dm/deleteRequest';
import { blockAndDeleteRequest } from '@/src/actions/dm/blockAndDeleteRequest';
import OtherUserUsername from '@/src/components/Username/OtherUserUsername';
import { toast } from '@/src/components/AppToast';
import { styles } from '../../index.stylex';

interface RequestActionsProps {
   conversationId: string;
   senderUserId: string;
   senderProfile: {
      id: string;
      username: string;
      full_name: string | null;
      avatar_url: string | null;
   } | null;
}

export default function RequestActions({
   conversationId,
   senderUserId,
   senderProfile,
}: RequestActionsProps) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   async function run(action: () => Promise<void>, redirect = false) {
      setLoading(true);
      try {
         await action();
         if (redirect) router.push('/direct/requests');
         else router.push('/direct');
      } catch (e) {
         toast(e instanceof Error ? e.message : 'Something went wrong.');
      } finally {
         setLoading(false);
      }
   }

   return (
      <div {...stylex.props(styles.requestActionsContainer)}>
         {senderProfile && (
            <div {...stylex.props(styles.requestInfoSection)}>
               <div {...stylex.props(styles.requestInfoTitle)}>
                  Accept message request from{' '}
                  <OtherUserUsername
                     style={styles.requestInfoUsername}
                     userProfile={senderProfile}
                  />
                  ?
               </div>
               <div {...stylex.props(styles.requestInfoSubtitle)}>
                  If you accept, they will also be able to call you and see info such as your
                  activity status and when you&apos;ve read messages.
               </div>
            </div>
         )}
         <div {...stylex.props(styles.requestButtonsRow)}>
            <button
               {...stylex.props(styles.requestButton)}
               type="button"
               disabled={loading}
               onClick={() =>
                  run(() => blockAndDeleteRequest(conversationId, senderUserId), true)
               }
            >
               Block
            </button>
            <Separator {...stylex.props(styles.requestButtonDivider)} />
            <button
               {...stylex.props(styles.requestButton, styles.requestButtonDanger)}
               type="button"
               disabled={loading}
               onClick={() => run(() => deleteRequest(conversationId), true)}
            >
               Delete
            </button>
            <Separator {...stylex.props(styles.requestButtonDivider)} />
            <button
               {...stylex.props(styles.requestButton)}
               type="button"
               disabled={loading}
               onClick={() => run(() => acceptRequest(conversationId))}
            >
               Accept
            </button>
         </div>
      </div>
   );
}
```

- [ ] **Step 2: Verify build**
```
bun run build
```

---

## Task 11: GroupDetailsPanel

**Files:**
- Create: `src/pageComponents/DirectMessages/components/GroupDetailsPanel/index.stylex.ts`
- Create: `src/pageComponents/DirectMessages/components/GroupDetailsPanel/index.tsx`

- [ ] **Step 1: Write styles**

```typescript
// index.stylex.ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '340px',
      height: '100dvh',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: colors.separator,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      flexShrink: 0,
   },
   header: {
      padding: '20px 24px 12px',
      fontSize: '1.1rem',
      fontWeight: 700,
      color: colors.textPrimary,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.separator,
   },
   row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      gap: 12,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.separator,
   },
   rowLabel: {
      fontSize: '0.9rem',
      color: colors.textPrimary,
   },
   changeInput: {
      flex: 1,
      borderWidth: 0,
      borderRadius: radius.sm,
      backgroundColor: colors.bgSecondary,
      fontSize: '0.875rem',
      padding: '6px 10px',
      color: colors.textPrimary,
      outline: 'none',
   },
   changeButton: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.sm,
      padding: '6px 14px',
   },
   sectionTitle: {
      padding: '12px 24px 6px',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   memberRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 24px',
      ':hover': {
         backgroundColor: colors.threadHover,
      },
   },
   memberInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
   },
   memberName: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   memberMeta: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
   },
   addPeopleButton: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.accent,
      padding: '4px 24px 12px',
      textAlign: 'left',
   },
   dangerButton: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.danger,
      padding: '12px 24px',
      textAlign: 'left',
      width: '100%',
   },
   toggle: {
      width: 44,
      height: 24,
      borderRadius: radius.full,
      position: 'relative',
      transition: 'background 0.2s',
   },
   toggleOn: {
      backgroundColor: colors.accent,
   },
   toggleOff: {
      backgroundColor: colors.textMuted,
   },
   toggleThumb: {
      position: 'absolute',
      top: 3,
      width: 18,
      height: 18,
      borderRadius: radius.full,
      backgroundColor: colors.white,
      transition: 'left 0.2s',
   },
   toggleThumbOn: {
      left: 23,
   },
   toggleThumbOff: {
      left: 3,
   },
});
```

- [ ] **Step 2: Write GroupDetailsPanel**

```typescript
// index.tsx
'use client';
import * as stylex from '@stylexjs/stylex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateGroupName } from '@/src/actions/dm/updateGroupName';
import { addParticipants } from '@/src/actions/dm/addParticipants';
import { removeParticipant } from '@/src/actions/dm/removeParticipant';
import { toggleMute } from '@/src/actions/dm/toggleMute';
import { leaveConversation } from '@/src/actions/dm/leaveConversation';
import { deleteConversation } from '@/src/actions/dm/deleteConversation';
import { getConversationQuery, type ConversationDetail } from '@/src/queries/conversations';
import { createBrowserClient } from '@/src/lib/supabase/client';
import UserAvatar from '@/src/components/UserAvatar';
import UserAutocomplete from '@/src/components/UserAutocomplete';
import { toast } from '@/src/components/AppToast';
import type { PartialUser } from '@/src/types/global';
import { styles } from './index.stylex';

interface GroupDetailsPanelProps {
   conversationId: string;
   authUserId: string;
   initialConversation: ConversationDetail;
}

export default function GroupDetailsPanel({
   conversationId,
   authUserId,
   initialConversation,
}: GroupDetailsPanelProps) {
   const router = useRouter();
   const queryClient = useQueryClient();
   const convKey = ['conversation', conversationId];

   const { data: conversation = initialConversation } = useQuery({
      queryKey: convKey,
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await getConversationQuery(supabase, conversationId);
         if (error) throw error;
         return data;
      },
      initialData: initialConversation,
      staleTime: 30_000,
   });

   const participants = conversation?.participants ?? [];
   const selfParticipant = participants.find(p => p.user_id === authUserId);
   const isAdmin = selfParticipant?.role === 'admin';
   const isMuted = selfParticipant?.is_muted ?? false;

   const [groupName, setGroupName] = useState(conversation?.title ?? '');
   const [showAddPeople, setShowAddPeople] = useState(false);
   const [pendingAdd, setPendingAdd] = useState<PartialUser[]>([]);

   const { mutate: saveName } = useMutation({
      mutationFn: () => updateGroupName(conversationId, groupName),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: convKey }),
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: muteMutation } = useMutation({
      mutationFn: (muted: boolean) => toggleMute(conversationId, muted),
      onMutate: async (muted) => {
         await queryClient.cancelQueries({ queryKey: convKey });
         const prev = queryClient.getQueryData(convKey);
         // Optimistic update: flip is_muted for self in participants
         queryClient.setQueryData(convKey, (old: ConversationDetail) => {
            if (!old) return old;
            return {
               ...old,
               participants: old.participants.map(p =>
                  p.user_id === authUserId ? { ...p, is_muted: muted } : p,
               ),
            };
         });
         return { prev };
      },
      onError: (_e, _v, ctx) => queryClient.setQueryData(convKey, ctx?.prev),
      onSettled: () => queryClient.invalidateQueries({ queryKey: convKey }),
   });

   const { mutate: removeMember } = useMutation({
      mutationFn: (userId: string) => removeParticipant(conversationId, userId),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: convKey }),
      onError: (e: Error) => toast(e.message),
   });

   const { mutate: addMembers } = useMutation({
      mutationFn: (users: PartialUser[]) =>
         addParticipants(conversationId, users.map(u => u.id)),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: convKey });
         setShowAddPeople(false);
      },
      onError: (e: Error) => toast(e.message),
   });

   async function handleLeave() {
      await leaveConversation(conversationId);
      router.push('/direct');
   }

   async function handleDelete() {
      await deleteConversation(conversationId);
      router.push('/direct');
   }

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>Details</div>

         {isAdmin && (
            <div {...stylex.props(styles.row)}>
               <span {...stylex.props(styles.rowLabel)}>Change group name</span>
               <input
                  {...stylex.props(styles.changeInput)}
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveName()}
               />
               <button
                  type="button"
                  {...stylex.props(styles.changeButton)}
                  onClick={() => saveName()}
               >
                  Change
               </button>
            </div>
         )}

         <div {...stylex.props(styles.row)}>
            <span {...stylex.props(styles.rowLabel)}>Mute messages</span>
            <button
               type="button"
               {...stylex.props(styles.toggle, isMuted ? styles.toggleOn : styles.toggleOff)}
               onClick={() => muteMutation(!isMuted)}
               aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
               <span
                  {...stylex.props(
                     styles.toggleThumb,
                     isMuted ? styles.toggleThumbOn : styles.toggleThumbOff,
                  )}
               />
            </button>
         </div>

         <div {...stylex.props(styles.sectionTitle)}>
            Members
            {isAdmin && (
               <button
                  type="button"
                  {...stylex.props(styles.addPeopleButton)}
                  onClick={() => setShowAddPeople(true)}
               >
                  Add people
               </button>
            )}
         </div>

         {showAddPeople && (
            <UserAutocomplete
               multiSelect
               selected={pendingAdd}
               onSelect={(user: PartialUser) => {
                  setPendingAdd(prev =>
                     prev.some(u => u.id === user.id)
                        ? prev.filter(u => u.id !== user.id)
                        : [...prev, user],
                  );
               }}
               onDone={() => {
                  addMembers(pendingAdd);
                  setPendingAdd([]);
               }}
               onDismiss={() => {
                  setShowAddPeople(false);
                  setPendingAdd([]);
               }}
               placeholder="Search..."
               autoFocus
            />
         )}

         {participants.map(p => (
            <div key={p.user_id} {...stylex.props(styles.memberRow)}>
               <UserAvatar
                  src={p.user.avatar_url}
                  alt={p.user.username}
                  size={44}
                  userId={p.user.id}
               />
               <div {...stylex.props(styles.memberInfo)}>
                  <span {...stylex.props(styles.memberName)}>
                     {p.user.full_name || p.user.username}
                  </span>
                  <span {...stylex.props(styles.memberMeta)}>
                     {p.role === 'admin' ? 'Admin · ' : ''}
                     {p.user.username}
                  </span>
               </div>
               {isAdmin && p.user_id !== authUserId && (
                  <button
                     type="button"
                     onClick={() => removeMember(p.user_id)}
                     style={{ fontSize: '0.75rem', color: '#888' }}
                  >
                     ···
                  </button>
               )}
            </div>
         ))}

         <button
            type="button"
            {...stylex.props(styles.dangerButton)}
            onClick={handleLeave}
         >
            Leave chat
         </button>
         <button
            type="button"
            {...stylex.props(styles.dangerButton)}
            onClick={handleDelete}
         >
            Delete chat
         </button>
      </div>
   );
}
```

- [ ] **Step 3: Verify build**
```
bun run build
```

---

## Task 12: Wire Up DirectMessagesPage

Replace mock data usage and mount real client components.

**Files:**
- Modify: `src/pageComponents/DirectMessages/index.tsx`

- [ ] **Step 1: Rewrite DirectMessagesPage**

```typescript
import { Separator } from '@radix-ui/react-separator';
import * as stylex from '@stylexjs/stylex';
import { VscSend } from 'react-icons/vsc';
import { RiUserReceived2Line } from 'react-icons/ri';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { getConversationsQuery } from '@/src/queries/conversations';
import { getConversationQuery } from '@/src/queries/conversations';
import { getMessagesQuery } from '@/src/queries/messages';
import NewMessageModal from './components/NewMessageModal';
import NewMessageTrigger from './components/NewMessageModal/NewMessageTrigger';
import RecipientsSidebar from './components/RecipientsSidebar/index';
import ChatView from './components/ChatView';
import GroupDetailsPanel from './components/GroupDetailsPanel';
import { styles } from './index.stylex';

interface DirectMessagesPageProps {
   chatId?: string;
   isRequestsPage?: boolean;
   currentFolderHref?: string;
}

export default async function DirectMessagesPage({
   chatId,
   isRequestsPage = false,
   currentFolderHref = '/direct',
}: DirectMessagesPageProps) {
   const profile = await getAuthProfile();
   const authUserId = profile?.id ?? '';
   const supabase = await createServerClient();

   const folder = isRequestsPage ? 'requests' : currentFolderHref === '/direct/general' ? 'general' : 'primary';

   const [{ data: conversations }, chatData] = await Promise.all([
      getConversationsQuery(supabase, authUserId, folder),
      chatId
         ? Promise.all([
              getConversationQuery(supabase, chatId),
              getMessagesQuery(supabase, chatId).then(r => r.data ?? []),
           ])
         : Promise.resolve(null),
   ]);

   const initialConversation = chatData?.[0]?.data ?? null;
   const initialMessages = chatData?.[1] ?? [];
   const isChatSelected = !!chatId && !!initialConversation;
   const isGroup = isChatSelected && (initialConversation?.participants?.length ?? 0) > 2;

   return (
      <div {...stylex.props(styles.root)}>
         <RecipientsSidebar
            authUserId={authUserId}
            currentFolderHref={currentFolderHref}
            isRequestsPage={isRequestsPage}
            initialConversations={conversations ?? []}
            folder={folder}
         />
         <div {...stylex.props(styles.chatContainer)}>
            {!isChatSelected && !isRequestsPage && (
               <div {...stylex.props(styles.chatNotSelectedContainer)}>
                  <div {...stylex.props(styles.messageIconContainer)}>
                     <VscSend {...stylex.props(styles.messageIcon)} />
                  </div>
                  <div {...stylex.props(styles.chatNotSelectedTitle)}>Your messages</div>
                  <div {...stylex.props(styles.chatNotSelectedSubtitle)}>
                     Send a message to start a chat.
                  </div>
                  <NewMessageTrigger styleProps={stylex.props(styles.sendMessageButton)}>
                     Send message
                  </NewMessageTrigger>
               </div>
            )}
            {!isChatSelected && isRequestsPage && (
               <div {...stylex.props(styles.chatNotSelectedContainer)}>
                  <div {...stylex.props(styles.messageIconContainer)}>
                     <RiUserReceived2Line {...stylex.props(styles.requestsIcon)} />
                  </div>
                  <div {...stylex.props(styles.chatNotSelectedTitle)}>Message requests</div>
                  <div {...stylex.props(styles.chatNotSelectedSubtitle)}>
                     These messages are from people you&apos;ve restricted or don&apos;t follow.
                     They won&apos;t know you viewed their request until you allow them to message
                     you.
                  </div>
               </div>
            )}
            {isChatSelected && initialConversation && (
               <ChatView
                  conversationId={chatId}
                  authUserId={authUserId}
                  folder={folder}
                  initialMessages={initialMessages}
                  initialConversation={initialConversation}
                  onInfoClick={() => {}}
               />
            )}
         </div>
         {isChatSelected && isGroup && initialConversation && (
            <GroupDetailsPanel
               conversationId={chatId}
               authUserId={authUserId}
               initialConversation={initialConversation}
            />
         )}
         <NewMessageModal />
      </div>
   );
}
```

> **Note:** `onInfoClick` on ChatView needs to toggle GroupDetailsPanel visibility. Since DirectMessagesPage is a server component, extract the layout into a thin client wrapper (`DirectMessagesLayout`) that holds `showDetails` state and conditionally renders `GroupDetailsPanel`. Alternatively, pass `chatId` to a client wrapper and let it own the toggle. Simplest: make the ⓘ button in ChatView navigate to a `?details=1` search param and read it in the page. But a client wrapper is cleanest. See the implementation note below.

**Implementation note — details toggle:** Create `src/pageComponents/DirectMessages/components/ChatLayout/index.tsx` as a `'use client'` wrapper that:
- Receives `chatView: ReactNode`, `detailsPanel: ReactNode | null`
- Holds `const [showDetails, setShowDetails] = useState(false)`
- Passes `onInfoClick={() => setShowDetails(v => !v)}` to ChatView via a client-side prop
- Renders `{showDetails && detailsPanel}`

This avoids making the whole page a client component while keeping the toggle interactive.

- [ ] **Step 2: Verify build**
```
bun run build
```

---

## Task 13: Wire Up RecipientsSidebar with Real Data

**Files:**
- Modify: `src/pageComponents/DirectMessages/components/RecipientsSidebar/index.tsx`
- Modify: `src/pageComponents/DirectMessages/components/RecipientsSidebar/RequestsContent.tsx`

- [ ] **Step 1: Update RecipientsSidebar**

Replace the import of `MESSAGE_THREADS` and `sortedThreads` with the `ConversationList` client component. The server component now receives real data as props:

```typescript
// Updated props interface:
interface RecipientsSidebarProps {
   currentFolderHref?: string;
   isRequestsPage?: boolean;
   authUserId: string;
   folder: 'primary' | 'general' | 'requests';
   initialConversations: ConversationSummaries;
}
```

In the body, replace `sortedThreads.filter(...).map(thread => <ThreadItem ...>)` with:
```typescript
<ConversationList
   authUserId={authUserId}
   folder={folder}
   currentFolderHref={currentFolderHref ?? '/direct'}
   initialData={initialConversations}
/>
```

Remove all imports from `mocks/messageThreads` and `mocks/users`.

- [ ] **Step 2: Update RequestsContent**

`RequestsContent` currently calls `getRequestThreads()` from mocks. Replace it with a `useQuery` that calls `getConversationsQuery` with `folder = 'requests'`. Make `RequestsContent` a client component (`'use client'`) that accepts `authUserId: string` and `initialData: ConversationSummaries` props. Render threads the same way as `ConversationList` but with `href="/direct/requests/{conv.id}"`.

- [ ] **Step 3: Verify build**
```
bun run build
```

---

## Task 14: Wire Up NewMessageModal

**Files:**
- Modify: `src/pageComponents/DirectMessages/components/NewMessageModal/index.tsx`

- [ ] **Step 1: Replace mock data with real followed-users query**

Add a `useQuery` that fetches people the auth user follows:

```typescript
const { data: followedUsers = [] } = useQuery({
   queryKey: ['followed-users'],
   queryFn: async () => {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
         .from('follows')
         .select('user:profiles!following_id(id, username, full_name, avatar_url)')
         .eq('follower_id', user.id);
      return (data ?? []).map(r => r.user).filter(Boolean);
   },
   staleTime: 60_000,
});
```

Replace `SUGGESTED_USERS` with `followedUsers` throughout (filtering and rendering).

- [ ] **Step 2: Wire up Chat button**

Replace the `// TODO: create or navigate to thread` comment:

```typescript
import { createConversation } from '@/src/actions/dm/createConversation';
import { useRouter } from 'next/navigation';

const router = useRouter();
const [creating, setCreating] = useState(false);

// In the Chat button onClick:
async function handleChat() {
   if (!hasSelection || creating) return;
   setCreating(true);
   try {
      const conversationId = await createConversation([...selectedIds]);
      close();
      router.push(`/direct/${conversationId}`);
   } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not start conversation.');
   } finally {
      setCreating(false);
   }
}
```

Update the Chat button: `disabled={!hasSelection || creating}` and `onClick={handleChat}`.

- [ ] **Step 3: Verify build**
```
bun run build
```

- [ ] **Step 4: Final build + lint**
```
bun biome check --write .
bun run build
```

- [ ] **Step 5: Commit**
```
git add src/ 
git commit -m "Wire up Direct Messages with real data and realtime"
```
