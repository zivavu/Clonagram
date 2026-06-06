'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { IoCloseOutline } from 'react-icons/io5';
import { getPostAction } from '../../actions/post/getPost';
import { usePostViewModal } from '../../store/postViewModalStore';
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
      queryKey: ['post', postId],
      queryFn: () => getPostAction(postId ?? ''),
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
         return media?.width && media?.height ? `${media.width} / ${media.height}` : undefined;
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
                  <IoCloseOutline style={{ fontSize: 28 }} />
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
               <PostMediaCarousel
                  post={post}
                  initialImageIndex={initialImageIndex}
                  height={'100%'}
                  width={'auto'}
                  aspectRatio={aspectRatio}
                  sizes="80vw"
                  imageProps={{ style: { objectFit: 'contain' } }}
                  omitRightBorderRadius={true}
                  playerIdPrefix="modal"
               />
               <PostModalComments initialPost={post} />
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
