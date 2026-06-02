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
      return [{ id: crypto.randomUUID(), title: website, url: website }];
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
      const website =
         links.length > 0 ? JSON.stringify(links.map(({ title, url }) => ({ title, url }))) : null;
      startTransition(async () => {
         const result = await updateProfile({
            fullName,
            username,
            bio,
            website,
            gender: gender || null,
         });
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
            <span {...stylex.props(styles.label)}>Name</span>
            <NameField value={fullName} onChange={setFullName} />
         </section>
         <section {...stylex.props(styles.section)}>
            <span {...stylex.props(styles.label)}>Username</span>
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
            <span {...stylex.props(styles.label)}>Website</span>
            <LinksEditor links={links} onChange={setLinks} />
         </section>
         <section {...stylex.props(styles.section)}>
            <span {...stylex.props(styles.label)}>Bio</span>
            <BioField value={bio} onChange={setBio} />
         </section>
         <section {...stylex.props(styles.section)}>
            <span {...stylex.props(styles.label)}>Gender</span>
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
