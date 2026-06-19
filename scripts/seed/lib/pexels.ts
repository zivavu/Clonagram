import type { SeedNiche } from '../types';

const PEXELS_VIDEOS_API = 'https://api.pexels.com/videos';

const NICHE_VIDEO_QUERIES: Record<SeedNiche, string[]> = {
   travel: ['mountain landscape aerial', 'city skyline timelapse', 'tropical beach ocean waves'],
   fitness: ['gym workout training', 'outdoor running trail', 'weightlifting exercise'],
   food: ['restaurant cooking chef', 'coffee latte barista', 'street food market stall'],
   fashion: ['model street style walking', 'fashion boutique clothing', 'runway show'],
   art: ['artist painting studio', 'sculpture gallery exhibition', 'street art mural'],
   photography: ['photographer camera nature', 'drone aerial footage', 'photo studio lighting'],
   lifestyle: ['morning coffee apartment', 'cozy interior reading', 'urban walk city'],
   music: ['concert live music performance', 'guitar playing studio', 'DJ set club'],
   tech: ['coding laptop office', 'smart device technology', 'programming screen'],
   wellness: ['yoga meditation sunset', 'spa relaxation water', 'nature walk forest path'],
};

interface PexelsVideoFile {
   id: number;
   quality: string;
   file_type: string;
   width: number | null;
   height: number | null;
   link: string;
}

interface PexelsVideo {
   id: number;
   width: number;
   height: number;
   duration: number;
   video_files: PexelsVideoFile[];
}

interface PexelsSearchResponse {
   videos: PexelsVideo[];
   total_results: number;
}

export interface PexelsVideoResult {
   url: string;
   width: number;
   height: number;
   duration: number;
}

async function pexelsGet<T>(path: string): Promise<T> {
   const key = process.env.PEXELS_API_KEY;
   if (!key) throw new Error('Missing PEXELS_API_KEY');

   const res = await fetch(`${PEXELS_VIDEOS_API}${path}`, {
      headers: { Authorization: key },
      signal: AbortSignal.timeout(30000),
   });

   if (!res.ok) throw new Error(`Pexels (${res.status}): ${await res.text()}`);
   return res.json() as Promise<T>;
}

const videoCache = new Map<string, PexelsVideo[]>();

export async function getNicheVideo(niche: SeedNiche): Promise<PexelsVideoResult> {
   const queries = NICHE_VIDEO_QUERIES[niche];
   const query = queries[Math.floor(Math.random() * queries.length)];
   const cacheKey = `${niche}:${query}`;

   if (!videoCache.has(cacheKey)) {
      const page = Math.floor(Math.random() * 3) + 1;
      const data = await pexelsGet<PexelsSearchResponse>(
         `/search?query=${encodeURIComponent(query)}&per_page=15&page=${page}&min_duration=5&max_duration=60&orientation=portrait`,
      );
      if (!data.videos.length) throw new Error(`No Pexels videos found for query: ${query}`);
      videoCache.set(cacheKey, data.videos);
   }

   const videos = videoCache.get(cacheKey)!;
   const video = videos[Math.floor(Math.random() * videos.length)];

   const hdFile =
      video.video_files.find(f => f.quality === 'hd' && f.file_type === 'video/mp4') ??
      video.video_files.find(f => f.file_type === 'video/mp4');

   if (!hdFile) throw new Error(`No MP4 file found for Pexels video ${video.id}`);

   return {
      url: hdFile.link,
      width: hdFile.width ?? video.width,
      height: hdFile.height ?? video.height,
      duration: video.duration,
   };
}
