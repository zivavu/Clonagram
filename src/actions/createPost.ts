'use server';
import 'server-only';

import type { CreatePostParams } from '../components/CreatePostModal/types';

export async function createPost(_params: CreatePostParams): Promise<void> {
   throw new Error('Not implemented');
}
