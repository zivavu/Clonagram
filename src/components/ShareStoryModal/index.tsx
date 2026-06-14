'use client';

import { shareStory } from '@/src/actions/story/shareStory';
import ShareModal from '@/src/components/ShareModal';
import { useShareStoryModal } from '@/src/store/createModalStore';

export default function ShareStoryModal() {
   const { isOpen, data, close } = useShareStoryModal();
   return (
      <ShareModal
         isOpen={isOpen}
         id={data}
         onClose={close}
         onSend={(storyId, recipientIds, message) => shareStory({ storyId, recipientIds, message })}
         description="Share story via direct message"
      />
   );
}
