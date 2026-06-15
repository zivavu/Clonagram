'use client';

import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { commentRepliesQuery } from '@/src/queries/comments';
import CommentItem, { CommentSkeleton, type OnReplyParams } from '..';
import { styles } from '../index.stylex';

interface CommentRepliesProps {
   parentId: string;
   onReply: (params: OnReplyParams) => void;
   postOwnerId: string;
}

export default function CommentReplies({ parentId, onReply, postOwnerId }: CommentRepliesProps) {
   const { data: authUser } = useAuthUser();
   const hideAi = authUser?.hide_ai_content ?? false;
   const repliesKey = queryKeys.replies(parentId, hideAi);

   const { data: replies = [], isLoading } = useQuery({
      queryKey: repliesKey,
      queryFn: async () => {
         const { data, error } = await commentRepliesQuery(supabase, parentId, hideAi);
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
                    postOwnerId={postOwnerId}
                 />
              ))}
      </div>
   );
}
