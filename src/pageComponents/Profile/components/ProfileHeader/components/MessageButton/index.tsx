'use client';

import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createConversation } from '@/src/actions/dm/createConversation';
import { toast } from '@/src/components/AppToast';
import { getErrorMessage } from '@/src/lib/unwrap';
import { styles } from '../../index.stylex';

interface MessageButtonProps {
   targetUserId: string;
}

export default function MessageButton({ targetUserId }: MessageButtonProps) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);

   async function handleClick() {
      setLoading(true);
      try {
         const conversationId = await createConversation([targetUserId]);
         router.push(`/direct/${conversationId}`);
      } catch (e) {
         toast(getErrorMessage(e, 'Something went wrong.'));
      } finally {
         setLoading(false);
      }
   }

   return (
      <button
         type="button"
         {...stylex.props(styles.button, styles.buttonSecondary)}
         disabled={loading}
         onClick={handleClick}
      >
         Message
      </button>
   );
}
