# Edit Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional edit profile page at `/accounts/edit` with avatar upload, name/username/bio/gender editing, multiple website links, and a gender radio-button selector.

**Architecture:** A server page fetches the authenticated user's full profile and renders `pageComponents/EditProfile`, a client form. Avatar changes upload browser-side to Supabase Storage then save via `updateAvatar`. All other fields save via `updateProfile` which validates and checks username uniqueness. `ProfileHeader` is updated to render multiple JSON-encoded `{title, url}` links from the `website` column.

**Tech Stack:** Next.js 16.2.4, StyleX, Radix UI Dialog, Supabase Storage + `@supabase/ssr`, `react-icons` (MdClose from `react-icons/md`), Biome.

---

## File Map

### New files
| File | Purpose |
|---|---|
| `src/app/(mainLayout)/accounts/edit/page.tsx` | Server page — fetches profile, renders EditProfile |
| `src/actions/profile/updateProfile.ts` | Server action — validates + saves profile fields |
| `src/actions/profile/updateAvatar.ts` | Server action — saves avatar URL |
| `src/pageComponents/EditProfile/index.tsx` | Client form root, owns all state |
| `src/pageComponents/EditProfile/index.stylex.ts` | Page-level styles |
| `src/pageComponents/EditProfile/components/AvatarCard/index.tsx` | Avatar + username card |
| `src/pageComponents/EditProfile/components/AvatarCard/index.stylex.ts` | |
| `src/pageComponents/EditProfile/components/ChangePhotoModal/index.tsx` | Radix Dialog with Upload/Remove/Cancel |
| `src/pageComponents/EditProfile/components/ChangePhotoModal/index.stylex.ts` | |
| `src/pageComponents/EditProfile/components/NameField/index.tsx` | Full name text input |
| `src/pageComponents/EditProfile/components/NameField/index.stylex.ts` | |
| `src/pageComponents/EditProfile/components/UsernameField/index.tsx` | Username input + inline error |
| `src/pageComponents/EditProfile/components/UsernameField/index.stylex.ts` | |
| `src/pageComponents/EditProfile/components/BioField/index.tsx` | Textarea + 0/150 counter |
| `src/pageComponents/EditProfile/components/BioField/index.stylex.ts` | |
| `src/pageComponents/EditProfile/components/GenderSelect/index.tsx` | Radio-button list |
| `src/pageComponents/EditProfile/components/GenderSelect/index.stylex.ts` | |
| `src/pageComponents/EditProfile/components/LinksEditor/index.tsx` | Dynamic URL+title pair list |
| `src/pageComponents/EditProfile/components/LinksEditor/index.stylex.ts` | |

### Modified files
| File | Change |
|---|---|
| `src/types/database.ts` | Add `gender: string \| null` to profiles Row/Insert/Update |
| `src/lib/supabase/getAuthProfile.ts` | Extend select to include `bio, website, gender, full_name` |
| `src/pageComponents/Profile/components/ProfileHeader/index.tsx` | Parse JSON links from `website` column |

---

## Task 1: Add gender column to DB + update types

**Files:**
- Modify: `src/types/database.ts` (profiles section ~lines 861–897)

- [ ] Apply the migration via Supabase MCP tool (`mcp__mcp-server-supabase__apply_migration`) with the SQL:

```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender text;
```

- [ ] In `src/types/database.ts`, find the `profiles` table definition and add `gender` to Row, Insert, and Update:

```ts
// In profiles Row (~line 861):
Row: {
   avatar_url: string | null;
   bio: string | null;
   created_at: string | null;
   full_name: string | null;
   gender: string | null;   // ADD THIS
   id: string;
   is_private: boolean;
   is_verified: boolean;
   updated_at: string | null;
   username: string;
   website: string | null;
};

// In profiles Insert (~line 873):
Insert: {
   avatar_url?: string | null;
   bio?: string | null;
   created_at?: string | null;
   full_name?: string | null;
   gender?: string | null;   // ADD THIS
   id: string;
   is_private?: boolean;
   is_verified?: boolean;
   updated_at?: string | null;
   username: string;
   website?: string | null;
};

// In profiles Update (~line 885):
Update: {
   avatar_url?: string | null;
   bio?: string | null;
   created_at?: string | null;
   full_name?: string | null;
   gender?: string | null;   // ADD THIS
   id?: string;
   is_private?: boolean;
   is_verified?: boolean;
   updated_at?: string | null;
   username?: string;
   website?: string | null;
};
```

