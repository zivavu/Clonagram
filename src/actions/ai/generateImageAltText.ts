'use server';
import 'server-only';

import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';

const OPENROUTER_MODEL = 'qwen/qwen3.5-flash-02-23';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter(imageUrl: string): Promise<string> {
   const apiKey = process.env.OPEN_ROUTER_API_KEY;
   if (!apiKey) throw new Error('Missing OPEN_ROUTER_API_KEY');

   const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
         model: OPENROUTER_MODEL,
         messages: [
            {
               role: 'user',
               content: [
                  {
                     type: 'text',
                     text: 'Describe this image for an alt text attribute. Be concise (under 80 characters) and focus on what is visually present.',
                  },
                  {
                     type: 'image_url',
                     image_url: { url: imageUrl },
                  },
               ],
            },
         ],
         max_tokens: 200,
      }),
   });

   if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${error}`);
   }

   const data = await response.json();
   const content = data.choices?.[0]?.message?.content;
   if (!content) throw new Error('No content returned from OpenRouter');

   return content;
}

import { ImageAltTextSchema, validate } from '@/src/lib/validation';

export async function generateImageAltText(params: { imageId: string; imageUrl: string }) {
   const { imageId, imageUrl } = validate(ImageAltTextSchema, params);
   const altText = await callOpenRouter(imageUrl);

   const supabase = await createServerClient();
   const { error } = await supabase
      .from('post_images')
      .update({ alt_text: altText })
      .eq('id', imageId);

   throwIfError({ error }, 'Failed to update alt text');

   return altText;
}
