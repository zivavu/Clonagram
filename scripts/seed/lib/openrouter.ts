const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openrouter/auto';

type TextPart = { type: 'text'; text: string };
type ImagePart = { type: 'image_url'; image_url: { url: string } };
type MessageContent = string | Array<TextPart | ImagePart>;

type Message = {
   role: 'user' | 'assistant' | 'system';
   content: MessageContent;
};

async function callOpenRouter(messages: Message[], maxTokens = 4000) {
   const apiKey = process.env.OPEN_ROUTER_API_KEY;
   if (!apiKey) throw new Error('Missing OPEN_ROUTER_API_KEY');

   const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens }),
      signal: AbortSignal.timeout(120000),
   });

   if (!response.ok) {
      throw new Error(`OpenRouter error (${response.status}): ${await response.text()}`);
   }

   const data = await response.json();
   const content = data.choices?.[0]?.message?.content;
   if (!content) throw new Error('No content returned from OpenRouter');
   return content as string;
}

export interface RawProfileData {
   username: string;
   full_name: string;
   bio: string;
   website: string | null;
   comment_pool: string[];
   posts: Array<{ caption: string; aspect_ratio: string }>;
   stories: Array<{ description: string }>;
   highlights: Array<{ title: string; story_indices: number[] }>;
}

export async function generateProfileBatch(
   niches: string[],
   count: number,
): Promise<RawProfileData[]> {
   const prompt = `Generate ${count} distinct Instagram profiles. Each must match its assigned niche.
Niches in order: ${niches.join(', ')}

Return a JSON array of exactly ${count} objects. Each object must have:
{
  "username": string (lowercase, dots/underscores only, max 20 chars, niche-flavored, globally unique),
  "full_name": string (believable Western first + last name),
  "bio": string (1-3 short lines, casual Instagram tone, may include emojis, max 150 chars total),
  "website": string (believable domain like "username.com" or "brand.co") or null,
  "comment_pool": string[] (15 casual Instagram comments, 5-15 words each, niche-appropriate),
  "posts": [ { "caption": string (1-3 sentences + 3-8 hashtags), "aspect_ratio": "1:1"|"4:5"|"16:9"|"9:16" } ]
    (6-12 posts, weight aspect_ratio toward "1:1" and "4:5"),
  "stories": [ { "description": string (one sentence describing the story image) } ]
    (1-14 stories),
  "highlights": [ { "title": string (max 15 chars, niche-appropriate), "story_indices": number[] (1-3 indices, 0-based) } ]
    (1-3 highlights)
}

Return ONLY valid JSON array. No markdown fences, no explanation.`;

   const raw = await callOpenRouter([{ role: 'user', content: prompt }], 16000);

   const match = raw.match(/\[[\s\S]*\]/);
   if (!match) throw new Error(`Could not extract JSON from OpenRouter response: ${raw.slice(0, 200)}`);

   const parsed = JSON.parse(match[0]) as RawProfileData[];
   if (!Array.isArray(parsed) || parsed.length < count) {
      throw new Error(`Expected ${count} profiles, got ${parsed.length ?? 0}`);
   }
   return parsed;
}

export async function generateAltText(imageUrl: string) {
   const content = await callOpenRouter(
      [
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
      200,
   );
   return content.trim().slice(0, 80);
}