---

## Task 2: Create Supabase Storage avatars bucket

- [ ] Use the Supabase MCP tool (`mcp__mcp-server-supabase__execute_sql`) to create a public `avatars` storage bucket if it does not exist. Run in the Supabase SQL editor or via MCP:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

- [ ] Add a storage policy allowing authenticated users to upload to their own path:

```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

---

## Task 3: Extend getAuthProfile + create server actions

**Files:**
- Modify: `src/lib/supabase/getAuthProfile.ts`
- Create: `src/actions/profile/updateProfile.ts`
- Create: `src/actions/profile/updateAvatar.ts`

- [ ] Update `src/lib/supabase/getAuthProfile.ts` to include the extra profile fields:

```ts
import { cache } from 'react';
import { createServerClient } from './server';

export const getAuthProfile = cache(async () => {
   const supabase = await createServerClient();
   const {
      data: { session },
   } = await supabase.auth.getSession();
   if (!session?.user) return null;
   const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, website, gender')
      .eq('id', session.user.id)
      .single();
   return profile;
});
```

- [ ] Create `src/actions/profile/updateProfile.ts`:

```ts
'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '../../lib/supabase/getAuthProfile';
import { createServerClient } from '../../lib/supabase/server';

interface UpdateProfileParams {
   fullName: string;
   username: string;
   bio: string;
   website: string | null;
   gender: string | null;
}

export async function updateProfile(params: UpdateProfileParams) {
   const { fullName, username, bio, website, gender } = params;

   if (bio.length > 150) throw new Error('Bio must be 150 characters or less.');
   if (!username || username.length > 30 || !/^[a-zA-Z0-9_.]+$/.test(username)) {
      return { usernameError: 'Username must be 1–30 characters: letters, numbers, underscores, dots.' };
   }

   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated.');

   const { data: taken } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', authProfile.id)
      .maybeSingle();

   if (taken) return { usernameError: 'That username is already taken.' };

   const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, username, bio, website, gender })
      .eq('id', authProfile.id);

   if (error) throw new Error(error.message);
   revalidatePath('/', 'layout');
   return {};
}
```

- [ ] Create `src/actions/profile/updateAvatar.ts`:

```ts
'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '../../lib/supabase/getAuthProfile';
import { createServerClient } from '../../lib/supabase/server';

export async function updateAvatar({ avatarUrl }: { avatarUrl: string | null }) {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated.');

   const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', authProfile.id);

   if (error) throw new Error(error.message);
   revalidatePath('/', 'layout');
}
```

- [ ] Commit:

```bash
git add src/types/database.ts src/lib/supabase/getAuthProfile.ts src/actions/profile/updateProfile.ts src/actions/profile/updateAvatar.ts
git commit -m "DB migration and profile server actions"
```

---

## Task 4: Route page

**Files:**
- Create: `src/app/(mainLayout)/accounts/edit/page.tsx`

- [ ] Create `src/app/(mainLayout)/accounts/edit/page.tsx`:

```tsx
import { redirect } from 'next/navigation';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import EditProfile from '@/src/pageComponents/EditProfile';

