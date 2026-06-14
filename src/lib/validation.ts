import { z } from 'zod';

const uuid = z.string().uuid();

export const GetFollowsSchema = z.object({ userId: uuid });
export const FollowUserSchema = z.object({ targetUserId: uuid });
export const SendMessageSchema = z.object({
   conversationId: uuid,
   content: z.string().min(1).max(2000),
});
export const SendImageSchema = z.object({
   conversationId: uuid,
   mediaUrl: z.string().url().max(500),
});
export const SendStickerSchema = z.object({
   conversationId: uuid,
   stickerUrl: z.string().url().max(500),
});
export const CreateCommentSchema = z.object({
   postId: uuid,
   content: z.string().min(1).max(1000),
   parentId: uuid.nullable().optional(),
});
export const UpdatePostSchema = z.object({
   postId: uuid,
   caption: z.string().max(2200).optional(),
   location: z
      .object({
         name: z.string().max(100),
         lat: z.number(),
         lon: z.number(),
      })
      .nullable()
      .optional(),
   hideLikes: z.boolean().optional(),
   commentsOff: z.boolean().optional(),
});
export const UpdateProfileSchema = z.object({
   fullName: z.string().min(1).max(100),
   username: z
      .string()
      .min(1)
      .max(30)
      .regex(/^[a-zA-Z0-9_.]+$/),
   bio: z.string().max(150),
   website: z.string().url().max(100).nullable(),
   gender: z.string().max(20).nullable(),
});

export const CreateConversationSchema = z.object({
   participantIds: z.array(uuid).min(1).max(100),
});

export const DeletePostSchema = z.object({ postId: uuid });
export const DeleteCommentSchema = z.object({ commentId: uuid });
export const LikeCommentSchema = z.object({ commentId: uuid, isLiked: z.boolean() });
export const TogglePostLikeSchema = z.object({ postId: uuid, isLiked: z.boolean() });
export const TogglePostSaveSchema = z.object({ postId: uuid, isSaved: z.boolean() });
export const TogglePostRepostSchema = z.object({ postId: uuid, isReposted: z.boolean() });

export const usernameSchema = z
   .string()
   .min(1)
   .max(30)
   .regex(/^[a-zA-Z0-9_.]+$/, 'Only letters, numbers, underscores, and dots are allowed');

export const ConversationIdSchema = z.object({ conversationId: uuid });
export const AddParticipantsSchema = z.object({
   conversationId: uuid,
   userIds: z.array(uuid).min(1).max(100),
});
export const ConversationWithUserSchema = z.object({
   conversationId: uuid,
   userId: uuid,
});
export const ConversationWithFolderSchema = z.object({
   conversationId: uuid,
   folder: z.enum(['primary', 'general']),
});
export const ConversationWithTitleSchema = z.object({
   conversationId: uuid,
   title: z.string().min(1).max(100),
});
export const ConversationWithMutedSchema = z.object({
   conversationId: uuid,
   muted: z.boolean(),
});
export const ConversationWithBlockSchema = z.object({
   conversationId: uuid,
   senderUserId: uuid,
});

export const CreateHighlightSchema = z.object({
   title: z.string().min(1).max(100),
   storyIds: z.array(uuid).min(1),
   coverUrl: z.string().nullable(),
});
export const EditHighlightSchema = z.object({
   id: uuid,
   title: z.string().min(1).max(100),
});
export const DeleteHighlightSchema = z.object({ id: uuid });
export const UpdateHighlightStoriesSchema = z.object({
   highlightId: uuid,
   storyIds: z.array(uuid).min(1),
});
export const ReplyToStorySchema = z.object({
   storyId: uuid,
   content: z.string().min(1).max(2000),
});
export const StoryMediaSchema = z.object({
   mediaResult: z.discriminatedUnion('type', [
      z.object({ type: z.literal('image'), url: z.string(), blurDataUrl: z.string() }),
      z.object({
         type: z.literal('video'),
         assetId: z.string(),
         playbackId: z.string(),
         duration: z.number(),
      }),
   ]),
});

export const UpdateAvatarSchema = z.object({
   avatarUrl: z.string().url().nullable(),
});

export const SendPasswordResetSchema = z.object({ email: z.string().email() });
export const ImageAltTextSchema = z.object({
   imageId: uuid,
   imageUrl: z.string().url(),
});

export const UserIdSchema = z.object({ userId: uuid });
export const TargetUserIdSchema = z.object({ targetUserId: uuid });
export const UsernameParamSchema = z.object({ username: z.string().min(1) });
export const PostIdSchema = z.object({ postId: uuid });
export const CursorSchema = z.object({
   variant: z.enum(['home', 'following', 'for_you', 'nonpersonalized']),
   cursor: z.string().nullable().optional(),
});
export const CursorNullableSchema = z.object({ cursor: z.string().nullable().optional() });
export const SearchProfilesSchema = z.object({
   search: z.string().optional(),
   limit: z.number().int().min(1).max(100).optional(),
   excludeId: uuid.optional(),
});

export const MuxUploadSchema = z.object({ uploadId: uuid });
export const NoteContentSchema = z.object({ content: z.string().min(1).max(100) });

export const CreateNoteSchema = z.object({
   content: z.string().min(1).max(100),
});

export const DeleteNoteSchema = z.object({ noteId: uuid });
export const RecordStoryViewSchema = z.object({ storyId: uuid });
export const ReactToStorySchema = z.object({ storyId: uuid, emoji: z.string().min(1).max(10) });
export const MarkNotificationsReadSchema = z.object({
   ids: z.array(uuid).max(100),
});

export const SharePostSchema = z.object({
   postId: uuid,
   recipientIds: z.array(uuid).min(1).max(50),
   message: z.string().min(1).max(2000).optional(),
});

export function validate<T>(schema: z.ZodSchema<T>, input: unknown): T {
   const result = schema.safeParse(input);
   if (!result.success) {
      const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new Error(`Invalid input: ${issues}`);
   }
   return result.data;
}
