'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as stylex from '@stylexjs/stylex';
import { usePostViewModal } from '../../store/postViewModalStore';
import DialogOverlay from '../DialogOverlay';
import PostMediaCarousel from '../PostMediaCarousel/PostMediaCarousel';
import { styles } from './index.stylex';

export default function PostFullViewModal() {
   const { isOpen, post, close } = usePostViewModal();

   if (!post) return null;

   const aspectRatio = (() => {
      if (post.aspect_ratio === 'original') {
         const media = post.images?.[0] ?? post.videos?.[0];
         return media?.width && media?.height ? `${media.width} / ${media.height}` : undefined;
      }
      return post.aspect_ratio.split(':').join(' / ');
   })();

   return (
      <Dialog.Root open={isOpen} onOpenChange={close}>
         <Dialog.Portal>
            <DialogOverlay />
            <Dialog.Content onEscapeKeyDown={close} {...stylex.props(styles.content)}>
               <Dialog.Title style={{ display: 'none' }}>
                  Full view {post.user.username} post
               </Dialog.Title>
               <PostMediaCarousel
                  post={post}
                  initialImageIndex={0}
                  height={'100%'}
                  width={'auto'}
                  aspectRatio={aspectRatio}
               />
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   );
}
