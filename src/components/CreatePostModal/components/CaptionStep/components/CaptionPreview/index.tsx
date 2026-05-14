'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import { IoPlay } from 'react-icons/io5';
import UserAutocomplete from '@/src/components/UserAutocomplete';
import type { PartialUser } from '@/src/types/global';
import { useContainerSize } from '../../../../hooks/useContainerSize';
import { useCropDimensions } from '../../../../hooks/useCropDimensions';
import { useMediaNaturalSize } from '../../../../hooks/useMediaNaturalSize';
import { useWebGLFilter } from '../../../../hooks/useWebGLFilter';
import type { AspectRatio, PostMedia } from '../../../../types';
import PreviewArrows from '../../../PreviewArrows';
import TagPin from '../TagPin';

import { styles } from './index.stylex';

interface CaptionPreviewProps {
   files: PostMedia[];
   currentIndex: number;
   aspectRatio: AspectRatio;
   onSelectIndex: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
}

interface Size {
   w: number;
   h: number;
}

interface FilteredImageProps {
   file: PostMedia;
   imageDisplaySize: Size | null;
}

function FilteredImage({ file, imageDisplaySize }: FilteredImageProps) {
   const { canvasRef } = useWebGLFilter({
      src: file.preview,
      width: imageDisplaySize?.w ?? 0,
      height: imageDisplaySize?.h ?? 0,
      adjustments: file.adjustments,
      filterPreset: file.filterPreset,
      filterStrength: file.filterStrength,
   });
   return (
      <canvas
         ref={canvasRef}
         draggable={false}
         {...stylex.props(styles.previewImage)}
         style={{
            width: imageDisplaySize ? imageDisplaySize.w : '100%',
            height: imageDisplaySize ? imageDisplaySize.h : '100%',
            transform: `translate(${file.panX}px, ${file.panY}px) scale(${file.zoom})`,
         }}
      />
   );
}

function getPopperStyle(pos: { x: number; y: number }): React.CSSProperties {
   const style: React.CSSProperties = { position: 'absolute' };
   if (pos.x > 55) style.right = `${100 - pos.x}%`;
   else style.left = `${pos.x}%`;
   if (pos.y > 55) style.bottom = `${100 - pos.y}%`;
   else style.top = `${pos.y}%`;
   return style;
}

