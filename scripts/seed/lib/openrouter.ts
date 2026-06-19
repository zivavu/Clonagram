const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODELS = {
   text: 'meta-llama/llama-3.1-8b-instruct',
   vision: 'google/gemma-4-26b-a4b-it',
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
   if (!content) {
      throw new Error(
         `OpenRouter returned no content (model=${model}): ${JSON.stringify(data).slice(0, 300)}`,
      );
   }
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

export interface ProfileSpec {
   niche: string;
   archetype: string;
}

export interface RawProfileData {
   username: string;
   full_name: string;
   bio: string;
   website?: string;
   comment_pool: string[];
   posts: Array<{ caption: string }>;
   stories: Array<{ description: string }>;
   highlights: Array<{ title: string }>;
   reels: Array<{ caption: string }>;
}

export async function generateProfileBatch(specs: ProfileSpec[]): Promise<RawProfileData[]> {
   const count = specs.length;
   const specList = specs
      .map((s, i) => `  ${i + 1}. niche=${s.niche}, archetype=${s.archetype}`)
      .join('\n');

   const prompt = `Generate ${count} distinct Instagram profiles. Each must match its assigned niche and archetype.

Profiles:
${specList}

Archetypes guide the persona's voice and engagement style:
- influencer: polished professional creator, uses niche jargon, aspirational tone
- regular: casual everyday enthusiast sharing their hobby or interest
- lurker: rarely posts, simple language, more of a consumer than creator
- dormant: barely active, may have had a phase, posts are sparse

Return a JSON object with a single key "profiles" containing an array of exactly ${count} objects. Each object must have:
{
  "username": string (lowercase, dots/underscores only, max 20 chars, niche-flavored, globally unique),
  "full_name": string (believable Western first + last name),
  "bio": string (1-3 short lines, casual Instagram tone, may include emojis, max 150 chars total),
  "website": string | null (a REAL, actually existing website URL relevant to the profile's niche — a well-known brand site, a real creator's site, a popular niche magazine. Include https://. Must actually exist on the internet. null if unsure),
  "comment_pool": string[] (15 casual Instagram comments this persona would leave on other posts — match their archetype voice, bio quirks, and niche; 5-15 words each; mix reactions, questions, and compliments; influencers sound informed, lurkers sound casual, dormant sound generic),
  "posts": [ { "caption": string (1-2 sentences + 3-6 hashtags, niche-appropriate, in the persona's voice) } ] (at least 8 posts),
  "stories": [ { "description": string (one sentence describing the story image) } ] (at least 12 stories),
  "highlights": [ { "title": string (max 15 chars, niche-appropriate) } ] (at least 4 highlights),
  "reels": [ { "caption": string (punchy 1-sentence reel caption + 2-3 hashtags, action-oriented) } ] (at least 5 reels; can be empty array for lurker/dormant archetypes)
}

Give profiles some personality quirks in their bio and comments. Don't be generic.

Return ONLY valid JSON. No markdown fences, no explanation.`;

   const raw = await callOpenRouterStreaming({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 8000,
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

   return profiles.map(p => ({
      ...p,
      reels: Array.isArray(p.reels) ? p.reels : [],
   }));
}

export async function generatePostContent(
   imageUrl: string,
   niche: string,
   bio: string,
): Promise<{ caption: string; altText: string; contextualComments: string[] }> {
   try {
      const raw = await callOpenRouter({
         messages: [
            {
               role: 'user',
               content: [
                  {
                     type: 'text',
                     text: `You are analyzing an Instagram post image for a ${niche} content creator whose bio is: "${bio}".

Return a JSON object with exactly these keys:
{
  "caption": "Instagram caption (1-2 sentences + 3-5 hashtags) that specifically describes what's in this image, written in the creator's voice",
  "alt_text": "concise image description for accessibility, under 80 characters, focus on what is visually present",
  "comments": ["comment 1", "comment 2", "comment 3"] (3 short casual comments from other Instagram users, 5-15 words each, specifically referencing something visible in the image, no hashtags)
}

Return ONLY valid JSON.`,
                  },
                  { type: 'image_url', image_url: { url: imageUrl } },
               ],
            },
         ],
         maxTokens: 400,
         model: MODELS.vision,
      });

      try {
         const parsed = JSON.parse(raw.trim());
         return {
            caption: (parsed.caption as string | undefined)?.trim() ?? '',
            altText: (parsed.alt_text as string | undefined)?.trim().slice(0, 80) ?? '',
            contextualComments: Array.isArray(parsed.comments)
               ? (parsed.comments as string[]).filter(c => typeof c === 'string')
               : [],
         };
      } catch {
         return { caption: raw.trim(), altText: '', contextualComments: [] };
      }
   } catch (err) {
      console.warn(
         `  generatePostContent failed (${niche}): ${err instanceof Error ? err.message : err}`,
      );
      return { caption: '', altText: '', contextualComments: [] };
   }
}

export async function generateAltText(imageUrl: string) {
   try {
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
   } catch (err) {
      console.warn(`  generateAltText failed: ${err instanceof Error ? err.message : err}`);
      return '';
   }
}
