import { getMuxThumbnailUrl } from './mux';

interface PostMediaSource {
   images: { position: number; url: string | null }[];
   videos: { position: number; mux_playback_id: string | null }[];
}

export function getPostThumbnail(post: PostMediaSource): string | null {
   const items = [
      ...post.images.map(img => ({ position: img.position, url: img.url })),
      ...post.videos
         .filter((v): v is { position: number; mux_playback_id: string } => !!v.mux_playback_id)
         .map(v => ({
            position: v.position,
            url: getMuxThumbnailUrl(v.mux_playback_id),
         })),
   ].sort((a, b) => a.position - b.position);

   return items[0]?.url ?? null;
}