export default function CaptionPreview({
   files,
   currentIndex,
   aspectRatio,
   onSelectIndex,
   onUpdateFile,
}: CaptionPreviewProps) {
   const currentFile = files[currentIndex];
   const previewRef = useRef<HTMLDivElement>(null);
   const videoRef = useRef<HTMLVideoElement>(null);
   const containerSize = useContainerSize(previewRef);
   const naturalSize = useMediaNaturalSize(currentFile.preview, currentFile.type);
   const { cropBox, imageDisplaySize } = useCropDimensions(containerSize, naturalSize, aspectRatio);
   const [tagPopper, setTagPopper] = useState<{
      previewKey: string;
      x: number;
      y: number;
   } | null>(null);
   const activePopper = tagPopper?.previewKey === currentFile.preview ? tagPopper : null;

   const [isPlaying, setIsPlaying] = useState(false);

   const trimStartRef = useRef(currentFile.trimStart);
   const trimEndRef = useRef(currentFile.trimEnd);
   trimStartRef.current = currentFile.trimStart;
   trimEndRef.current = currentFile.trimEnd;

   const handleVideoClick = () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
         video.play().catch(() => {});
      } else {
         video.pause();
      }
   };

   const isImage = currentFile.type === 'image';
   const hasFilters =
      currentFile.filterPreset !== 'Original' ||
      Object.values(currentFile.adjustments).some(v => v !== 0);
   const useCanvas = isImage && hasFilters;

   const previewStyle = {
      width: imageDisplaySize ? imageDisplaySize.w : '100%',
      height: imageDisplaySize ? imageDisplaySize.h : '100%',
      transform: `translate(${currentFile.panX}px, ${currentFile.panY}px) scale(${currentFile.zoom})`,
   };

   const cropBoxStyle = cropBox
      ? { width: cropBox.width, height: cropBox.height }
      : { width: '100%', height: '100%' };

   const handleImageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTagPopper({ previewKey: currentFile.preview, x, y });
   };

   const handleTagSelect = (user: PartialUser) => {
      if (!activePopper || currentFile.tags.some(t => t.user.id === user.id)) {
         setTagPopper(null);
         return;
      }
      onUpdateFile(currentIndex, {
         tags: [...currentFile.tags, { user, x: activePopper.x, y: activePopper.y }],
      });
      setTagPopper(null);
   };

   const handleRemoveTag = (userId: string) => {
      onUpdateFile(currentIndex, {
         tags: currentFile.tags.filter(t => t.user.id !== userId),
      });
   };

   const handleMoveTag = (userId: string, x: number, y: number) => {
      onUpdateFile(currentIndex, {
         tags: currentFile.tags.map(t => (t.user.id === userId ? { ...t, x, y } : t)),
      });
   };

   return (
      <div ref={previewRef} {...stylex.props(styles.root)}>
         <PreviewArrows
            currentIndex={currentIndex}
            totalFiles={files.length}
            onSelectIndex={onSelectIndex}
         />

         {isImage ? (
            <button
               type="button"
               {...stylex.props(styles.cropContainer)}
               style={cropBoxStyle}
               onClick={handleImageClick}
            >
               {useCanvas ? (
                  <FilteredImage file={currentFile} imageDisplaySize={imageDisplaySize} />
               ) : (
                  /* biome-ignore lint/performance/noImgElement: preview needs raw img for pan/zoom transform */
                  <img
                     key={currentFile.preview}
                     src={currentFile.preview}
                     alt="Preview"
                     draggable={false}
                     {...stylex.props(styles.previewImage)}
                     style={previewStyle}
                  />
               )}
            </button>
         ) : (
            <div
               {...stylex.props(styles.cropContainer, styles.cropContainerVideo)}
               style={cropBoxStyle}
            >
               <video
                  ref={videoRef}
                  key={currentFile.preview}
                  src={currentFile.preview}
                  muted={currentFile.muted}
                  playsInline
                  poster={currentFile.poster ?? undefined}
                  draggable={false}
                  onPlay={() => setIsPlaying(true)}
                  onLoadedData={() => {
                     const video = videoRef.current;
                     if (video) video.currentTime = trimStartRef.current;
                  }}
                  onTimeUpdate={() => {
                     const video = videoRef.current;
                     if (!video || video.paused || trimEndRef.current <= 0) return;
                     if (video.currentTime >= trimEndRef.current) {
                        video.currentTime = trimStartRef.current;
                     }
                  }}
                  {...stylex.props(styles.previewImage)}
                  style={previewStyle}
               />
               <button
                  type="button"
                  {...stylex.props(styles.videoOverlayBtn)}
                  onClick={handleVideoClick}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
               >
                  {!isPlaying && (
                     <div {...stylex.props(styles.playButton)}>
                        <IoPlay fontSize={80} />
                     </div>
                  )}
               </button>
            </div>
         )}

         {isImage &&
            currentFile.tags.map(tag => (
               <TagPin
                  key={tag.user.id}
                  tag={tag}
                  onRemove={() => handleRemoveTag(tag.user.id)}
                  onMove={(x, y) => handleMoveTag(tag.user.id, x, y)}
               />
            ))}

         {isImage && activePopper && (
            <div
               role="dialog"
               {...stylex.props(styles.tagPopper)}
               style={getPopperStyle(activePopper)}
            >
               <UserAutocomplete
                  onSelect={handleTagSelect}
                  onDismiss={() => setTagPopper(null)}
                  header={<span>Tag:</span>}
                  placeholder="Search..."
                  autoFocus
               />
            </div>
         )}

         {isImage && !activePopper && currentFile.tags.length === 0 && (
            <div {...stylex.props(styles.tagHint)}>Click photo to tag people</div>
         )}
      </div>
   );
}
