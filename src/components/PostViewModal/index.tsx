'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { IoCloseOutline } from 'react-icons/io5';
import { HiddenDialogDescription, HiddenDialogTitle } from '@/src/components/HiddenDialogLabel';
import { getPost } from '../../actions/post/getPost';
import { queryKeys } from '../../lib/queryKeys';
import { usePostViewModal } from '../../store/usePostViewModalStore';
import DialogOverlay from '../DialogOverlay';
import PostMediaCarousel from '../PostMediaCarousel';
import { styles } from './index.stylex';
import PostModalComments from './PostModalComments';

export default function PostFullViewModal() {
   const {
      isOpen,
      postId,
      preloadedPost,
      close,
      initialImageIndex,
      returnPath,
      suppressAnimation,
   } = usePostViewModal();
   const router = useRouter();

   const { data: post } = useQuery({
      queryKey: postId ? queryKeys.post(postId) : ['post'],
      queryFn: () => getPost({ postId: postId ?? '' }),
      enabled: !!postId,
      initialData: preloadedPost ?? undefined,
   });

   if (!post) return null;

   function handleClose() {
      if (!isOpen) return;
      close();
      if (returnPath) {
         history.replaceState(null, '', returnPath);
      } else if (post) {
         router.replace(`/profile/${post.user.username}`);
      }
   }

   const aspectRatio = (() => {
      if (post.aspect_ratio === 'original') {
         const media = post.images?.[0] ?? post.videos?.[0];
         return media?.width && media?.height ? `${media.width} / ${media.height}` : '1 / 1';
      }
      return post.aspect_ratio.split(':').join(' / ');
   })();

   return (
      <Dialog.Root open={isOpen} onOpenChange={() => handleClose()}>
         <Dialog.Portal>
            <DialogOverlay />
            <div {...stylex.props(styles.closeOverlayLayer)}>
               <button
                  aria-label="Close"
                  onClick={handleClose}
                  {...stylex.props(styles.closeOverlayButton)}
               >
                  <IoCloseOutline size={28} />
               </button>
            </div>
            <Dialog.Content
               {...stylex.props(styles.content, suppressAnimation && styles.noAnimation)}
            >
               <HiddenDialogTitle>Full view of {post.user.username} post</HiddenDialogTitle>
               <HiddenDialogDescription>
                  {post.caption ?? 'Post has no caption'}
               </HiddenDialogDescription>
               <div {...stylex.props(styles.carouselWrapper)} style={{ aspectRatio }}>
                  <PostMediaCarousel
                     post={post}
                     initialImageIndex={initialImageIndex}
                     height={'100%'}
                     width={'100%'}
                     sizes="80vw"
                     imageProps={{ style: { objectFit: 'contain' } }}
                     omitRightBorderRadius={true}
                     playerIdPrefix="modal"
                  />
               </div>
               <PostModalComments initialPost={post} />
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
