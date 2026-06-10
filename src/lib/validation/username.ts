import z from 'zod';

export const usernameSchema = z
   .string()
   .min(1, 'Username is required')
   .max(30, 'Username must be 30 characters or less')
   .regex(/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, underscores and dots')
   .refine(v => !v.startsWith('.'), 'Username cannot start with a dot')
   .refine(v => !v.endsWith('.'), 'Username cannot end with a dot')
   .refine(v => !v.includes('..'), 'Username cannot contain consecutive dots');
