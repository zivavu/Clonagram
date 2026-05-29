'use client';

import { useEffect } from 'react';
import { usePostViewModal } from '@/src/store/postViewModalStore';

interface OpenPostOnMountProps {
   postId: string;
}

export default function OpenPostOnMount({ postId }: OpenPostOnMountProps) {
   const { open } = usePostViewModal();

   useEffect(() => {
      open(postId);
   }, [open, postId]);

   return null;
}
