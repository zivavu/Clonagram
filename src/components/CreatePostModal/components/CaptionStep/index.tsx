'use client';

import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import CarouselArrow from '@/src/components/CarouselArrow';
import UserAutocomplete from '@/src/components/UserAutocomplete';
import { useWebGLFilter } from '@/src/hooks/useWebGLFilter';
import type { PartialUser } from '@/src/types/global';
import type { AspectRatio, PostMedia, PostSettings } from '../../types';
import { RATIO_NUMERIC } from '../../types';
import CaptionPanel from './components/CaptionPanel';
import TagPin from './components/TagPin';
import { styles } from './index.stylex';

interface CaptionStepProps {
   files: PostMedia[];
   currentIndex: number;
   onSelectIndex: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
   onBack: () => void;
   onShare: () => void;
   aspectRatio: AspectRatio;
   caption: string;
   onCaptionChange: (caption: string) => void;
   location: string | null;
   onLocationChange: (location: string | null) => void;
   collaborators: PartialUser[];
   onCollaboratorsChange: (collaborators: PartialUser[]) => void;
   postSettings: PostSettings;
   onPostSettingsChange: (settings: PostSettings) => void;
}

interface FilteredPreviewProps {
   file: PostMedia;
   cropBox: { width: number; height: number } | null;
}

function FilteredPreview({ file, cropBox }: FilteredPreviewProps) {
   const { canvasRef } = useWebGLFilter({
      src: file.preview,
      width: cropBox?.width ?? 0,
      height: cropBox?.height ?? 0,
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
            transform: `translate(${file.panX}px, ${file.panY}px) scale(${file.zoom})`,
         }}
      />
   );
}

export default function CaptionStep({
   files,
   currentIndex,
   onSelectIndex,
   onUpdateFile,
   onBack,
   onShare,
   aspectRatio,
   caption,
   onCaptionChange,
   location,
   onLocationChange,
   collaborators,
   onCollaboratorsChange,
   postSettings,
   onPostSettingsChange,
}: CaptionStepProps) {
   const currentFile = files[currentIndex];
   const previewRef = useRef<HTMLDivElement>(null);
   const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
   const [tagPopper, setTagPopper] = useState<{ x: number; y: number } | null>(null);

   const measureContainer = useCallback(() => {
      const el = previewRef.current;
      if (!el) return;
      setContainerSize({ w: el.clientWidth, h: el.clientHeight });
   }, []);

   useEffect(() => {
      measureContainer();
      window.addEventListener('resize', measureContainer);
      return () => window.removeEventListener('resize', measureContainer);
   }, [measureContainer]);

   const cropBox = (() => {
      if (containerSize.w === 0) return null;
      const ratio = RATIO_NUMERIC[aspectRatio];
      const maxW = containerSize.w;
      const maxH = containerSize.h;
      if (!ratio) return { width: maxW, height: maxH };
      let w: number;
      let h: number;
      if (ratio >= 1) {
         w = Math.min(maxW, maxH * ratio);
         h = w / ratio;
      } else {
         h = Math.min(maxH, maxW / ratio);
         w = h * ratio;
      }
      return { width: Math.round(w), height: Math.round(h) };
   })();

   const handleImageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTagPopper({ x, y });
   };

   const handleTagSelect = (user: PartialUser) => {
      if (!tagPopper || currentFile.tags.some(t => t.user.id === user.id)) {
         setTagPopper(null);
         return;
      }
      onUpdateFile(currentIndex, {
         tags: [...currentFile.tags, { user, x: tagPopper.x, y: tagPopper.y }],
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

   const getPopperStyle = (pos: { x: number; y: number }): React.CSSProperties => {
      const style: React.CSSProperties = { position: 'absolute' };
      if (pos.x > 55) {
         style.right = `${100 - pos.x}%`;
      } else {
         style.left = `${pos.x}%`;
      }
      if (pos.y > 55) {
         style.bottom = `${100 - pos.y}%`;
      } else {
         style.top = `${pos.y}%`;
      }
      return style;
   };

   const isFirst = currentIndex === 0;
   const isLast = currentIndex === files.length - 1;
   const hasMultiple = files.length > 1;

   const isImage = currentFile.file.type.startsWith('image/');
   const hasFilters =
      currentFile.filterPreset !== 'Original' || Object.values(currentFile.adjustments).some(v => v !== 0);
   const useCanvas = isImage && hasFilters;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <button type="button" {...stylex.props(styles.headerButton)} onClick={onBack} aria-label="Back">
               <IoArrowBack style={{ fontSize: 24 }} />
            </button>
            <span {...stylex.props(styles.headerTitle)}>Create new post</span>
            <button type="button" {...stylex.props(styles.shareButton)} onClick={onShare}>
               Share
            </button>
         </div>

         <div {...stylex.props(styles.body)}>
            <div ref={previewRef} {...stylex.props(styles.previewSection)}>
               {hasMultiple && !isFirst && (
                  <div {...stylex.props(styles.arrowLeft)}>
                     <CarouselArrow direction="left" onClick={() => onSelectIndex(currentIndex - 1)} />
                  </div>
               )}
               {hasMultiple && !isLast && (
                  <div {...stylex.props(styles.arrowRight)}>
                     <CarouselArrow direction="right" onClick={() => onSelectIndex(currentIndex + 1)} />
                  </div>
               )}

               <button
                  type="button"
                  {...stylex.props(styles.cropContainer)}
                  style={cropBox ? { width: cropBox.width, height: cropBox.height } : { width: '100%', height: '100%' }}
                  onClick={handleImageClick}
               >
                  {useCanvas ? (
                     <FilteredPreview file={currentFile} cropBox={cropBox} />
                  ) : (
                     /* biome-ignore lint/performance/noImgElement: preview needs raw img for pan/zoom transform */
                     <img
                        src={currentFile.preview}
                        alt="Preview"
                        draggable={false}
                        {...stylex.props(styles.previewImage)}
                        style={{
                           transform: `translate(${currentFile.panX}px, ${currentFile.panY}px) scale(${currentFile.zoom})`,
                        }}
                     />
                  )}
               </button>
               {currentFile.tags.map(tag => (
                  <TagPin
                     key={tag.user.id}
                     tag={tag}
                     onRemove={() => handleRemoveTag(tag.user.id)}
                     onMove={(x, y) => handleMoveTag(tag.user.id, x, y)}
                  />
               ))}
               {tagPopper && (
                  <div role="dialog" {...stylex.props(styles.tagPopper)} style={getPopperStyle(tagPopper)}>
                     <UserAutocomplete
                        onSelect={handleTagSelect}
                        onDismiss={() => setTagPopper(null)}
                        header={<span>Tag:</span>}
                        placeholder="Search..."
                        autoFocus
                     />
                  </div>
               )}

               {!tagPopper && currentFile.tags.length === 0 && (
                  <div {...stylex.props(styles.tagHint)}>Click photo to tag people</div>
               )}
            </div>

            <CaptionPanel
               caption={caption}
               onCaptionChange={onCaptionChange}
               location={location}
               onLocationChange={onLocationChange}
               collaborators={collaborators}
               onCollaboratorsChange={onCollaboratorsChange}
               postSettings={postSettings}
               onPostSettingsChange={onPostSettingsChange}
               files={files}
            />
         </div>
      </div>
   );
}
