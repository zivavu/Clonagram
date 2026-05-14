# Bake-and-Upload Design

## Scope

Client-side only. The following server actions are **out of scope** — the user implements them:
- `uploadVideo` — creates a Mux direct upload URL
- `createPost` — saves the finished post to the DB
- `mux-webhook` completion — creates the trim clip and saves the playback ID

This spec covers everything the client must do to produce baked files and hand them off.

---

## Overview

When `SharingStep` mounts, `useUploadPost` runs the following in sequence:

1. **Bake all images** — for each image `PostMedia`, produce a cropped + filtered `Blob` via `OffscreenCanvas` + WebGL (the same shader pipeline already in use).
2. **Prepare video uploads** — for each video `PostMedia`, call `uploadVideo` (server action) to get a Mux direct upload URL + upload ID.
3. **Upload in parallel** — baked image blobs go to Supabase via the existing `uploadImage` action; raw video `File`s go directly to Mux via `PUT`.
4. **Save post** — call `createPost` (server action) with the image Supabase paths, Mux upload IDs, and all post metadata.
5. **Signal done** — call `onDone()` to advance to the `post-shared` step.

---

## PostMedia additions (`src/components/CreatePostModal/types.ts`)

Add two fields to `PostMedia` and initialize them in `createPostMedia`:

```typescript
imageDisplayW: number; // display-pixel width of the image at zoom=1 in CropPreview
imageDisplayH: number; // display-pixel height of the image at zoom=1 in CropPreview
```

These mirror `imageDisplaySize` from `useCropDimensions` and are persisted so `bakeImage` can
convert `panX`/`panY` (stored in display pixels) to UV fractions without needing the live DOM.

**`createPostMedia` defaults:** `imageDisplayW: 0, imageDisplayH: 0`

---

## CropPreview changes (`CropPreview/index.tsx`)

### 1. Sync `imageDisplayW/H` into PostMedia

After the `useCropDimensions` call, add a `useEffect` that writes back into `PostMedia` whenever
`imageDisplaySize` changes:

```typescript
useEffect(() => {
   if (!imageDisplaySize) return;
   onUpdateFile(currentIndex, {
      imageDisplayW: imageDisplaySize.w,
      imageDisplayH: imageDisplaySize.h,
   });
}, [imageDisplaySize, currentIndex, onUpdateFile]);
```

### 2. Disable panning for video

Guard the three pointer handlers (`handlePointerDown`, `handlePointerMove`, `handlePointerUp`) so
they do nothing when `currentFile.type === 'video'`:

```typescript
const handlePointerDown = (e: React.PointerEvent) => {
   if (currentFile.type === 'video') return;
   // ...existing logic
};
```

Apply the same guard to `handlePointerMove` and `handlePointerUp`. The grid overlay should also
be suppressed for video (it only shows while dragging, so the guard on `handlePointerDown` is
sufficient via `isDragging`).

---

## CropControls changes (`CropControls/index.tsx`)

Hide the zoom button entirely when the current file is a video. Replace the zoom `controlWrapper`
block with a conditional render:

```tsx
{currentFile.type !== 'video' && (
   <div {...stylex.props(styles.controlWrapper)}>
      {/* zoom button + slider — unchanged */}
   </div>
)}
```

---

## `bakeImage` utility (`src/utils/bakeImage.ts`)

Pure async function, no React, no hooks.

```typescript
export async function bakeImage(media: PostMedia): Promise<Blob>
```

### Steps

1. **Load image** — `createImageBitmap(await fetch(media.preview).then(r => r.blob()))`.

2. **Compute output dimensions** — based on `media.aspectRatio`:
   - `"original"`: natural size capped at 2048px on the longer side (preserve ratio).
   - `"1:1"`: 1080 × 1080
   - `"4:5"`: 1080 × 1350
   - `"16:9"`: 1920 × 1080
   - `"9:16"`: 1080 × 1920

3. **UV crop math** — determines which rectangle of the source image maps to the output canvas.

   Given:
   - `imgW`, `imgH` — natural image dimensions
   - `imageDisplayW`, `imageDisplayH` — from `media` (display-pixel size of image at zoom=1 in crop box)
   - `panX`, `panY` — display-pixel offset (from `media`)
   - `zoom` — from `media`

   The crop box display size (`cropBoxW × cropBoxH`) is derivable from `imageDisplayW/H` and the
   natural ratio:
   - If `imgRatio >= cropRatio`: `cropBoxW = imageDisplayH * cropRatio`, `cropBoxH = imageDisplayH`
   - If `imgRatio < cropRatio`: `cropBoxW = imageDisplayW`, `cropBoxH = imageDisplayW / cropRatio`

   where `cropRatio = outW / outH` and `imgRatio = imgW / imgH`.

   UV corners of the sampled rectangle in source image space (0–1):
   ```
   half_u = cropBoxW / (2 * zoom * imageDisplayW)
   half_v = cropBoxH / (2 * zoom * imageDisplayH)
   pan_u  = panX / (zoom * imageDisplayW)
   pan_v  = panY / (zoom * imageDisplayH)

   u0 = 0.5 - half_u - pan_u   (left)
   u1 = 0.5 + half_u - pan_u   (right)
   v0 = 0.5 - half_v + pan_v   (top)
   v1 = 0.5 + half_v + pan_v   (bottom)
   ```
   Note: `loadTexture` sets `UNPACK_FLIP_Y_WEBGL`, so the stored texture already has v=0 at
   the image top. Verify the v-axis orientation during implementation — swap `v0`/`v1` if the
   output appears vertically mirrored.
   ```
   ```

