import { z } from 'zod';

const uuid = z.string().uuid();

export const LikePostSchema = z.object({ postId: uuid });
export const SavePostSchema = z.object({ postId: uuid });
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
export const LikeCommentSchema = z.object({ commentId: uuid });
export const UnsavePostSchema = z.object({ postId: uuid });
export const DislikePostSchema = z.object({ postId: uuid });

export const CreateNoteSchema = z.object({
   content: z.string().min(1).max(100),
});

export const DeleteNoteSchema = z.object({ noteId: uuid });
export const RecordStoryViewSchema = z.object({ storyId: uuid });
export const MarkNotificationsReadSchema = z.object({
   ids: z.array(uuid).max(100),
});

export function validate<T>(schema: z.ZodSchema<T>, input: unknown): T {
   const result = schema.safeParse(input);
   if (!result.success) {
      const issues = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
      throw new Error(`Invalid input: ${issues}`);
   }
   return result.data;
}
