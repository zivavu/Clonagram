'use client';

import * as stylex from '@stylexjs/stylex';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { createCommentAction } from '@/src/actions/comments/createComment';
import CommentItem, { CommentSkeleton } from '@/src/components/CommentItem';
import { useAuthUser } from '@/src/hooks/useAuthUser';
import { createBrowserClient } from '@/src/lib/supabase/client';
import { type PostComment, type PostComments, postCommentsQuery } from '@/src/queries/comments';
import type { Reel } from '@/src/queries/posts';
import { styles } from './index.stylex';

interface ReelCommentsProps {
   reel: Reel;
   onClose: () => void;
}

export default function ReelComments({ reel, onClose }: ReelCommentsProps) {
   const panelRef = useRef<HTMLDivElement>(null);
   const { data: authUser } = useAuthUser();
   const queryClient = useQueryClient();

   useEffect(() => {
      function handleMouseDown(e: MouseEvent) {
         if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
            onClose();
         }
      }
      document.addEventListener('mousedown', handleMouseDown);
      return () => document.removeEventListener('mousedown', handleMouseDown);
   }, [onClose]);
   const commentsKey = ['comments', reel.id];
   const [inputValue, setInputValue] = useState('');
   const [replyingTo, setReplyingTo] = useState<{ commentId: string; username: string } | null>(
      null,
   );

   const { data: comments = [], isLoading: isLoadingComments } = useQuery({
      queryKey: commentsKey,
      queryFn: async () => {
         const supabase = createBrowserClient();
         const { data, error } = await postCommentsQuery(supabase, reel.id);
         if (error) throw error;
         return data;
      },
   });

   const { mutate: submitComment } = useMutation({
      mutationFn: ({ content, parentId }: { content: string; parentId?: string }) =>
         createCommentAction({ postId: reel.id, content, parentId }),
      onMutate: async ({ content, parentId }) => {
         if (!authUser) return {};
         const optimistic: PostComment = {
            id: `optimistic-${Date.now()}`,
            content,
            created_at: new Date().toISOString(),
            like_count: 0,
            reply_count: 0,
            parent_id: parentId ?? null,
            comment_likes: [],
            user: { id: authUser.id, username: authUser.username, avatar_url: authUser.avatar_url },
         };
         if (parentId) {
            const repliesKey = ['replies', parentId];
            const prev = queryClient.getQueryData<PostComments>(repliesKey);
            queryClient.setQueryData<PostComments>(repliesKey, old => [...(old ?? []), optimistic]);
            return { prev, repliesKey };
         }
         const prev = queryClient.getQueryData<PostComments>(commentsKey);
         queryClient.setQueryData<PostComments>(commentsKey, old => [...(old ?? []), optimistic]);
         return { prev };
      },
      onError: (_err, { parentId }, context) => {
         if (!context) return;
         if (parentId && 'repliesKey' in context && context.repliesKey) {
            queryClient.setQueryData(context.repliesKey as string[], context.prev);
         } else if ('prev' in context) {
            queryClient.setQueryData(commentsKey, context.prev);
         }
      },
      onSuccess: (newComment, { parentId }) => {
         if (parentId) {
            queryClient.setQueryData<PostComments>(['replies', parentId], old =>
               (old ?? []).map(c => (c.id.startsWith('optimistic-') ? newComment : c)),
            );
         } else {
            queryClient.setQueryData<PostComments>(commentsKey, old =>
               (old ?? []).map(c => (c.id.startsWith('optimistic-') ? newComment : c)),
            );
         }
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
