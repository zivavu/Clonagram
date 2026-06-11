'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import CommentItem, { CommentSkeleton } from '@/src/components/CommentItem';
import { useClickOutside } from '@/src/hooks/useClickOutside';
import { useSubmitComment } from '@/src/hooks/useSubmitComment';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { postCommentsQuery } from '@/src/queries/comments';
import type { Reel } from '@/src/queries/posts';
import { styles } from './index.stylex';

interface ReelCommentsProps {
   reel: Reel;
   onClose: () => void;
}

export default function ReelComments({ reel, onClose }: ReelCommentsProps) {
   const panelRef = useClickOutside<HTMLDivElement>(onClose);
   const commentsKey = queryKeys.comments(reel.id);
   const [inputValue, setInputValue] = useState('');
   const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(
      null,
   );

   const { mutate: submitComment } = useSubmitComment(reel.id, commentsKey);

   const { data: comments = [], isLoading: isLoadingComments } = useQuery({
      queryKey: commentsKey,
      queryFn: async () => {
         const { data, error } = await postCommentsQuery(supabase, reel.id);
         if (error) throw error;
         return data;
      },
   });

   function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      const content = inputValue.trim();
      if (!content) return;
      setInputValue('');
      submitComment({ content, parentId: replyingTo?.commentId });
      setReplyingTo(null);
   }

   return (
      <div ref={panelRef} {...stylex.props(styles.panel)}>
         <div {...stylex.props(styles.header)}>
            <div {...stylex.props(styles.spacer)} />
            <span {...stylex.props(styles.title)}>Comments</span>
            <button
               type="button"
               onClick={onClose}
               aria-label="Close comments"
               {...stylex.props(styles.closeButton)}
            >
               <IoClose size={24} />
            </button>
         </div>
         <div {...stylex.props(styles.body)}>
            {isLoadingComments
               ? ['a', 'b', 'c'].map(k => <CommentSkeleton key={k} />)
               : comments.map(comment => (
                    <CommentItem
                       key={comment.id}
                       comment={comment}
                       commentsKey={commentsKey}
                       postOwnerId={reel.user.id}
                       onReply={params => {
                          setReplyingTo(params);
                          setInputValue(`@${params.username} `);
                       }}
                    />
                 ))}
         </div>
         <form onSubmit={handleSubmit} {...stylex.props(styles.composer)}>
            <button type="button" aria-label="Emoji" {...stylex.props(styles.emojiButton)}>
               <BsEmojiSmile size={22} />
            </button>
            <input
               type="text"
               placeholder="Add a comment..."
               value={inputValue}
               onChange={e => setInputValue(e.target.value)}
               {...stylex.props(styles.input)}
            />
            <button type="submit" {...stylex.props(styles.postButton)}>
               Post
            </button>
         </form>
      </div>
   );
}
