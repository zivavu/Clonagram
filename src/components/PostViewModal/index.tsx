'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { IoCloseOutline } from 'react-icons/io5';
import { getPost } from '../../actions/post/getPost';
import { queryKeys } from '../../lib/queryKeys';
import { usePostViewModal } from '../../store/usePostViewModalStore';
import DialogOverlay from '../DialogOverlay';
import PostMediaCarousel from '../PostMediaCarousel/PostMediaCarousel';
import { styles } from './index.stylex';
import PostModalComments from './PostModalComments';

export default function PostFullViewModal() {
   const {
      isOpen,
      post: postOrPostId,
      close,
      initialImageIndex,
      returnPath,
      suppressAnimation,
   } = usePostViewModal();
   const router = useRouter();

   const postId = typeof postOrPostId === 'string' ? postOrPostId : postOrPostId?.id;

   const { data: post } = useQuery({
      queryKey: postId ? queryKeys.post(postId) : ['post'],
      queryFn: () => getPost(postId ?? ''),
      enabled: !!postId,
      initialData: typeof postOrPostId !== 'string' ? postOrPostId : undefined,
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
               <Dialog.Title style={{ display: 'none' }}>
                  Full view of {post.user.username} post
               </Dialog.Title>
               <Dialog.Description style={{ display: 'none' }}>
                  {post.caption ?? 'Post has no caption'}
               </Dialog.Description>
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
