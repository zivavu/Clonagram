import type { Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/types/database';

export function makeServiceClient() {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

   if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
   }

   return createClient<Database>(url, key);
}

export async function createTestImageBuffer(page: Page, fillStyle = '#4f46e5') {
   const base64 = await page.evaluate(color => {
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get a 2d canvas context');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 500, 500);
      return new Promise<string>((resolve, reject) => {
         canvas.toBlob(blob => {
            if (!blob) {
               reject(new Error('Failed to create image blob'));
               return;
            }
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
         }, 'image/png');
      });
   }, fillStyle);
   return Buffer.from(base64.split(',')[1], 'base64');
}
