const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODELS = {
   text: 'meta-llama/llama-3.1-8b-instruct',
   vision: 'qwen/qwen3.5-flash-02-23',
} as const;

type TextPart = { type: 'text'; text: string };
type ImagePart = { type: 'image_url'; image_url: { url: string } };
type MessageContent = string | Array<TextPart | ImagePart>;

type Message = {
   role: 'user' | 'assistant' | 'system';
   content: MessageContent;
};

type CallOptions = {
   messages: Message[];
   maxTokens?: number;
   model?: string;
};

async function callOpenRouter({ messages, maxTokens = 4000, model = MODELS.text }: CallOptions) {
   const apiKey = process.env.OPEN_ROUTER_API_KEY;
   if (!apiKey) throw new Error('Missing OPEN_ROUTER_API_KEY');

   const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
      signal: AbortSignal.timeout(300000),
   });

   if (!response.ok) {
      throw new Error(`OpenRouter error (${response.status}): ${await response.text()}`);
   }

   const data = await response.json();
   const content = data.choices?.[0]?.message?.content;
   if (!content) throw new Error('No content returned from OpenRouter');
   return content as string;
}

async function callOpenRouterStreaming({
   messages,
   maxTokens = 4000,
   model = MODELS.text,
}: CallOptions) {
   const apiKey = process.env.OPEN_ROUTER_API_KEY;
   if (!apiKey) throw new Error('Missing OPEN_ROUTER_API_KEY');

   const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
         model,
         messages,
         max_tokens: maxTokens,
         stream: true,
         response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(300000),
   });

   if (!response.ok) {
      throw new Error(`OpenRouter error (${response.status}): ${await response.text()}`);
   }

   const reader = response.body!.getReader();
   const decoder = new TextDecoder();
   let full = '';
   let charCount = 0;
   let buf = '';

   process.stdout.write('  ');

   while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';

      for (const line of lines) {
         if (!line.startsWith('data: ')) continue;
         const payload = line.slice(6).trim();
         if (payload === '[DONE]') continue;
         try {
            const chunk = JSON.parse(payload);
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
               full += delta;
               charCount += delta.length;
               process.stdout.write(`\r  ${charCount.toLocaleString()} chars`);
            }
         } catch {
            // skip malformed SSE chunks
         }
      }
   }

   process.stdout.write(`\r  ${charCount.toLocaleString()} chars ✓\n`);

   if (!full) throw new Error('No content returned from OpenRouter');
   return full;
}

export interface RawProfileData {
   username: string;
   full_name: string;
   bio: string;
   comment_pool: string[];
   posts: Array<{ caption: string }>;
   stories: Array<{ description: string }>;
   highlights: Array<{ title: string }>;
}

export async function generateProfileBatch(
   niches: string[],
   count: number,
): Promise<RawProfileData[]> {
   const prompt = `Generate ${count} distinct Instagram profiles. Each must match its assigned niche.
Niches in order: ${niches.join(', ')}

Return a JSON object with a single key "profiles" containing an array of exactly ${count} objects. Each object must have:
{
  "username": string (lowercase, dots/underscores only, max 20 chars, niche-flavored, globally unique),
  "full_name": string (believable Western first + last name),
  "bio": string (1-3 short lines, casual Instagram tone, may include emojis, max 150 chars total),
  "comment_pool": string[] (15 casual Instagram comments, 5-15 words each, niche-appropriate),
  "posts": [ { "caption": string (1-3 sentences + 3-8 hashtags) } ] (at least 8 posts),
  "stories": [ { "description": string (one sentence describing the story image) } ] (at least 12 stories),
  "highlights": [ { "title": string (max 15 chars, niche-appropriate) } ] (at least 4 highlights)
}

Do not include any item specific post captions, just some generic captions that reflect the profile's niche, but play with it. Don't be boring.

Be creative with your profiles. Give them some quirky niche jokes in the comments, the bio, nickname, and the posts.

Return ONLY valid JSON. No markdown fences, no explanation.`;

   const raw = await callOpenRouterStreaming({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 6000,
   });

   let parsed: { profiles?: RawProfileData[] };
   try {
      parsed = JSON.parse(raw);
   } catch {
      throw new Error(`Could not parse JSON from OpenRouter response: ${raw.slice(0, 200)}`);
   }

   const profiles = parsed.profiles;
   if (!Array.isArray(profiles) || profiles.length < count) {
      throw new Error(`Expected ${count} profiles, got ${profiles?.length ?? 0}`);
   }
   return profiles;
}

export async function generateAltText(imageUrl: string) {
   const content = await callOpenRouter({
      messages: [
         {
            role: 'user',
            content: [
               {
                  type: 'text',
                  text: 'Describe this image for an alt text attribute. Be concise (under 80 characters) and focus on what is visually present.',
               },
               { type: 'image_url', image_url: { url: imageUrl } },
            ],
         },
      ],
      maxTokens: 200,
      model: MODELS.vision,
   });
   return content.trim().slice(0, 80);
}
