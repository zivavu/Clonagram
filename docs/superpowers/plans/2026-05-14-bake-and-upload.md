# Bake-and-Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bake all image transforms (crop/pan/zoom/filters/adjustments) into JPEG blobs client-side before upload, and hand raw videos to Mux with trim/mute metadata.

**Architecture:** Images are processed through an OffscreenCanvas + the existing WebGL shader pipeline (`filterShader.ts`), producing a final blob uploaded to Supabase. Videos are uploaded raw to a Mux direct-upload URL; trim, mute, and aspect ratio are passed as metadata for the server to apply. The `useUploadPost` hook orchestrates everything when `SharingStep` mounts.

**Tech Stack:** OffscreenCanvas, WebGL2, `@mux/mux-node` (server, user implements), Supabase Storage, Next.js server actions.

---

> **No test files.** `AGENTS.md` prohibits writing tests. Skip all TDD steps.
> **Linting after every task.** Run `bun biome check --write .` and fix all errors before committing.

---

## File map

| File | Action |
|------|--------|
| `src/components/CreatePostModal/types.ts` | Add `imageDisplayW/H` to `PostMedia`; add `aspectRatio` to `PostData`; add `MediaResult` + `CreatePostParams` types |
| `src/components/CreatePostModal/components/CropStep/components/CropPreview/index.tsx` | Sync `imageDisplayW/H` on resize; disable pan/drag for video |
| `src/components/CreatePostModal/components/CropStep/components/CropControls/index.tsx` | Hide zoom button for video |
| `src/utils/bakeImage.ts` | New — OffscreenCanvas + WebGL crop + filter pipeline |
| `src/actions/uploadVideo.ts` | Add typed signature (user implements body) |
| `src/actions/createPost.ts` | Update to use `CreatePostParams` (user implements body) |
| `src/components/CreatePostModal/hooks/useUploadPost.ts` | Implement upload orchestration hook |
| `src/components/CreatePostModal/components/SharingStep/index.tsx` | Add `postData` prop; call `useUploadPost`; remove fake timer |
| `src/components/CreatePostModal/index.tsx` | Add `aspectRatio` to `postData`; pass `postData` to `SharingStep` |

---

## Task 1 — Update shared types

**Files:**
- Modify: `src/components/CreatePostModal/types.ts`

- [ ] **Step 1: Add fields to `PostMedia`, `PostData`, and new types**

Replace the relevant sections in `src/components/CreatePostModal/types.ts`:

```typescript
export interface PostMedia {
   file: File;
   preview: string;
   type: 'image' | 'video';
   zoom: number;
   panX: number;
   panY: number;
   imageDisplayW: number;  // display-px width of image at zoom=1 inside crop box
   imageDisplayH: number;  // display-px height of image at zoom=1 inside crop box
   filterPreset: string;
   filterStrength: number;
   adjustments: Adjustments;
   tags: TaggedPerson[];
   duration: number;
   coverTime: number;
   trimStart: number;
   trimEnd: number;
   muted: boolean;
   frames?: string[];
   poster?: string;
}
```

```typescript
export interface PostData {
   media: PostMedia[];
   aspectRatio: AspectRatio;
   caption: string | null;
   location: PostLocation | null;
   collaborators: PartialUser[] | [];
   postSettings: PostSettings;
}
```

Add after `PostData`:

```typescript
export type MediaResult =
   | { type: 'image'; path: string }
   | { type: 'video'; uploadId: string };

export interface CreatePostParams extends Omit<PostData, 'media'> {
   mediaResults: MediaResult[];
}
```

Update `createPostMedia` to initialise the two new fields:

```typescript
export function createPostMedia(file: File): PostMedia {
   const isVideo = file.type.startsWith('video/');
   return {
      file,
      preview: URL.createObjectURL(file),
      type: isVideo ? 'video' : 'image',
      zoom: 1,
      panX: 0,
      panY: 0,
      imageDisplayW: 0,
      imageDisplayH: 0,
      filterPreset: 'Original',
      filterStrength: 100,
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      tags: [],
      duration: 0,
      coverTime: 0,
      trimStart: 0,
      trimEnd: 0,
      muted: false,
      frames: undefined,
   };
}
```

- [ ] **Step 2: Lint**

```
bun biome check --write .
```

Fix any errors (TypeScript will now complain that `postData` in `CreatePostModal/index.tsx` is missing `aspectRatio` — leave it red for now; Task 9 fixes it).

