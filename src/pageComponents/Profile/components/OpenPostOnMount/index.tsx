'use client';

import { useEffect } from 'react';
import type { PostWithMedia } from '@/src/queries/posts';
import { usePostViewModal } from '@/src/store/usePostViewModalStore';

interface OpenPostOnMountProps {
   post: PostWithMedia | string;
}

export default function OpenPostOnMount({ post }: OpenPostOnMountProps) {
   const open = usePostViewModal(state => state.open);
   const postId = typeof post === 'string' ? post : post.id;

   useEffect(() => {
      const state = usePostViewModal.getState();
      if (!state.isOpen || state.postId !== postId) {
         open(post, { suppressAnimation: true });
      }
   }, [open, post, postId]);

   return null;
}
