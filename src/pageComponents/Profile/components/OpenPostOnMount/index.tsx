'use client';

import { useEffect } from 'react';
import { usePostViewModal } from '@/src/store/postViewModalStore';

interface OpenPostOnMountProps {
   postId: string;
   returnPath: string;
}

export default function OpenPostOnMount({ postId, returnPath }: OpenPostOnMountProps) {
   const { openWithUrl } = usePostViewModal();

   useEffect(() => {
      openWithUrl(postId, window.location.pathname, returnPath);
   }, [openWithUrl, postId, returnPath]);

   return null;
}
