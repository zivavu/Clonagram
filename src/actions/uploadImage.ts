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
   const path = fileName ?? file.name;
   const { data, error } = await supabaseClient.storage.from(bucket).upload(path, file);

   if (error) {
      throw error;
   }

   const { data: publicUrlData } = supabaseClient.storage.from(bucket).getPublicUrl(data.path);
   return { path: data.path, publicUrl: publicUrlData.publicUrl };
}
