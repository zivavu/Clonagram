'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { updateAvatar } from '@/src/actions/profile/updateAvatar';
import { updateProfile } from '@/src/actions/profile/updateProfile';
import { toast } from '@/src/components/AppToast';
import { supabase } from '@/src/lib/supabase/client';
import type { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { usernameSchema } from '@/src/lib/validation/username';
import AuthPagesFooter from '../../components/AuthPagesFooter';
import AvatarCard from './components/AvatarCard';
import BioField from './components/BioField';
import ChangePhotoModal from './components/ChangePhotoModal';
import GenderSelect from './components/GenderSelect';
import LinksEditor, { type LinkEntry } from './components/LinksEditor';
import NameField from './components/NameField';
import UsernameField from './components/UsernameField';
import { styles } from './index.stylex';

type AuthProfile = NonNullable<Awaited<ReturnType<typeof getAuthProfile>>>;

const schema = z.object({
   fullName: z.string(),
   username: usernameSchema,
   bio: z.string().max(150, 'Bio must be 150 characters or less'),
   gender: z.string(),
   links: z.array(z.object({ id: z.string(), title: z.string(), url: z.string() })),
});

type FormData = z.infer<typeof schema>;

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

   const {
      control,
      watch,
      handleSubmit,
      setError,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
         fullName: profile.full_name ?? '',
         username: profile.username,
         bio: profile.bio ?? '',
         gender: profile.gender ?? '',
         links: parseLinks(profile.website),
      },
   });

   const [fullName, username] = watch(['fullName', 'username']);

   async function handleAvatarUpload(file: File) {
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

   function onSubmit(data: FormData) {
      const website =
         data.links.length > 0
            ? JSON.stringify(data.links.map(({ title, url }) => ({ title, url })))
            : null;
      startTransition(async () => {
         const result = await updateProfile({
            fullName: data.fullName,
            username: data.username,
            bio: data.bio,
            website,
            gender: data.gender || null,
         });
         if (result.usernameError) {
            setError('username', { message: result.usernameError });
            return;
         }
         toast('Profile saved.');
         router.refresh();
      });
   }

   return (
      <div style={{ width: '100%' }}>
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
               <Controller
                  control={control}
                  name="fullName"
                  render={({ field }) => (
                     <NameField value={field.value} onChange={field.onChange} />
                  )}
               />
            </section>
            <section {...stylex.props(styles.section)}>
               <span {...stylex.props(styles.label)}>Username</span>
               <Controller
                  control={control}
                  name="username"
                  render={({ field }) => (
                     <UsernameField
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.username?.message ?? null}
                        currentUsername={profile.username}
                     />
                  )}
               />
            </section>
            <section {...stylex.props(styles.section)}>
               <span {...stylex.props(styles.label)}>Website</span>
               <Controller
                  control={control}
                  name="links"
                  render={({ field }) => (
                     <LinksEditor links={field.value} onChange={field.onChange} />
                  )}
               />
            </section>
            <section {...stylex.props(styles.section)}>
               <span {...stylex.props(styles.label)}>Bio</span>
               <Controller
                  control={control}
                  name="bio"
                  render={({ field }) => <BioField value={field.value} onChange={field.onChange} />}
               />
            </section>
            <section {...stylex.props(styles.section)}>
               <span {...stylex.props(styles.label)}>Gender</span>
               <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                     <GenderSelect value={field.value} onChange={field.onChange} />
                  )}
               />
               <p {...stylex.props(styles.hint)}>This won't be part of your public profile.</p>
            </section>
            <p {...stylex.props(styles.footerNote)}>
               Certain profile info, like your name, bio and links, is visible to everyone.
            </p>
            <button
               type="button"
               {...stylex.props(styles.submitButton)}
               onClick={handleSubmit(onSubmit)}
               disabled={isPending}
            >
               {isPending ? 'Saving...' : 'Submit'}
            </button>
         </div>
         <AuthPagesFooter style={{ borderTop: 'none' }} />
      </div>
   );
}