- [ ] **Step 3: Commit**

```
git add src/components/CreatePostModal/types.ts
git commit -m "Add imageDisplayW/H, aspectRatio, MediaResult to types"
```

---

## Task 2 — Disable video pan and sync `imageDisplayW/H` in CropPreview

**Files:**
- Modify: `src/components/CreatePostModal/components/CropStep/components/CropPreview/index.tsx`

- [ ] **Step 1: Guard pointer handlers and add sync effect**

The three pointer handlers must bail out early for video. Add a `useEffect` that writes `imageDisplayW/H` back into `PostMedia` whenever `imageDisplaySize` changes.

Full updated file:

```typescript
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { useContainerSize } from '../../../../hooks/useContainerSize';
import { useCropDimensions } from '../../../../hooks/useCropDimensions';
import type { AspectRatio, PostMedia } from '../../../../types';
import PreviewArrows from '../../../PreviewArrows';
import { styles } from './index.stylex';

const GRID_LINES: [number, number, number, number][] = [
   [1, 0, 1, 3],
   [2, 0, 2, 3],
   [0, 1, 3, 1],
   [0, 2, 3, 2],
];

interface CropPreviewProps {
   files: PostMedia[];
   currentIndex: number;
   aspectRatio: AspectRatio;
   onSelectIndex: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
}

interface DragState {
   startX: number;
   startY: number;
   panX: number;
   panY: number;
}

export default function CropPreview({
   files,
   currentIndex,
   aspectRatio,
   onSelectIndex,
   onUpdateFile,
}: CropPreviewProps) {
   const currentFile = files[currentIndex];
   const previewRef = useRef<HTMLDivElement>(null);
   const dragRef = useRef<DragState | null>(null);
   const containerSize = useContainerSize(previewRef);
   const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
   const [isDragging, setIsDragging] = useState(false);
   const { cropBox, imageDisplaySize } = useCropDimensions(containerSize, naturalSize, aspectRatio);

   useEffect(() => {
      if (!imageDisplaySize) return;
      onUpdateFile(currentIndex, {
         imageDisplayW: imageDisplaySize.w,
         imageDisplayH: imageDisplaySize.h,
      });
   // eslint-disable-next-line react-hooks/exhaustive-deps
   // biome-ignore lint/correctness/useExhaustiveDependencies: only sync when display size changes
   }, [imageDisplaySize?.w, imageDisplaySize?.h]);

   const handlePointerDown = (e: React.PointerEvent) => {
      if (currentFile.type === 'video') return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
         startX: e.clientX,
         startY: e.clientY,
         panX: currentFile.panX,
         panY: currentFile.panY,
      };
      setIsDragging(true);
   };

   const handlePointerMove = (e: React.PointerEvent) => {
      if (currentFile.type === 'video') return;
      if (!dragRef.current || !cropBox || !imageDisplaySize) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const maxPanX = Math.max(0, (imageDisplaySize.w * currentFile.zoom - cropBox.width) / 2);
      const maxPanY = Math.max(0, (imageDisplaySize.h * currentFile.zoom - cropBox.height) / 2);
      onUpdateFile(currentIndex, {
         panX: Math.max(-maxPanX, Math.min(maxPanX, dragRef.current.panX + dx)),
         panY: Math.max(-maxPanY, Math.min(maxPanY, dragRef.current.panY + dy)),
      });
   };

   const handlePointerUp = () => {
      if (currentFile.type === 'video') return;
      dragRef.current = null;
      setIsDragging(false);
   };

   const transformStyle = {
      width: imageDisplaySize ? imageDisplaySize.w : '100%',
      height: imageDisplaySize ? imageDisplaySize.h : '100%',
      transform: `translate(${currentFile.panX}px, ${currentFile.panY}px) scale(${currentFile.zoom})`,
      transition: isDragging ? 'none' : 'transform 0.15s ease-out',
   };

   const cropBoxStyle = cropBox
      ? { width: cropBox.width, height: cropBox.height }
      : { width: '100%', height: '100%' };

   return (
      <div ref={previewRef} {...stylex.props(styles.root)}>
         <PreviewArrows
            currentIndex={currentIndex}
            totalFiles={files.length}
            onSelectIndex={onSelectIndex}
         />
         <div
            {...stylex.props(styles.cropContainer)}
            style={cropBoxStyle}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
         >
            {currentFile.type === 'video' ? (
               <video
                  key={currentFile.preview}
                  src={currentFile.preview}
                  muted
                  loop
                  autoPlay
                  playsInline
                  draggable={false}
                  onLoadedMetadata={e =>
                     setNaturalSize({
                        w: e.currentTarget.videoWidth,
                        h: e.currentTarget.videoHeight,
                     })
                  }
                  {...stylex.props(styles.previewImage)}
                  style={transformStyle}
               />
            ) : (
               /* biome-ignore lint/performance/noImgElement: crop preview needs raw img for panning */
               <img
                  key={currentFile.preview}
                  src={currentFile.preview}
                  alt="Preview"
                  draggable={false}
                  onLoad={e =>
                     setNaturalSize({
                        w: e.currentTarget.naturalWidth,
                        h: e.currentTarget.naturalHeight,
                     })
                  }
                  {...stylex.props(styles.previewImage)}
                  style={transformStyle}
               />
            )}
         </div>
         {isDragging && (
            <svg
               viewBox="0 0 3 3"
               preserveAspectRatio="none"
               aria-label="Crop grid"
               {...stylex.props(styles.gridOverlay)}
            >
               <title>Crop grid</title>
               {GRID_LINES.map(([x1, y1, x2, y2]) => (
                  <line
                     key={`${x1}-${y1}-${x2}-${y2}`}
                     x1={x1}
                     y1={y1}
                     x2={x2}
                     y2={y2}
                     stroke="white"
                     strokeOpacity={0.3}
                     strokeWidth={0.005}
                  />
               ))}
            </svg>
         )}
      </div>
   );
}
```

