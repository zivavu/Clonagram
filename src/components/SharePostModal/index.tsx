'use client';

import { sharePost } from '@/src/actions/post/sharePost';
import ShareModal from '@/src/components/ShareModal';
import { useSharePostModal } from '@/src/store/createModalStore';

export default function SharePostModal() {
   const { isOpen, data, close } = useSharePostModal();
   return (
      <ShareModal
         isOpen={isOpen}
         id={data}
         onClose={close}
         onSend={(postId, recipientIds, message) => sharePost({ postId, recipientIds, message })}
         description="Share post via direct message"
      />
   );
}
