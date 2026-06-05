# Clonagram

## About the project

Clonagram is a feature-rich clone of Instagram, replicating much of the experience found on the feed, profile, explore, reels, stories, and direct messages screens. It focuses on a polished, responsive interface with dark mode and smooth interactions built from portals, poppers, hover cards, and modals.

The interface closely follows the original design, is fully responsive, and ships with light and dark themes. Components live in small, focused folders, each owning its own markup and styles, and interactivity is pushed to the leaves of a mostly Server Component tree.

Authentication is handled by Supabase, supporting Google OAuth and email sign-up. Test content can be generated with scripts that use Faker.js to create realistic posts, comments, and media so the app feels populated from the first run.

Data is stored in Supabase (Postgres, Storage, and Realtime), videos are processed and streamed through Mux, and rate limiting is backed by Upstash Redis.

## Implemented Features

### Interface & Design

- Built with StyleX for type-safe, atomic, zero-runtime styling
- Light and dark modes with persisted theme state
- Fully responsive layout with a collapsible main sidebar
- Custom skeletons and gradient loading placeholders
- Modular component structure, each component in its own folder with co-located styles
- React Icons throughout, no inline SVG
- Built on React Compiler for automatic memoization

### Authentication

- Google OAuth sign-in
- Email sign-up and password login
- Session handling via Supabase SSR
- Account editing and account deletion

### Home / Feed

- Post feed with infinite scrolling, sorted by date
- Smart layout adaptation based on media and caption length
- Stories tray at the top of the feed
- Suggestions and contextual sidebars

### Explore

- Discovery grid of posts surfaced from across the app
- Adaptive tile layout for mixed media

### Reels

- Vertical video player powered by Mux
- Volume control and smooth playback
- Infinite scroll through reels

### Stories

- Create stories with image upload
- Full-screen story viewer with view tracking
- Blur placeholders for media
- Automatic expiry (stories disappear after their lifetime)

### Profile

- Rich profile header with avatar and stats
- Posts grid with per-post view modal
- Follower and following lists
- Smart follow / unfollow / requested buttons
- Profile editing with avatar updates
- Profile hover cards for quick previews

### Posts & Media

- Rich post creation flow with:
  - Client-side image crop and filters (canvas / WebGL) baked before upload
  - Multiple image support with a media carousel
  - Video uploads transcoded and streamed via Mux
  - Client-side audio stripping for muted videos using FFmpeg.wasm
  - Location tagging
  - Collaborators and positional image tags
  - Per-post controls (hide likes, turn off comments)
- Full post view modal with carousel navigation
- Complete post management: create, edit, delete

### Social Interactions

- Comments with likes, replies, and deletion
- Likes on posts and comments
- Follow system with follow requests for private accounts
- Follower / following list modals
- Notifications with a dedicated portal and read tracking

### Direct Messages

- One-to-one and group conversations
- Message requests with accept, delete, and block-and-delete
- Primary and general (request) folders
- Image and sticker messages
- Mute, mark read / unread, leave, and rename groups
- Realtime updates powered by Supabase Realtime

### Performance & Security

- Server Components by default with interactivity at the leaves
- TanStack Query for client data fetching and caching
- Infinite scrolling with intersection observers
- Rate limiting via Upstash Redis
- Hardened security headers (frame options, content type, COOP/COEP)
- Vercel Speed Insights integration

## Getting Started

### Prerequisites

- **Bun**: Install from https://bun.sh/ and ensure it is on your PATH. Bun is the package manager and script runner for this project.
- **Supabase project**: Create one at https://supabase.com/ for the database, auth, storage, and realtime.
- **Mux account**: Required for video uploads and reels playback (https://www.mux.com/).
- **Upstash Redis**: Required for rate limiting (https://upstash.com/).

### Quick Start for Local Development

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/zivavu/Clonagram.git
   cd Clonagram
   bun install
   ```

2. Configure environment variables (see below) in a `.env` file.

3. Apply the database migrations to your Supabase project:

   ```bash
   bunx supabase db push
   ```

4. Generate TypeScript types from your database (optional, when the schema changes):

   ```bash
   bun run db:types
   ```

5. Seed the database with test posts, comments, and media:

   ```bash
   bun run scripts/seed-posts.ts
   ```

   To clear seeded posts:

   ```bash
   bun run scripts/reset-posts.ts
   ```

6. Start the development server:

   ```bash
   bun run dev
   ```

7. Open your browser and navigate to http://localhost:3000

### Environment Variables (.env)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ACCESS_TOKEN=
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Mux (video processing & playback)
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_HOSTNAME=
```

## Available Scripts

```bash
bun run dev        # Start the development server
bun run build      # Production build
bun run start      # Start the production server
bun run check      # Format and lint with Biome
bun run lint       # Lint with Biome
bun run format     # Format with Biome
bun run typecheck  # Type-check with the TypeScript compiler
bun run db:types   # Generate database types from Supabase
```

## Technologies used

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![StyleX](https://img.shields.io/badge/StyleX-5C2D91?style=for-the-badge&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Mux](https://img.shields.io/badge/Mux-FA50B5?style=for-the-badge&logoColor=white)
![Upstash](https://img.shields.io/badge/Upstash_Redis-00E9A3?style=for-the-badge&logo=upstash&logoColor=black)
![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Contact

Tomasz Kierzenkowski - zivavu@gmail.com

Project Link: https://github.com/zivavu/Clonagram
