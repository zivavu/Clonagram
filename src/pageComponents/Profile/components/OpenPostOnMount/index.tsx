'use client';

import { useEffect } from 'react';
import type { PostWithMedia } from '@/src/queries/posts';
import { usePostViewModal } from '@/src/store/postViewModalStore';

interface OpenPostOnMountProps {
   post: PostWithMedia | string;
}

export default function OpenPostOnMount({ post }: OpenPostOnMountProps) {
   const open = usePostViewModal(state => state.open);
   const postId = typeof post === 'string' ? post : post.id;

   useEffect(() => {
      const state = usePostViewModal.getState();
      const currentPostId = typeof state.post === 'string' ? state.post : state.post?.id;
      if (!state.isOpen || currentPostId !== postId) {
         open(post);
      }
   }, [open, post, postId]);

   return null;
}
