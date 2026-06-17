'use client';

import { usePathname } from 'next/navigation';
import type { PostWithMedia } from '../queries/posts';
import { usePostViewModal } from '../store/usePostViewModalStore';

interface OpenPostModalParams {
   initialImageIndex?: number;
   username?: string;
}

export function useOpenPostModal() {
   'use no memo';
   const pathname = usePathname();
   const { open } = usePostViewModal();

   function openPostModal(post: PostWithMedia, params?: OpenPostModalParams): void;
   function openPostModal(postId: string, username: string, params?: OpenPostModalParams): void;
   function openPostModal(
      postOrId: PostWithMedia | string,
      usernameOrParams?: string | OpenPostModalParams,
      params?: OpenPostModalParams,
   ) {
      if (typeof postOrId === 'string') {
         const username = usernameOrParams as string;
         open(postOrId, { ...params, returnPath: pathname });
         window.history.pushState({ postModal: true }, '', `/profile/${username}/${postOrId}`);
      } else {
         const options = usernameOrParams as OpenPostModalParams | undefined;
         open(postOrId, { initialImageIndex: options?.initialImageIndex, returnPath: pathname });
         window.history.pushState(
            { postModal: true },
            '',
            `/profile/${postOrId.user.username}/${postOrId.id}`,
         );
      }
   }

   return { openPostModal };
}
