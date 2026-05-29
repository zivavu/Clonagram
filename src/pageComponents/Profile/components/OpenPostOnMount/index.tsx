'use client';

import { useEffect } from 'react';
import { usePostViewModal } from '@/src/store/postViewModalStore';

interface OpenPostOnMountProps {
   postId: string;
}

export default function OpenPostOnMount({ postId }: OpenPostOnMountProps) {
   const open = usePostViewModal(state => state.open);

   useEffect(() => {
      const state = usePostViewModal.getState();
      const currentPostId = typeof state.post === 'string' ? state.post : state.post?.id;
      if (!state.isOpen || currentPostId !== postId) {
         open(postId);
      }
   }, [open, postId]);

   return null;
}
