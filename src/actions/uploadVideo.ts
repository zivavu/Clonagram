'use server';
import 'server-only';

import type { AspectRatio } from '../components/CreatePostModal/types';

interface UploadVideoParams {
   trimStart: number;
   trimEnd: number;
   muted: boolean;
   aspectRatio: AspectRatio;
}

interface UploadVideoResult {
   uploadUrl: string;
   uploadId: string;
}

export async function uploadVideo(_params: UploadVideoParams): Promise<UploadVideoResult> {
   throw new Error('Not implemented');
}