export default async function EditProfilePage() {
   const profile = await getAuthProfile();
   if (!profile) redirect('/login');
   return <EditProfile profile={profile} />;
}
```

---

## Task 5: BioField component

**Files:**
- Create: `src/pageComponents/EditProfile/components/BioField/index.tsx`
- Create: `src/pageComponents/EditProfile/components/BioField/index.stylex.ts`

- [ ] Create `src/pageComponents/EditProfile/components/BioField/index.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
   },
   textarea: {
      width: '100%',
      minHeight: '100px',
      padding: '12px',
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
   counter: {
      position: 'absolute',
      bottom: '10px',
      right: '12px',
      fontSize: '12px',
      color: colors.textSecondary,
   },
});
```

- [ ] Create `src/pageComponents/EditProfile/components/BioField/index.tsx`:

```tsx
import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface BioFieldProps {
   value: string;
   onChange: (value: string) => void;
}

export default function BioField({ value, onChange }: BioFieldProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <textarea
            {...stylex.props(styles.textarea)}
            value={value}
            onChange={e => onChange(e.target.value.slice(0, 150))}
            placeholder="Bio"
            rows={4}
         />
         <span {...stylex.props(styles.counter)}>{value.length} / 150</span>
      </div>
   );
}
```

---

## Task 6: NameField component

**Files:**
- Create: `src/pageComponents/EditProfile/components/NameField/index.tsx`
- Create: `src/pageComponents/EditProfile/components/NameField/index.stylex.ts`

- [ ] Create `src/pageComponents/EditProfile/components/NameField/index.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   input: {
      width: '100%',
      height: '44px',
      padding: '0 12px',
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      boxSizing: 'border-box',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
});
```

- [ ] Create `src/pageComponents/EditProfile/components/NameField/index.tsx`:

```tsx
import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface NameFieldProps {
   value: string;
   onChange: (value: string) => void;
}

export default function NameField({ value, onChange }: NameFieldProps) {
   return (
      <input
         {...stylex.props(styles.input)}
         type="text"
         value={value}
         onChange={e => onChange(e.target.value)}
         placeholder="Name"
      />
   );
}
```

---

## Task 7: UsernameField component

**Files:**
- Create: `src/pageComponents/EditProfile/components/UsernameField/index.tsx`
- Create: `src/pageComponents/EditProfile/components/UsernameField/index.stylex.ts`

- [ ] Create `src/pageComponents/EditProfile/components/UsernameField/index.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
   },
   input: {
      width: '100%',
      height: '44px',
      padding: '0 12px',
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      boxSizing: 'border-box',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
   inputError: {
      borderColor: colors.danger,
   },
   error: {
      fontSize: '12px',
      color: colors.danger,
   },
});
```

- [ ] Create `src/pageComponents/EditProfile/components/UsernameField/index.tsx`:

```tsx
import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface UsernameFieldProps {
   value: string;
   onChange: (value: string) => void;
   error: string | null;
}

