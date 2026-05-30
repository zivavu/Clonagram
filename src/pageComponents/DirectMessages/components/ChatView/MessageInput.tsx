'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { AiOutlineSmile } from 'react-icons/ai';
import { IoMicOutline } from 'react-icons/io5';
import { LuSticker } from 'react-icons/lu';
import { TbPhoto } from 'react-icons/tb';
import { sendMessage } from '@/src/actions/dm/sendMessage';
import { styles } from '../../index.stylex';

interface MessageInputProps {
   conversationId: string;
   onSent: () => void;
}

export default function MessageInput({ conversationId, onSent }: MessageInputProps) {
   const [text, setText] = useState('');
   const [sending, setSending] = useState(false);

   async function handleSend() {
      if (!text.trim() || sending) return;
      setSending(true);
      try {
         await sendMessage(conversationId, text);
         setText('');
         onSent();
      } finally {
         setSending(false);
      }
   }

   return (
      <div {...stylex.props(styles.inputContainer)}>
         <div {...stylex.props(styles.inputWrapper)}>
            <AiOutlineSmile {...stylex.props(styles.inputIcon)} />
            <input
               {...stylex.props(styles.inputField)}
               type="text"
               placeholder="Message..."
               value={text}
               onChange={e => setText(e.target.value)}
               onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSend();
                  }
               }}
               disabled={sending}
            />
            <IoMicOutline {...stylex.props(styles.inputIcon)} />
            <TbPhoto {...stylex.props(styles.inputIcon)} />
            <LuSticker {...stylex.props(styles.inputIcon)} />
         </div>
      </div>
   );
}
