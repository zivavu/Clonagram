---
name: edit-profile-page
description: Edit profile page at /accounts/edit with avatar upload, multi-link website editor, bio, name, username, gender, and account suggestions toggle
metadata:
  type: project
---

# Edit Profile Page — Design Spec

## Route & Entry Point

- URL: `/accounts/edit`
- File: `src/app/(mainLayout)/accounts/edit/page.tsx` (Server Component)
- The profile header's existing `<Link href="/accounts/edit">` already points here — no change needed there.

## Server Page

Fetches the authenticated user's full profile (id, username, full_name, avatar_url, bio, website, gender) using `getAuthProfile` extended to include those fields, then renders the `<EditProfile>` client component with the data as props.

Username uniqueness is checked server-side in `updateProfile` before saving.

Redirect to `/login` if unauthenticated.

## Client Form: `pageComponents/EditProfile/`

`"use client"` root component. Holds all form state locally. On submit calls the `updateProfile` server action.

### Sub-components

| Component | Responsibility |
|---|---|
| `AvatarCard` | Displays avatar + username + display name; "Change photo" button opens modal |
| `ChangePhotoModal` | Radix `Dialog` with three options: Upload Photo, Remove Current Photo, Cancel |
| `NameField` | Text input for `full_name`; plain text, no char limit enforced |
| `UsernameField` | Text input for `username`; shows inline error if taken or invalid |
| `LinksEditor` | List of `{title, url}` pairs with add/remove; max ~5 links |
| `BioField` | `<textarea>` with live `{n}/150` char counter; hard-capped at 150 |
| `GenderSelect` | Radio-button list with options: Female, Male, Custom, Prefer not to say |

### Form fields & state

```ts
type LinkEntry = { title: string; url: string };

state: {
  fullName: string;
  username: string;
  bio: string;
  gender: string;
  links: LinkEntry[];      // serialised to JSON string in `website` column
  usernameError: string | null;  // inline error from server
}
```

## Avatar Upload Flow

1. User clicks "Change photo" → `ChangePhotoModal` opens.
2. **Upload Photo**: hidden `<input type="file" accept="image/*">` triggered by the option click. On file select, upload directly to Supabase Storage bucket `avatars` via the browser Supabase client (`createBrowserClient`). Path: `{userId}/{timestamp}.{ext}`.
3. After successful upload, call `updateAvatar` server action with the public URL.
4. Optimistically update the avatar displayed in `AvatarCard` via local state.
5. **Remove Current Photo**: call `updateAvatar` server action with `null`.

## Website Links Storage

Stored as a JSON string in the existing `profiles.website` column:

```json
[{"title": "My Blog", "url": "https://example.com"}]
```

- Empty array → stored as `null`.
- Profile header (`ProfileHeader`) updated to parse this format: if valid JSON array, render each as a link; if plain string (legacy), render as before.

## Gender Column Migration

Add `gender text null` to the `profiles` table via Supabase migration. Not shown on public profile pages.

## Server Actions

### `updateProfile`

```ts
// src/actions/profile/updateProfile.ts
params: { fullName: string; username: string; bio: string; website: string | null; gender: string | null }
```

- Validates: bio ≤ 150 chars; username non-empty, alphanumeric/underscores only, 1–30 chars.
- Checks username uniqueness (query profiles where username = new value AND id ≠ current user); throws if taken.
- Updates `profiles` row for the authenticated user.
- Returns `{ usernameError?: string }` so the client can surface inline field errors.

### `updateAvatar`

```ts
// src/actions/profile/updateAvatar.ts
params: { avatarUrl: string | null }
```

- Updates `profiles.avatar_url` for the authenticated user.
- Returns void.

## Commit Plan (≤ 3 commits)

1. **DB migration + server actions** — gender column migration, `updateProfile` action, `updateAvatar` action, extend `getAuthProfile` select.
2. **Edit profile page + components** — route page, `EditProfile` form with all sub-components, StyleX styles.
3. **Profile header multi-link support + lint/build** — update `ProfileHeader` to parse JSON links; run `bun biome check --write .` and `bun run build`; fix any errors.

## Out of Scope

- Email / password changes (separate settings flow).
- Private account toggle (separate feature).
- Account suggestions section (removed entirely).
- Supabase Storage bucket creation (assumed pre-existing or created manually).