export default function UsernameField({ value, onChange, error }: UsernameFieldProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <input
            {...stylex.props(styles.input, !!error && styles.inputError)}
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Username"
         />
         {error && <p {...stylex.props(styles.error)}>{error}</p>}
      </div>
   );
}
```

---

## Task 8: GenderSelect component (radio-button list)

**Files:**
- Create: `src/pageComponents/EditProfile/components/GenderSelect/index.tsx`
- Create: `src/pageComponents/EditProfile/components/GenderSelect/index.stylex.ts`

- [ ] Create `src/pageComponents/EditProfile/components/GenderSelect/index.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.sm,
      overflow: 'hidden',
   },
   option: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: `1px solid ${colors.border}`,
      backgroundColor: 'transparent',
      color: colors.textPrimary,
      fontSize: '14px',
      ':last-child': {
         borderBottom: 'none',
      },
   },
   radio: {
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      border: `2px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
   },
   radioSelected: {
      borderColor: colors.textPrimary,
      backgroundColor: colors.textPrimary,
   },
   checkmark: {
      color: colors.bg,
      fontSize: '14px',
      fontWeight: 700,
   },
});
```

- [ ] Create `src/pageComponents/EditProfile/components/GenderSelect/index.tsx`:

```tsx
import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

const GENDER_OPTIONS = ['Female', 'Male', 'Custom', 'Prefer not to say'] as const;

interface GenderSelectProps {
   value: string;
   onChange: (value: string) => void;
}

export default function GenderSelect({ value, onChange }: GenderSelectProps) {
   return (
      <div {...stylex.props(styles.root)}>
         {GENDER_OPTIONS.map(option => (
            <button
               key={option}
               type="button"
               {...stylex.props(styles.option)}
               onClick={() => onChange(option)}
            >
               <span>{option}</span>
               <div {...stylex.props(styles.radio, value === option && styles.radioSelected)}>
                  {value === option && <span {...stylex.props(styles.checkmark)}>✓</span>}
               </div>
            </button>
         ))}
      </div>
   );
}
```

---

## Task 9: LinksEditor component

**Files:**
- Create: `src/pageComponents/EditProfile/components/LinksEditor/index.tsx`
- Create: `src/pageComponents/EditProfile/components/LinksEditor/index.stylex.ts`

- [ ] Create `src/pageComponents/EditProfile/components/LinksEditor/index.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
   },
   linkRow: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
   },
   input: {
      flex: 1,
      height: '44px',
      padding: '0 12px',
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      boxSizing: 'border-box',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
   removeBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: radius.full,
      backgroundColor: colors.buttonHover,
      color: colors.textSecondary,
      flexShrink: 0,
   },
   addBtn: {
      alignSelf: 'flex-start',
      fontSize: '14px',
      fontWeight: 600,
      color: colors.accent,
      background: 'none',
      border: 'none',
      padding: '4px 0',
   },
});
```

- [ ] Create `src/pageComponents/EditProfile/components/LinksEditor/index.tsx`:

```tsx
import * as stylex from '@stylexjs/stylex';
import { MdClose } from 'react-icons/md';
import { styles } from './index.stylex';

export type LinkEntry = { title: string; url: string };

interface LinksEditorProps {
   links: LinkEntry[];
   onChange: (links: LinkEntry[]) => void;
}

export default function LinksEditor({ links, onChange }: LinksEditorProps) {
   function addLink() {
      if (links.length >= 5) return;
      onChange([...links, { title: '', url: '' }]);
   }

   function removeLink(index: number) {
      onChange(links.filter((_, i) => i !== index));
   }

   function updateLink(index: number, field: keyof LinkEntry, value: string) {
      onChange(links.map((link, i) => (i === index ? { ...link, [field]: value } : link)));
   }

   return (
      <div {...stylex.props(styles.root)}>
         {links.map((link, i) => (
            <div key={i} {...stylex.props(styles.linkRow)}>
               <input
                  {...stylex.props(styles.input)}
                  type="text"
                  placeholder="Title"
                  value={link.title}
                  onChange={e => updateLink(i, 'title', e.target.value)}
               />
               <input
                  {...stylex.props(styles.input)}
                  type="url"
                  placeholder="URL (https://...)"
                  value={link.url}
                  onChange={e => updateLink(i, 'url', e.target.value)}
               />
               <button type="button" {...stylex.props(styles.removeBtn)} onClick={() => removeLink(i)}>
                  <MdClose size={16} />
               </button>
            </div>
         ))}
         {links.length < 5 && (
            <button type="button" {...stylex.props(styles.addBtn)} onClick={addLink}>
               + Add link
            </button>
         )}
      </div>
   );
}
```

---

## Task 10: AvatarCard component

**Files:**
- Create: `src/pageComponents/EditProfile/components/AvatarCard/index.tsx`
- Create: `src/pageComponents/EditProfile/components/AvatarCard/index.stylex.ts`

- [ ] Create `src/pageComponents/EditProfile/components/AvatarCard/index.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.md,
   },
   info: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      flex: 1,
   },
   username: {
      fontSize: '16px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   fullName: {
      fontSize: '14px',
      color: colors.textSecondary,
   },
   changeBtn: {
      padding: '8px 16px',
      borderRadius: radius.sm,
      backgroundColor: colors.primaryButton,
      color: colors.white,
      fontSize: '14px',
      fontWeight: 600,
      flexShrink: 0,
   },
});
```

- [ ] Create `src/pageComponents/EditProfile/components/AvatarCard/index.tsx`:

```tsx
import * as stylex from '@stylexjs/stylex';
import UserAvatar from '@/src/components/UserAvatar';
import { styles } from './index.stylex';

interface AvatarCardProps {
   avatarUrl: string | null;
   username: string;
   fullName: string;
   onChangePhoto: () => void;
}

export default function AvatarCard({ avatarUrl, username, fullName, onChangePhoto }: AvatarCardProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <UserAvatar src={avatarUrl} alt={username} size={56} />
         <div {...stylex.props(styles.info)}>
            <span {...stylex.props(styles.username)}>{username}</span>
            {fullName && <span {...stylex.props(styles.fullName)}>{fullName}</span>}
         </div>
         <button type="button" {...stylex.props(styles.changeBtn)} onClick={onChangePhoto}>
            Change photo
         </button>
      </div>
   );
}
```

---

## Task 11: ChangePhotoModal component

**Files:**
- Create: `src/pageComponents/EditProfile/components/ChangePhotoModal/index.tsx`
- Create: `src/pageComponents/EditProfile/components/ChangePhotoModal/index.stylex.ts`

- [ ] Create `src/pageComponents/EditProfile/components/ChangePhotoModal/index.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      zIndex: 100,
   },
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      backgroundColor: colors.bgElevated,
      borderRadius: radius.md,
      width: '400px',
      overflow: 'hidden',
      zIndex: 101,
      display: 'flex',
      flexDirection: 'column',
   },
   title: {
      textAlign: 'center',
      fontSize: '16px',
      fontWeight: 700,
      color: colors.textPrimary,
      padding: '24px 16px 16px',
   },
   option: {
      width: '100%',
      padding: '16px',
      fontSize: '14px',
      fontWeight: 600,
      textAlign: 'center',
      borderTop: `1px solid ${colors.separator}`,
      backgroundColor: 'transparent',
      color: colors.textPrimary,
   },
   optionUpload: {
      color: colors.accentText,
   },
   optionRemove: {
      color: colors.danger,
   },
});
```

- [ ] Create `src/pageComponents/EditProfile/components/ChangePhotoModal/index.tsx`:

```tsx
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import { styles } from './index.stylex';

interface ChangePhotoModalProps {
   isOpen: boolean;
   onClose: () => void;
   onUpload: (file: File) => Promise<void>;
   onRemove: () => Promise<void>;
}

export default function ChangePhotoModal({ isOpen, onClose, onUpload, onRemove }: ChangePhotoModalProps) {
   const inputRef = useRef<HTMLInputElement>(null);

   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
   }

   return (
      <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)}>
               <Dialog.Title {...stylex.props(styles.title)}>Change Profile Photo</Dialog.Title>
               <Dialog.Description style={{ display: 'none' }}>
                  Upload or remove your profile photo.
               </Dialog.Description>
               <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
               />
               <button
                  type="button"
                  {...stylex.props(styles.option, styles.optionUpload)}
                  onClick={() => inputRef.current?.click()}
               >
                  Upload Photo
               </button>
               <button
                  type="button"
                  {...stylex.props(styles.option, styles.optionRemove)}
                  onClick={onRemove}
               >
                  Remove Current Photo
               </button>
               <button type="button" {...stylex.props(styles.option)} onClick={onClose}>
                  Cancel
               </button>
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
```

---

## Task 12: EditProfile root form + page styles

**Files:**
- Create: `src/pageComponents/EditProfile/index.stylex.ts`
- Create: `src/pageComponents/EditProfile/index.tsx`

- [ ] Create `src/pageComponents/EditProfile/index.stylex.ts`:

```ts
import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: `${spacing.lg} ${spacing.md}`,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.lg,
   },
   title: {
      fontSize: '20px',
      fontWeight: 700,
      color: colors.textPrimary,
   },
   section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
   },
   label: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   hint: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
   footerNote: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
   submitButton: {
      width: '100%',
      height: '48px',
      borderRadius: radius.sm,
      backgroundColor: colors.primaryButton,
      color: colors.white,
      fontSize: '16px',
      fontWeight: 600,
      ':disabled': {
         opacity: 0.6,
      },
   },
});
```

- [ ] Create `src/pageComponents/EditProfile/index.tsx`:

```tsx
'use client';

import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateAvatar } from '@/src/actions/profile/updateAvatar';
import { updateProfile } from '@/src/actions/profile/updateProfile';
import { toast } from '@/src/components/AppToast';
import { createBrowserClient } from '@/src/lib/supabase/client';
import type { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import AvatarCard from './components/AvatarCard';
import BioField from './components/BioField';
import ChangePhotoModal from './components/ChangePhotoModal';
import GenderSelect from './components/GenderSelect';
import LinksEditor, { type LinkEntry } from './components/LinksEditor';
import NameField from './components/NameField';
import UsernameField from './components/UsernameField';
import { styles } from './index.stylex';

type AuthProfile = NonNullable<Awaited<ReturnType<typeof getAuthProfile>>>;

function parseLinks(website: string | null): LinkEntry[] {
   if (!website) return [];
   try {
      const parsed = JSON.parse(website);
      if (Array.isArray(parsed)) return parsed as LinkEntry[];
   } catch {
      return [{ title: website, url: website }];
   }
   return [];
}

export default function EditProfile({ profile }: { profile: AuthProfile }) {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
   const [photoModalOpen, setPhotoModalOpen] = useState(false);
   const [fullName, setFullName] = useState(profile.full_name ?? '');
   const [username, setUsername] = useState(profile.username);
   const [usernameError, setUsernameError] = useState<string | null>(null);
   const [bio, setBio] = useState(profile.bio ?? '');
   const [gender, setGender] = useState(profile.gender ?? '');
   const [links, setLinks] = useState<LinkEntry[]>(parseLinks(profile.website));

   async function handleAvatarUpload(file: File) {
      const supabase = createBrowserClient();
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${profile.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (error) {
         toast('Failed to upload photo.');
         return;
      }
      const {
         data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(path);
      await updateAvatar({ avatarUrl: publicUrl });
      setAvatarUrl(publicUrl);
      setPhotoModalOpen(false);
      toast('Profile photo updated.');
   }

   async function handleAvatarRemove() {
      await updateAvatar({ avatarUrl: null });
      setAvatarUrl(null);
      setPhotoModalOpen(false);
      toast('Profile photo removed.');
   }

   function handleSubmit() {
      setUsernameError(null);
      const website = links.length > 0 ? JSON.stringify(links) : null;
      startTransition(async () => {
         const result = await updateProfile({ fullName, username, bio, website, gender: gender || null });
         if (result.usernameError) {
            setUsernameError(result.usernameError);
            return;
         }
         toast('Profile saved.');
         router.refresh();
      });
   }

   return (
      <div {...stylex.props(styles.root)}>
         <h1 {...stylex.props(styles.title)}>Edit profile</h1>
         <AvatarCard
            avatarUrl={avatarUrl}
            username={username}
            fullName={fullName}
            onChangePhoto={() => setPhotoModalOpen(true)}
         />
         <ChangePhotoModal
            isOpen={photoModalOpen}
            onClose={() => setPhotoModalOpen(false)}
            onUpload={handleAvatarUpload}
            onRemove={handleAvatarRemove}
         />
         <section {...stylex.props(styles.section)}>
            <label {...stylex.props(styles.label)}>Name</label>
            <NameField value={fullName} onChange={setFullName} />
         </section>
         <section {...stylex.props(styles.section)}>
            <label {...stylex.props(styles.label)}>Username</label>
            <UsernameField
               value={username}
               onChange={val => {
                  setUsername(val);
                  setUsernameError(null);
               }}
               error={usernameError}
            />
         </section>
         <section {...stylex.props(styles.section)}>
            <label {...stylex.props(styles.label)}>Website</label>
            <LinksEditor links={links} onChange={setLinks} />
         </section>
         <section {...stylex.props(styles.section)}>
            <label {...stylex.props(styles.label)}>Bio</label>
            <BioField value={bio} onChange={setBio} />
         </section>
         <section {...stylex.props(styles.section)}>
            <label {...stylex.props(styles.label)}>Gender</label>
            <GenderSelect value={gender} onChange={setGender} />
            <p {...stylex.props(styles.hint)}>This won't be part of your public profile.</p>
         </section>
         <p {...stylex.props(styles.footerNote)}>
            Certain profile info, like your name, bio and links, is visible to everyone.
         </p>
         <button
            type="button"
            {...stylex.props(styles.submitButton)}
            onClick={handleSubmit}
            disabled={isPending}
         >
            {isPending ? 'Saving...' : 'Submit'}
         </button>
      </div>
   );
}
```

- [ ] Commit:

```bash
git add src/app/(mainLayout)/accounts/edit src/pageComponents/EditProfile src/actions/profile/updateAvatar.ts src/actions/profile/updateProfile.ts
git commit -m "Edit profile page and components"
```

---

## Task 13: Update ProfileHeader to render multi-link website

**Files:**
- Modify: `src/pageComponents/Profile/components/ProfileHeader/index.tsx`

- [ ] In `src/pageComponents/Profile/components/ProfileHeader/index.tsx`, add a helper function `parseWebsiteLinks` above the component and replace the existing single-link `website` rendering:

Add this function before the component:

```ts
function parseWebsiteLinks(website: string | null): Array<{ title: string; url: string }> {
   if (!website) return [];
   try {
      const parsed = JSON.parse(website);
      if (Array.isArray(parsed)) return parsed as Array<{ title: string; url: string }>;
   } catch {
      return [{ title: website, url: website }];
   }
   return [];
}
```

Replace the existing block (lines ~105–114):

```tsx
{userProfile.website && (
   <Link
      href={userProfile.website}
      target="_blank"
      rel="noopener noreferrer"
      {...stylex.props(styles.websiteLink)}
   >
      {userProfile.website}
   </Link>
)}
```

With:

```tsx
{parseWebsiteLinks(userProfile.website).map((link, i) => (
   <Link
      key={i}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      {...stylex.props(styles.websiteLink)}
   >
      {link.title || link.url}
   </Link>
))}
```

---

## Task 14: Lint, build, and final commit

- [ ] Run the linter and auto-fix:

```bash
bun biome check --write .
```

Fix any remaining errors the linter flags (unused imports, formatting, etc.).

- [ ] Run the build:

```bash
bun run build
```

Fix any TypeScript or build errors before proceeding. Common issues:
- `gender` not in DB types (must have been added in Task 1)
- `maybeSingle()` not in Supabase types — if so, replace with `.limit(1).single()` wrapped in a try/catch, or use `.select('id').eq(...).neq(...)` and check `data?.length`

- [ ] Commit:

```bash
git add -A
git commit -m "Multi-link profile header, lint and build fixes"
```

---

## Self-Review Checklist

- [x] **DB migration** — Task 1 covers gender column + types update
- [x] **Storage bucket** — Task 2 covers bucket creation + policies
- [x] **getAuthProfile** — Task 3 extends select
- [x] **updateProfile** — Task 3 includes validation, uniqueness check, revalidation
- [x] **updateAvatar** — Task 3, updates avatar_url and revalidates
- [x] **Route page** — Task 4, redirects unauthenticated users
- [x] **All form components** — Tasks 5–11
- [x] **Root form** — Task 12 wires all components, handles all state
- [x] **ProfileHeader multi-link** — Task 13
- [x] **Lint + build** — Task 14
- [x] **3 commits max** — commit after Task 3, Task 12, Task 14
- [x] **Type consistency** — `LinkEntry` exported from `LinksEditor/index.tsx` and imported into `EditProfile/index.tsx`; `AuthProfile` derived from `getAuthProfile` return type
- [x] **No placeholders** — all steps have full code
