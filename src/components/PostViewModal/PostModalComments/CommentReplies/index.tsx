'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { commentRepliesQuery } from '@/src/queries/comments';
import CommentItem, { CommentSkeleton, type OnReplyParams } from '../CommentItem';
import { styles } from '../CommentItem/index.stylex';

interface CommentRepliesProps {
   parentId: string;
   onReply: (params: OnReplyParams) => void;
}

export default function CommentReplies({ parentId, onReply }: CommentRepliesProps) {
   const repliesKey = ['replies', parentId];

   const { data: replies = [], isLoading } = useQuery({
      queryKey: repliesKey,
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await commentRepliesQuery(supabase, parentId);
         if (error) throw error;
         return data;
      },
   });

   function handleReplyToReply(params: OnReplyParams) {
      onReply({ commentId: parentId, username: params.username });
   }

   return (
      <div {...stylex.props(styles.repliesContainer)}>
         {isLoading
            ? ['a', 'b'].map(k => <CommentSkeleton key={k} />)
            : replies.map(reply => (
                 <CommentItem
                    key={reply.id}
                    comment={reply}
                    commentsKey={repliesKey}
                    onReply={handleReplyToReply}
                    isReply
                 />
              ))}
      </div>
   );
}
