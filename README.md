# Clonagram

## About the project

Clonagram is a feature-rich clone of Instagram, replicating much of the experience found on the feed, profile, explore, reels, stories, and direct messages screens. It focuses on a polished, responsive interface with dark mode and smooth interactions built from portals, poppers, hover cards, and modals.

The interface closely follows the original design, is fully responsive, and ships with light and dark themes. Components live in small, focused folders, each owning its own markup and styles, and interactivity is pushed to the leaves of a mostly Server Component tree.

Authentication is handled by Supabase, supporting Google OAuth and email sign-up.

Data is stored in Supabase (Postgres, Storage, and Realtime) and videos are processed and streamed through Mux.

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
- Hardened security headers (frame options, content type, COOP/COEP)
- Vercel Speed Insights integration

## Getting Started

### Prerequisites

- **Bun** — package manager and script runner. Install from https://bun.sh/ and make sure it is on your `PATH`.
- **Supabase project** — provides Postgres, Auth, Storage, and Realtime. Create one at https://supabase.com/.
- **Mux account** — required for video uploads and reels playback. Sign up at https://www.mux.com/.
- **Google Cloud project** — needed for Google OAuth. Create OAuth credentials and note the client ID and secret.

### Quick Start for Local Development

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/zivavu/Clonagram.git
   cd Clonagram
   bun install
   ```

2. Copy the environment variable template and fill in your values (see [Environment Variables](#environment-variables) below):

   ```bash
   cp .env.example .env
   ```

3. Log in to the Supabase CLI and link your project:

   ```bash
   bunx supabase login
   bunx supabase link --project-ref <your-project-ref>
   ```

4. Apply the database migrations:

   ```bash
   bunx supabase db push
   ```

5. Configure Supabase Auth:
   - In the Supabase dashboard go to **Authentication → Providers** and enable **Google**. Paste in your Google OAuth client ID and secret.
   - Under **Authentication → URL Configuration**, set the **Site URL** to `http://localhost:3000` for local development (and your production URL when deploying).

6. Create the required Storage buckets in the Supabase dashboard (**Storage → New bucket**):
   - `avatars` — public
   - `posts` — public
   - `stories` — public

7. Generate TypeScript types from your schema (re-run whenever the schema changes):

   ```bash
   bun run db:types
   ```

8. Start the development server:

   ```bash
   bun run dev
   ```

9. Open http://localhost:3000 in your browser.

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=            # Project URL from Supabase dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=# Anon/public key from the same page
SUPABASE_SERVICE_ROLE_KEY=           # Service role key (keep secret — server only)
SUPABASE_ACCESS_TOKEN=               # Personal access token for the Supabase CLI (supabase.com/dashboard/account/tokens)
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET= # Google OAuth client secret

# Mux (video processing & playback)
MUX_TOKEN_ID=                        # From Mux dashboard → Settings → API Access Tokens
MUX_TOKEN_SECRET=
MUX_WEBHOOK_SECRET=                  # From Mux dashboard → Settings → Webhooks

# App
NEXT_PUBLIC_HOSTNAME=                # e.g. http://localhost:3000 or your production domain
```

The following additional variables are only needed when running the seed scripts:

```bash
# Seed scripts
UNSPLASH_ACCESS_KEY=    # From https://unsplash.com/oauth/applications
OPEN_ROUTER_API_KEY=    # From https://openrouter.ai/keys (used for AI-generated captions)
PEXELS_API_KEY=         # From https://www.pexels.com/api/ (used for reel video clips)
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
bun run db:types   # Regenerate database TypeScript types from Supabase
```

## Tests

Playwright E2E tests run against a dedicated Supabase test project. Playwright starts the dev server automatically, so no manual setup is needed before running them.

```bash
bun run test:e2e
```

See `.env.test.example` for the required environment variables and `.github/workflows/e2e.yml` for the CI configuration.

## Seed Scripts

The seed pipeline populates the database with realistic AI-generated profiles, posts, stories, and reels so you can develop against a fully populated app without manual data entry.

It runs in three phases:

| Phase | Script | What it does |
|-------|--------|--------------|
| 1 — Generate | `seed:generate` | Calls OpenRouter to generate profile data (bios, captions, comment pools, reel captions) for each archetype |
| 2 — Process | `seed:process` | Downloads images from Unsplash, runs a vision model to write image-aware captions and alt text, and fetches reel video URLs from Pexels |
| 3 — Seed | `seed:seed` | Uploads everything to Supabase Storage, inserts all database rows, uploads reels to Mux, and wires up the social graph (follows, likes, comments) |

Run all three in sequence:

```bash
bun run seed:all
```

Or run phases individually (output of each phase is saved to `scripts/seed/output/` as JSON):

```bash
bun run seed:generate   # Phase 1: generate profile JSON
bun run seed:process    # Phase 2: download images and fetch videos
bun run seed:seed       # Phase 3: seed the database
```

To remove all AI-generated content (profiles, posts, stories, storage files, and Mux assets):

```bash
bun run seed:cleanup
```

> **Note:** `seed:all` requires `UNSPLASH_ACCESS_KEY`, `OPEN_ROUTER_API_KEY`, and `PEXELS_API_KEY` in addition to the standard Supabase and Mux variables. The vision model used is `qwen/qwen3.6-flash` via OpenRouter.

## Technologies used

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![StyleX](https://img.shields.io/badge/StyleX-5C2D91?style=for-the-badge&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Mux](https://img.shields.io/badge/Mux-FA50B5?style=for-the-badge&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## Contact

Tomasz Kierzenkowski - zivavu@gmail.com

Project Link: https://github.com/zivavu/Clonagram
