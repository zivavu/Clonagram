'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getPostForEdit } from '@/src/actions/post/getPostForEdit';
import { updatePost } from '@/src/actions/post/updatePost';
import { toast } from '@/src/components/AppToast';
import CaptionPanel from '@/src/components/CreatePostModal/components/CaptionStep/components/CaptionPanel';
import StepHeader, {
   StepHeaderAction,
} from '@/src/components/CreatePostModal/components/StepHeader';
import type { PostLocation, PostSettings } from '@/src/components/CreatePostModal/types';
import { DEFAULT_POST_SETTINGS } from '@/src/components/CreatePostModal/types';
import { styles } from './index.stylex';

interface EditPostModalProps {
   isOpen: boolean;
   postId: string | null;
   onClose: () => void;
}

export default function EditPostModal({ isOpen, postId, onClose }: EditPostModalProps) {
   const queryClient = useQueryClient();

   const { data: post } = useQuery({
      queryKey: ['post-for-edit', postId],
      queryFn: () => getPostForEdit(postId ?? ''),
      enabled: isOpen && !!postId,
      staleTime: 0,
   });

   const [caption, setCaption] = useState('');
   const [location, setLocation] = useState<PostLocation | null>(null);
   const [postSettings, setPostSettings] = useState<PostSettings>(DEFAULT_POST_SETTINGS);
   const [seeded, setSeeded] = useState(false);

   if (post && !seeded) {
      setCaption(post.caption ?? '');
      setLocation(
         post.location_name && post.location_lat != null && post.location_lon != null
            ? { name: post.location_name, lat: post.location_lat, lon: post.location_lon }
            : null,
      );
      setPostSettings({
         hideLikes: post.hide_likes,
         commentsOff: post.comments_off,
         shareToClonedbook: false,
      });
      setSeeded(true);
   }

   const { mutate: save, isPending } = useMutation({
      mutationFn: () =>
         updatePost({
            postId: postId ?? '',
            caption,
            location,
            hideLikes: postSettings.hideLikes,
            commentsOff: postSettings.commentsOff,
         }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['post', postId] });
         toast('Post updated.');
         handleClose();
      },
      onError: (error: Error) => {
         toast(error.message || 'Could not update post. Try again.');
      },
   });

   function handleClose() {
      setSeeded(false);
      onClose();
   }

   const sortedImages = [...(post?.images ?? [])].sort((a, b) => a.position - b.position);
   const sortedVideos = [...(post?.videos ?? [])].sort((a, b) => a.position - b.position);
   const firstImage = sortedImages[0];
   const firstVideo = sortedVideos[0];

   return (
      <Dialog.Root open={isOpen} onOpenChange={open => !open && handleClose()}>
         <Dialog.Portal>
            <Dialog.Overlay {...stylex.props(styles.overlay)} />
            <Dialog.Content {...stylex.props(styles.content)} onEscapeKeyDown={handleClose}>
               <Dialog.Title style={{ display: 'none' }}>Edit post</Dialog.Title>
               <Dialog.Description style={{ display: 'none' }}>
                  Edit post caption and settings.
               </Dialog.Description>
               <StepHeader
                  title="Edit info"
                  rightSlot={
                     <StepHeaderAction
                        label={isPending ? 'Saving...' : 'Done'}
                        onClick={() => save()}
                     />
                  }
               />
               {!post ? (
                  <div {...stylex.props(styles.loading)}>Loading...</div>
               ) : (
                  <div {...stylex.props(styles.body)}>
                     <div {...stylex.props(styles.preview)}>
                        {firstImage ? (
                           /* biome-ignore lint/performance/noImgElement: modal preview, no layout shift concern */
                           <img
                              src={firstImage.url}
                              alt="Post preview"
                              {...stylex.props(styles.previewImage)}
                           />
                        ) : firstVideo ? (
                           <video
                              src={`https://stream.mux.com/${firstVideo.mux_playback_id}/low.mp4`}
                              {...stylex.props(styles.previewImage)}
                              muted
                              playsInline
                           />
                        ) : (
                           <span {...stylex.props(styles.previewPlaceholder)}>No media</span>
                        )}
                     </div>
                     <CaptionPanel
                        caption={caption}
                        onCaptionChange={setCaption}
                        location={location}
                        onLocationChange={setLocation}
                        postSettings={postSettings}
                        onPostSettingsChange={setPostSettings}
                     />
                  </div>
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