- [ ] **Step 2: Lint**

```
bun biome check --write .
```

- [ ] **Step 3: Commit**

```
git add src/components/CreatePostModal/components/CropStep/components/CropPreview/index.tsx
git commit -m "Disable video pan and sync imageDisplayW/H in CropPreview"
```

---

## Task 3 — Hide zoom button for video in CropControls

**Files:**
- Modify: `src/components/CreatePostModal/components/CropStep/components/CropControls/index.tsx`

- [ ] **Step 1: Wrap zoom button in a conditional**

Find the zoom `controlWrapper` block (lines 111–133 in the original) and wrap it:

```tsx
{currentFile.type !== 'video' && (
   <div {...stylex.props(styles.controlWrapper)}>
      <button
         type="button"
         {...stylex.props(styles.controlButton)}
         onClick={() => setShowZoomSlider(prev => !prev)}
         aria-label="Zoom"
      >
         <MdZoomIn style={{ fontSize: 20 }} />
      </button>
      {showZoomSlider && (
         <div {...stylex.props(styles.zoomPopup)}>
            <input
               type="range"
               min={1}
               max={3}
               step={0.05}
               value={currentFile.zoom}
               onChange={e => onUpdateFile(currentIndex, { zoom: Number(e.target.value) })}
               {...stylex.props(styles.zoomSlider)}
            />
         </div>
      )}
   </div>
)}
```

- [ ] **Step 2: Lint**

```
bun biome check --write .
```

- [ ] **Step 3: Commit**

```
git add src/components/CreatePostModal/components/CropStep/components/CropControls/index.tsx
git commit -m "Hide zoom control for video in CropControls"
```

---

## Task 4 — Create the `bakeImage` utility

**Files:**
- Create: `src/utils/bakeImage.ts`

- [ ] **Step 1: Create the file**

