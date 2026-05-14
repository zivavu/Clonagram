import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { MdAdd, MdOutlineAspectRatio, MdZoomIn } from 'react-icons/md';
import { PiImagesSquareLight } from 'react-icons/pi';
import CarouselArrow from '@/src/components/CarouselArrow';
import type { AspectRatio, PostMedia } from '../../../../types';
import { styles } from './index.stylex';

const ASPECT_RATIOS: { key: AspectRatio; label: string; icon: string }[] = [
   { key: 'original', label: 'Original', icon: '3/2' },
   { key: '1:1', label: '1:1', icon: '1/1' },
   { key: '4:5', label: '4:5', icon: '4/5' },
   { key: '16:9', label: '16:9', icon: '16/9' },
   { key: '9:16', label: '9:16', icon: '9/16' },
];

const MAX_FILES = 10;
const SCROLL_DISTANCE = 200;

interface CropControlsProps {
   files: PostMedia[];
   currentIndex: number;
   aspectRatio: AspectRatio;
   onAspectRatioChange: (ratio: AspectRatio) => void;
   onSelectIndex: (index: number) => void;
   onRemoveFile: (index: number) => void;
   onReorderFiles: (fromIndex: number, toIndex: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
   onAddFiles: () => void;
}

export default function CropControls({
   files,
   currentIndex,
   aspectRatio,
   onAspectRatioChange,
   onSelectIndex,
   onRemoveFile,
   onReorderFiles,
   onUpdateFile,
   onAddFiles,
}: CropControlsProps) {
   const currentFile = files[currentIndex];
   const [showRatioMenu, setShowRatioMenu] = useState(false);
   const [showZoomSlider, setShowZoomSlider] = useState(false);
   const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
   const thumbnailsRef = useRef<HTMLUListElement>(null);

   const scrollThumbnails = useCallback((direction: 'left' | 'right') => {
      const el = thumbnailsRef.current;
      if (!el) return;
      el.scrollBy({
         left: direction === 'left' ? -SCROLL_DISTANCE : SCROLL_DISTANCE,
         behavior: 'smooth',
      });
   }, []);

   const handleRatioChange = (ratio: AspectRatio) => {
      onAspectRatioChange(ratio);
      onUpdateFile(currentIndex, { panX: 0, panY: 0 });
      setShowRatioMenu(false);
   };

   const handleDragStart = (e: React.DragEvent, idx: number) => {
      e.dataTransfer.setData('text/plain', String(idx));
      e.dataTransfer.effectAllowed = 'move';
   };

   const handleDrop = (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      const sourceIdx = Number(e.dataTransfer.getData('text/plain'));
      if (!Number.isNaN(sourceIdx) && sourceIdx !== idx) onReorderFiles(sourceIdx, idx);
      setDragOverIndex(null);
   };

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.leftControls)}>
            <div {...stylex.props(styles.controlWrapper)}>
               <button
                  type="button"
                  {...stylex.props(styles.controlButton)}
                  onClick={() => setShowRatioMenu(prev => !prev)}
                  aria-label="Aspect ratio"
               >
                  <MdOutlineAspectRatio />
               </button>
               {showRatioMenu && (
                  <div {...stylex.props(styles.ratioMenu)}>
                     {ASPECT_RATIOS.map(({ key, label, icon }) => (
                        <button
                           key={key}
                           type="button"
                           {...stylex.props(
                              styles.ratioMenuItem,
                              aspectRatio === key && styles.ratioMenuItemActive,
                           )}
                           onClick={() => handleRatioChange(key)}
                        >
                           <span>{label}</span>
                           <div {...stylex.props(styles.ratioIcon)} style={{ aspectRatio: icon }} />
                        </button>
                     ))}
                  </div>
               )}
            </div>

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
                           onChange={e =>
                              onUpdateFile(currentIndex, { zoom: Number(e.target.value) })
                           }
                           {...stylex.props(styles.zoomSlider)}
                        />
                     </div>
                  )}
               </div>
            )}
         </div>

         <Popover.Root>
            <Popover.Trigger asChild>
               <button
                  type="button"
                  {...stylex.props(styles.controlButton)}
                  aria-label="View all media"
               >
                  <PiImagesSquareLight style={{ fontSize: 20 }} />
               </button>
            </Popover.Trigger>
            <Popover.Portal>
               <Popover.Content
                  {...stylex.props(styles.popoverContent)}
                  side="top"
                  align="end"
                  sideOffset={8}
               >
                  <div {...stylex.props(styles.popoverThumbnails)}>
                     {files.length > 3 && (
                        <div {...stylex.props(styles.popoverArrow)}>
                           <CarouselArrow
                              direction="left"
                              onClick={() => scrollThumbnails('left')}
                           />
                        </div>
                     )}
                     <ul {...stylex.props(styles.popoverScroll)} ref={thumbnailsRef}>
                        {files.map((file, idx) => (
                           <li
                              key={file.preview}
                              draggable={files.length > 1}
                              {...stylex.props(
                                 styles.popoverThumbWrapper,
                                 dragOverIndex === idx && styles.popoverThumbWrapperDragOver,
                              )}
                              onDragStart={e => handleDragStart(e, idx)}
                              onDragOver={e => {
                                 e.preventDefault();
                                 e.dataTransfer.dropEffect = 'move';
                                 setDragOverIndex(idx);
                              }}
                              onDrop={e => handleDrop(e, idx)}
                              onDragLeave={() => setDragOverIndex(null)}
                              onDragEnd={() => setDragOverIndex(null)}
                           >
                              <button
                                 type="button"
                                 {...stylex.props(styles.popoverThumb)}
                                 onClick={() => onSelectIndex(idx)}
                              >
                                 {file.type === 'video' ? (
                                    <video
                                       src={file.preview}
                                       muted
                                       playsInline
                                       width={94}
                                       height={94}
                                       {...stylex.props(styles.thumbImage)}
                                    />
                                 ) : (
                                    <Image
                                       src={file.preview}
                                       alt={`Thumbnail ${idx + 1}`}
                                       width={94}
                                       height={94}
                                       {...stylex.props(styles.thumbImage)}
                                    />
                                 )}
                                 {idx !== currentIndex && (
                                    <div {...stylex.props(styles.thumbImageOverlay)} />
                                 )}
                              </button>
                              {files.length > 1 && idx === currentIndex && (
                                 <button
                                    type="button"
                                    {...stylex.props(styles.thumbRemove)}
                                    onClick={() => onRemoveFile(idx)}
                                 >
                                    <IoClose style={{ fontSize: 12 }} />
                                 </button>
                              )}
                           </li>
                        ))}
                        {files.length < MAX_FILES && (
                           <li key="add" {...stylex.props(styles.popoverThumbWrapper)}>
                              <button
                                 type="button"
                                 {...stylex.props(styles.popoverAddButton)}
                                 onClick={onAddFiles}
                              >
                                 <MdAdd style={{ fontSize: 20 }} />
                              </button>
                           </li>
                        )}
                     </ul>
                     {files.length > 3 && (
                        <div {...stylex.props(styles.popoverArrow)}>
                           <CarouselArrow
                              direction="right"
                              onClick={() => scrollThumbnails('right')}
                           />
                        </div>
                     )}
                  </div>
               </Popover.Content>
            </Popover.Portal>
         </Popover.Root>
      </div>
   );
}
