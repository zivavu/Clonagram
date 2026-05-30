# Direct Messages — Design Spec

## Overview

Wire up the Direct Messages feature with real data, real-time messaging, group chats, and per-participant folder assignment. Replace all mock data with Supabase queries and subscriptions.

---

## Database Migration

**Alter `conversation_participants`:**
- Add `folder text NOT NULL DEFAULT 'primary'` — check constraint `IN ('primary', 'general', 'requests')`
- Add `is_muted boolean NOT NULL DEFAULT false`
- Add check constraint on existing `role` column: `IN ('member', 'admin')`

No schema changes needed for `conversations` or `messages` — both are sufficient as-is.

---

## Data Layer

### Queries (`src/queries/conversations.ts`, `src/queries/messages.ts`)

- `getConversationsQuery(supabase, authUserId, folder)` — fetch conversations the user participates in, filtered by folder. Returns conversation + participants (profiles) + last message + unread count (messages after `last_read_at`).
- `getMessagesQuery(supabase, conversationId)` — fetch all messages in a conversation ordered by `created_at ASC`, each with `sender: profiles`.
- `getConversationParticipantsQuery(supabase, conversationId)` — fetch all participants with profile + role + is_muted.

### Server Actions (`src/actions/dm/`)

- `createConversation(participantIds[])` — create conversation row, insert participants. Creator gets `role = 'admin'`, `folder = 'primary'`. Other participants get `role = 'member'`, `folder = 'requests'` (if they don't follow the creator) or `'primary'` (if they do). Returns `conversationId`.
- `sendMessage(conversationId, content)` — insert into `messages`. Update `conversations.updated_at`.
- `markConversationRead(conversationId)` — update `conversation_participants.last_read_at = now()` for auth user.
- `acceptRequest(conversationId)` — set `folder = 'primary'` for auth user in `conversation_participants`.
- `deleteRequest(conversationId)` — remove auth user from `conversation_participants` (effectively deletes it for them).
- `blockAndDeleteRequest(conversationId, senderId)` — block sender + delete request.
- `leaveConversation(conversationId)` — remove self from `conversation_participants`.
- `deleteConversation(conversationId)` — remove self from `conversation_participants` (same as leave, but labeled differently in UI).
- `updateGroupName(conversationId, title)` — update `conversations.title`. Auth user must be `admin`.
- `addParticipants(conversationId, userIds[])` — insert new rows into `conversation_participants` with `role = 'member'`, `folder = 'primary'`.
- `removeParticipant(conversationId, userId)` — delete from `conversation_participants`. Auth user must be `admin`.
- `toggleMute(conversationId, muted)` — update `is_muted` for auth user in `conversation_participants`.

---

## Architecture

### Component Tree

```
DirectMessagesPage (server) — fetches initial conversations + initial chat data
├── RecipientsSidebar (server shell)
│   └── ConversationList (client) — useQuery + Realtime subscription
│       ├── ThreadItem (existing)
│       └── RequestsContent (client) — useQuery for requests folder
├── ChatView (client) — useQuery + Realtime subscription per conversationId
│   ├── MessageList
│   ├── MessageInput
│   └── RequestActions (accept / block / delete — shown when folder = 'requests')
├── GroupDetailsPanel (client) — shown via ⓘ button, right panel
│   ├── GroupNameEditor
│   ├── MuteToggle
│   ├── MembersList (add / remove)
│   ├── Nicknames (header only, no logic)
│   └── LeaveChat / DeleteChat
└── NewMessageModal (client, existing shell) — wire up createConversation + navigate
```

`DirectMessagesPage` stays a server component and passes `initialConversations` and `initialMessages` as props to client components as react-query `initialData`, avoiding loading states on first render.

---

## Real-Time

### ConversationList subscription
On mount, subscribes to Supabase Realtime `INSERT` on `messages` table. On event: `invalidateQueries(['conversations', folder])` — keeps thread previews and unread dots live.

### ChatView subscription
On mount (when a `conversationId` is active), subscribes to `messages` INSERT filtered to `conversation_id`. On event: `invalidateQueries(['messages', conversationId])`. Also calls `markConversationRead` when new messages arrive while the chat is open.

Both subscriptions are cleaned up on unmount.

---

## Conversation Folder Logic

When `createConversation` runs:
- Creator: `folder = 'primary'`, `role = 'admin'`
- Each invitee: check if invitee follows the creator (query `follows` table). If yes → `folder = 'primary'`; if no → `folder = 'requests'`
- `role = 'member'` for all invitees

---

## Group Details Panel

Visible only for group conversations (more than 2 participants). Toggled by the ⓘ icon in the chat top bar.

- **Change group name** — inline input + "Change" button → `updateGroupName` action
- **Mute messages** — toggle → `toggleMute` action. Optimistic update.
- **Members** — list participants; shows "Admin · username" for admins. Admin sees "···" context menu per non-admin member with "Remove from group". "Add people" button → opens `UserAutocomplete` → `addParticipants` action.
- **Leave chat** — `leaveConversation` action + navigate to `/direct`
- **Delete chat** — `deleteConversation` action + navigate to `/direct`

---

## Unread Tracking

Unread count = messages in conversation where `created_at > last_read_at` and `sender_id ≠ auth user`. Computed server-side in `getConversationsQuery` via a subquery. `markConversationRead` is called on: chat mount, new message received while chat is open.

---

## NewMessageModal Wiring

Replace `SUGGESTED_USERS` mock with `useQuery` fetching followed users (`follows` table joined with `profiles`). On "Chat" click: call `createConversation(selectedIds[])`, then `router.push('/direct/{conversationId}')`.

---

## Sections Not in Scope

- Message reactions
- Media/image sending (input icons remain as stubs)
- Voice/video call buttons (remain as stubs)
- Nicknames editing
- Hidden requests
- Message search