```typescript
import {
   FRAGMENT_SHADER,
   VERTEX_SHADER,
   createCurveTexture,
   createProgram,
   getPreset,
} from './filterShader';
import { type AspectRatio, type PostMedia } from '../components/CreatePostModal/types';

const OUTPUT_SIZES: Record<Exclude<AspectRatio, 'original'>, { w: number; h: number }> = {
   '1:1': { w: 1080, h: 1080 },
   '4:5': { w: 1080, h: 1350 },
   '16:9': { w: 1920, h: 1080 },
   '9:16': { w: 1080, h: 1920 },
};

function outputSize(
   aspectRatio: AspectRatio,
   naturalW: number,
   naturalH: number,
): { w: number; h: number } {
   if (aspectRatio !== 'original') return OUTPUT_SIZES[aspectRatio];
   const maxDim = 2048;
   const longer = Math.max(naturalW, naturalH);
   if (longer <= maxDim) return { w: naturalW, h: naturalH };
   const scale = maxDim / longer;
   return { w: Math.round(naturalW * scale), h: Math.round(naturalH * scale) };
}

function buildVertexBuffer(
   media: PostMedia,
   outW: number,
   outH: number,
): Float32Array {
   const { zoom, panX, panY, imageDisplayW, imageDisplayH } = media;

   if (!imageDisplayW || !imageDisplayH) {
      return new Float32Array([
         -1, -1, 0, 0,   1, -1, 1, 0,  -1,  1, 0, 1,
         -1,  1, 0, 1,   1, -1, 1, 0,   1,  1, 1, 1,
      ]);
   }

   const imgRatio = imageDisplayW / imageDisplayH;
   const cropRatio = outW / outH;

   const cropBoxW = imgRatio >= cropRatio ? imageDisplayH * cropRatio : imageDisplayW;
   const cropBoxH = imgRatio >= cropRatio ? imageDisplayH : imageDisplayW / cropRatio;

   const halfU = cropBoxW / (2 * zoom * imageDisplayW);
   const halfV = cropBoxH / (2 * zoom * imageDisplayH);
   const panU = panX / (zoom * imageDisplayW);
   const panV = panY / (zoom * imageDisplayH);

   const u0 = 0.5 - halfU - panU;
   const u1 = 0.5 + halfU - panU;
   const v0 = 0.5 - halfV - panV;
   const v1 = 0.5 + halfV - panV;

   return new Float32Array([
      -1, -1, u0, v0,   1, -1, u1, v0,  -1,  1, u0, v1,
      -1,  1, u0, v1,   1, -1, u1, v0,   1,  1, u1, v1,
   ]);
}

function loadBitmapTexture(gl: WebGL2RenderingContext, bitmap: ImageBitmap): WebGLTexture {
   const texture = gl.createTexture();
   if (!texture) throw new Error('Failed to create WebGL texture');
   gl.bindTexture(gl.TEXTURE_2D, texture);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
   return texture;
}

export async function bakeImage(media: PostMedia, aspectRatio: AspectRatio): Promise<Blob> {
   const blob = await fetch(media.preview).then(r => r.blob());
   const bitmap = await createImageBitmap(blob);
   const { w: outW, h: outH } = outputSize(aspectRatio, bitmap.width, bitmap.height);

   const canvas = new OffscreenCanvas(outW, outH);
   const gl = canvas.getContext('webgl2', { premultipliedAlpha: false });
   if (!gl) throw new Error('WebGL2 not supported');

   const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
   if (!program) throw new Error('Failed to create WebGL program');
   // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL API, not a React hook
   gl.useProgram(program);

   const vertices = buildVertexBuffer(media, outW, outH);
   const buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

   const posLoc = gl.getAttribLocation(program, 'a_position');
   const uvLoc = gl.getAttribLocation(program, 'a_texCoord');
   gl.enableVertexAttribArray(posLoc);
   gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
   gl.enableVertexAttribArray(uvLoc);
   gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);
   gl.viewport(0, 0, outW, outH);

   const imageTexture = loadBitmapTexture(gl, bitmap);
   bitmap.close();

   const preset = getPreset(media.filterPreset);
   const curvesTexture = createCurveTexture(gl, preset.curves);

   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, imageTexture);
   gl.activeTexture(gl.TEXTURE1);
   gl.bindTexture(gl.TEXTURE_2D, curvesTexture);

   const u = (name: string) => gl.getUniformLocation(program, name);
   gl.uniform1i(u('u_image'), 0);
   gl.uniform1i(u('u_curves'), 1);
   gl.uniform1f(u('u_presetActive'), media.filterPreset === 'Original' ? 0.0 : 1.0);
   gl.uniform1f(u('u_pBrightness'), preset.brightness);
   gl.uniform1f(u('u_pContrast'), preset.contrast);
   gl.uniform1f(u('u_pSaturation'), preset.saturation);
   gl.uniform4fv(u('u_pShadowTint'), preset.shadowTint);
   gl.uniform4fv(u('u_pHighlightTint'), preset.highlightTint);
   gl.uniform4fv(u('u_pFade'), preset.fade);
   gl.uniform3fv(u('u_pColorBalance'), preset.colorBalance);
   gl.uniform1f(u('u_pVignette'), preset.vignette);
   gl.uniform1f(u('u_filterStrength'), media.filterStrength / 100);

   const adj = media.adjustments;
   gl.uniform1f(u('u_brightness'), adj.brightness / 100);
   gl.uniform1f(u('u_contrast'), 1 + adj.contrast / 100);
   gl.uniform1f(u('u_saturation'), 1 + adj.saturation / 100);
   gl.uniform1f(u('u_temperature'), adj.temperature / 100);
   gl.uniform1f(u('u_fade'), adj.fade / 100);
   gl.uniform1f(u('u_vignette'), adj.vignette / 100);

   gl.drawArrays(gl.TRIANGLES, 0, 6);

   gl.deleteTexture(imageTexture);
   gl.deleteTexture(curvesTexture);
   gl.deleteProgram(program);

   return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 });
}
```

