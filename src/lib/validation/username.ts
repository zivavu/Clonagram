import { z } from 'zod';

export const usernameSchema = z
   .string()
   .min(1)
   .max(30)
   .regex(/^[a-zA-Z0-9_.]+$/, 'Only letters, numbers, underscores, and dots are allowed');