4. **OffscreenCanvas + WebGL** — reuse the existing `filterShader` exports:
   - `createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)`
   - Upload the `ImageBitmap` as a texture via a modified `loadTexture` (needs to accept
     `ImageBitmap`; extend or duplicate `loadTexture` to call `gl.texImage2D` with `ImageBitmap`).
   - Build the vertex buffer with the four UV corners above (instead of full 0→1 range).
   - `createCurveTexture(gl, getPreset(media.filterPreset).curves)`
   - Set all uniforms exactly as `useWebGLFilter` does.
   - `gl.drawArrays(gl.TRIANGLES, 0, 6)`

5. **Export** — `await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 })`

6. **Clean up** — delete textures and the WebGL program.

### Edge case: `imageDisplayW === 0`

This means the user never reached the CropStep (or the component never measured). Fall back to no
crop: UV corners `(0, 0) → (1, 1)`, i.e. render the full image.

---

## `useUploadPost` hook (`src/components/CreatePostModal/hooks/useUploadPost.ts`)

```typescript
interface UseUploadPostParams {
   postData: PostData;
   onDone: () => void;
}

export function useUploadPost({ postData, onDone }: UseUploadPostParams): void
```

Runs on mount via `useEffect`. All uploads are parallelised with `Promise.all` over `postData.media`.

### Per-image path
1. `bakeImage(media)` → `Blob`
2. `new File([blob], 'image.jpg', { type: 'image/jpeg' })`
3. `uploadImage({ file, bucket: 'posts', fileName: crypto.randomUUID() + '.jpg' })` (existing action)
4. Collect the Supabase storage path.

### Per-video path
1. Call `uploadVideo({ trimStart: media.trimStart, trimEnd: media.trimEnd, muted: media.muted, aspectRatio: media.aspectRatio })` — server action returns `{ uploadUrl: string; uploadId: string }`.
2. `await fetch(uploadUrl, { method: 'PUT', body: media.file, headers: { 'Content-Type': media.file.type } })`
3. Collect the `uploadId`.

### After all uploads
Call `createPost` with the assembled results and post metadata, then call `onDone()`.

### Error handling
If any upload throws, propagate the error (do not call `onDone`). The `SharingStep` should handle
the error state (out of scope for this spec — user decides).

---

## `SharingStep` wiring (`SharingStep/index.tsx`)

Add `postData: PostData` to `SharingStepProps`. Replace the fake `setTimeout` timer with
`useUploadPost({ postData, onDone })`. Remove the timer entirely.

The spinner markup stays as-is — it naturally runs while the upload is in progress.

---

## `CreatePostModal` wiring (`CreatePostModal/index.tsx`)

Pass `postData` to `SharingStep` when rendering that step. `postData` is already assembled in the
modal's state — this is a single prop addition.

---

## Server action interfaces (reference only — user implements)

`useUploadPost` depends on these signatures:

```typescript
// src/actions/uploadVideo.ts
interface UploadVideoParams {
   trimStart: number;
   trimEnd: number;
   muted: boolean;
   aspectRatio: AspectRatio;
}
interface UploadVideoResult {
   uploadUrl: string;  // Mux direct upload URL (PUT target)
   uploadId: string;   // Mux upload ID (for webhook to retrieve asset ID)
}
export async function uploadVideo(params: UploadVideoParams): Promise<UploadVideoResult>

// src/actions/createPost.ts
interface MediaResult =
   | { type: 'image'; path: string }       // Supabase storage path
   | { type: 'video'; uploadId: string };  // Mux upload ID

interface CreatePostParams extends Omit<PostData, 'media'> {
   mediaResults: MediaResult[];
}
export async function createPost(params: CreatePostParams): Promise<void>
```

---

## Files changed / created

| File | Change |
|------|--------|
| `src/components/CreatePostModal/types.ts` | Add `imageDisplayW`, `imageDisplayH` to `PostMedia` and `createPostMedia` |
| `src/components/CreatePostModal/components/CropStep/components/CropPreview/index.tsx` | Sync `imageDisplayW/H`; disable pan for video |
| `src/components/CreatePostModal/components/CropStep/components/CropControls/index.tsx` | Hide zoom button for video |
| `src/utils/bakeImage.ts` | New file — image baking utility |
| `src/components/CreatePostModal/hooks/useUploadPost.ts` | Implement upload orchestration |
| `src/components/CreatePostModal/components/SharingStep/index.tsx` | Add `postData` prop; wire `useUploadPost` |
| `src/components/CreatePostModal/index.tsx` | Pass `postData` to `SharingStep` |