> **V-axis note:** If the baked output is vertically mirrored, swap `v0` and `v1` in `buildVertexBuffer`. The `UNPACK_FLIP_Y_WEBGL` + WebGL framebuffer flip should cancel out, but verify with a real image.

- [ ] **Step 2: Lint**

```
bun biome check --write .
```

- [ ] **Step 3: Commit**

```
git add src/utils/bakeImage.ts
git commit -m "Add bakeImage utility with OffscreenCanvas and WebGL"
```

---

## Task 5 — Add typed signatures to server action stubs

**Files:**
- Modify: `src/actions/uploadVideo.ts`
- Modify: `src/actions/createPost.ts`

> These files define the contract that `useUploadPost` calls. The user implements the bodies.

- [ ] **Step 1: Update `uploadVideo.ts`**

```typescript
'use server';
import 'server-only';

import type { AspectRatio } from '../components/CreatePostModal/types';

interface UploadVideoParams {
   trimStart: number;
   trimEnd: number;
   muted: boolean;
   aspectRatio: AspectRatio;
}

interface UploadVideoResult {
   uploadUrl: string;
   uploadId: string;
}

export async function uploadVideo(_params: UploadVideoParams): Promise<UploadVideoResult> {
   throw new Error('Not implemented');
}
```

- [ ] **Step 2: Update `createPost.ts`**

```typescript
'use server';
import 'server-only';

import type { CreatePostParams } from '../components/CreatePostModal/types';
import { createServerClient } from '../lib/supabase/server';

export async function createPost(_params: CreatePostParams): Promise<void> {
   void (await createServerClient());
   throw new Error('Not implemented');
}
```

> The `createServerClient()` call keeps the import alive so the linter doesn't complain. Remove it when you implement the body.

- [ ] **Step 3: Lint**

```
bun biome check --write .
```

- [ ] **Step 4: Commit**

```
git add src/actions/uploadVideo.ts src/actions/createPost.ts
git commit -m "Add typed stubs for uploadVideo and createPost"
```

---

## Task 6 — Implement `useUploadPost`

**Files:**
- Modify: `src/components/CreatePostModal/hooks/useUploadPost.ts`

> **Prerequisite note:** The existing `uploadImage` action uses Supabase's `.update()` which fails for new files. Before this hook can work end-to-end, update `src/actions/uploadImage.ts` to use `.upload()` or `.upsert()` for new post images. That change is yours to make as part of the server-side work.

- [ ] **Step 1: Implement the hook**

```typescript
import { useEffect } from 'react';
import { uploadImage } from '@/src/actions/uploadImage';
import { createPost } from '@/src/actions/createPost';
import { uploadVideo } from '@/src/actions/uploadVideo';
import { bakeImage } from '@/src/utils/bakeImage';
import type { MediaResult, PostData, PostMedia } from '../types';

interface UseUploadPostParams {
   postData: PostData;
   onDone: () => void;
}

async function processMedia(media: PostMedia, postData: PostData): Promise<MediaResult> {
   if (media.type === 'image') {
      const blob = await bakeImage(media, postData.aspectRatio);
      const fileName = `${crypto.randomUUID()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      const data = await uploadImage({ file, bucket: 'posts', fileName });
      return { type: 'image', path: data.path };
   }

   const { uploadUrl, uploadId } = await uploadVideo({
      trimStart: media.trimStart,
      trimEnd: media.trimEnd,
      muted: media.muted,
      aspectRatio: postData.aspectRatio,
   });
   await fetch(uploadUrl, {
      method: 'PUT',
      body: media.file,
      headers: { 'Content-Type': media.file.type },
   });
   return { type: 'video', uploadId };
}

