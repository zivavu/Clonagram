'use server';
import 'server-only';

import { createServerClient } from '../lib/supabase/server';

interface UploadImageProps {
   file: File;
   bucket: string;
   fileName?: string;
}

export async function uploadImage({ file, bucket, fileName }: UploadImageProps) {
   const supabaseClient = await createServerClient();
   const { data, error } = await supabaseClient.storage
      .from(bucket)
      .update(fileName ?? file.name, file);

   if (error) {
      throw error;
   }

   return data;
}