export function useUploadPost({ postData, onDone }: UseUploadPostParams): void {
   // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once on mount
   useEffect(() => {
      async function run() {
         const mediaResults = await Promise.all(
            postData.media.map(media => processMedia(media, postData)),
         );
         await createPost({ ...postData, mediaResults });
         onDone();
      }

      run().catch(() => {});
   }, []);
}
```

- [ ] **Step 2: Lint**

```
bun biome check --write .
```

- [ ] **Step 3: Commit**

```
git add src/components/CreatePostModal/hooks/useUploadPost.ts
git commit -m "Implement useUploadPost hook"
```

---

## Task 7 — Wire `SharingStep`

**Files:**
- Modify: `src/components/CreatePostModal/components/SharingStep/index.tsx`

- [ ] **Step 1: Replace fake timer with `useUploadPost`**

```typescript
'use client';

import * as stylex from '@stylexjs/stylex';
import { useUploadPost } from '../../hooks/useUploadPost';
import type { PostData } from '../../types';
import { shared } from '../Spinner.stylex';
import StepHeader from '../StepHeader';

const spin = stylex.keyframes({
   from: { transform: 'rotate(0deg)' },
   to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
   spinningRing: {
      animationName: spin,
      animationDuration: '0.5s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
   },
});

interface SharingStepProps {
   postData: PostData;
   onDone: () => void;
}

export default function SharingStep({ postData, onDone }: SharingStepProps) {
   useUploadPost({ postData, onDone });

   return (
      <div {...stylex.props(shared.root)}>
         <StepHeader title="Sharing" />
         <div {...stylex.props(shared.body)}>
            <div {...stylex.props(shared.ring, styles.spinningRing)}>
               <div {...stylex.props(shared.ringInner)} />
            </div>
         </div>
      </div>
   );
}
```

- [ ] **Step 2: Lint**

```
bun biome check --write .
```

- [ ] **Step 3: Commit**

```
git add src/components/CreatePostModal/components/SharingStep/index.tsx
git commit -m "Wire SharingStep to useUploadPost"
```

---

## Task 8 — Pass `postData` (with `aspectRatio`) from `CreatePostModal`

**Files:**
- Modify: `src/components/CreatePostModal/index.tsx`

- [ ] **Step 1: Add `aspectRatio` to `postData` and pass it to `SharingStep`**

Find the `postData` object (line 151) and add `aspectRatio`:

```typescript
const postData: PostData = {
   media: files,
   aspectRatio,
   caption,
   location,
   collaborators,
   postSettings,
};
```

Find the `SharingStep` render (line 248) and pass `postData`:

```tsx
{step === 'sharing' && (
   <>
      <Dialog.Description style={{ display: 'none' }}>
         Sharing your post
      </Dialog.Description>
      <SharingStep postData={postData} onDone={() => setStep('post-shared')} />
   </>
)}
```

- [ ] **Step 2: Lint**

```
bun biome check --write .
```

- [ ] **Step 3: Commit**

```
git add src/components/CreatePostModal/index.tsx
git commit -m "Pass postData with aspectRatio to SharingStep"
```

---

## Self-review checklist

- [x] `imageDisplayW/H` added to `PostMedia` and initialised in `createPostMedia` — **Task 1**
- [x] `aspectRatio` added to `PostData` — **Task 1**
- [x] `MediaResult` and `CreatePostParams` defined once in `types.ts`, imported everywhere — **Tasks 1, 5, 6**
- [x] `CropPreview` syncs `imageDisplayW/H` on every `imageDisplaySize` change — **Task 2**
- [x] Video pan disabled in `CropPreview` — **Task 2**
- [x] Zoom button hidden for video in `CropControls` — **Task 3**
- [x] `bakeImage` reads `imageDisplayW/H` and falls back gracefully when they're 0 — **Task 4**
- [x] `bakeImage` closes the `ImageBitmap` and cleans up WebGL resources — **Task 4**
- [x] `uploadVideo` and `createPost` stubs have correct typed signatures — **Task 5**
- [x] `useUploadPost` runs once on mount, parallelises all uploads, calls `onDone` after `createPost` — **Task 6**
- [x] `SharingStep` fake timer removed, `useUploadPost` wired — **Task 7**
- [x] `CreatePostModal` passes `postData` (with `aspectRatio`) to `SharingStep` — **Task 8**
