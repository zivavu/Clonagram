'use client';

import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoArrowBack, IoClose } from 'react-icons/io5';
import { MdAdd, MdOutlineAspectRatio, MdZoomIn } from 'react-icons/md';
import { PiImagesSquareLight } from 'react-icons/pi';
import CarouselArrow from '@/src/components/CarouselArrow';
import type { SelectedFile } from '../../types';
import { styles } from './index.stylex';

const ASPECT_RATIOS: { key: SelectedFile['aspectRatio']; label: string }[] = [
   { key: 'original', label: 'Original' },
   { key: '1:1', label: '1:1' },
   { key: '4:5', label: '4:5' },
   { key: '16:9', label: '16:9' },
   { key: '9:16', label: '9:16' },
];

const RATIO_NUMERIC: Record<SelectedFile['aspectRatio'], number | null> = {
   original: null,
   '1:1': 1,
   '4:5': 4 / 5,
   '16:9': 16 / 9,
   '9:16': 9 / 16,
};

interface CropStepProps {
   files: SelectedFile[];
   currentIndex: number;
   onBack: () => void;
   onNext: () => void;
   onSelectIndex: (index: number) => void;
   onRemoveFile: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<SelectedFile>) => void;
   onAddFiles: () => void;
}

export default function CropStep({
   files,
   currentIndex,
   onBack,
   onNext,
   onSelectIndex,
   onRemoveFile,
   onUpdateFile,
   onAddFiles,
}: CropStepProps) {
   const currentFile = files[currentIndex];
   const [showRatioMenu, setShowRatioMenu] = useState(false);
   const [showZoomSlider, setShowZoomSlider] = useState(false);
   const previewRef = useRef<HTMLDivElement>(null);
   const thumbnailsRef = useRef<HTMLDivElement>(null);
   const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
   const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

   const measureContainer = useCallback(() => {
      const el = previewRef.current;
      if (!el) return;
      const { clientWidth, clientHeight } = el;
      setContainerSize({ w: clientWidth, h: clientHeight });
   }, []);

   useEffect(() => {
      measureContainer();
      window.addEventListener('resize', measureContainer);
      return () => window.removeEventListener('resize', measureContainer);
   }, [measureContainer]);

   const cropBox = (() => {
      if (containerSize.w === 0) return null;

      const ratio = RATIO_NUMERIC[currentFile.aspectRatio];
      const maxW = containerSize.w;
      const maxH = containerSize.h;

      if (!ratio) {
         return { width: maxW, height: maxH };
      }

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

   const scrollThumbnails = useCallback((direction: 'left' | 'right') => {
      const el = thumbnailsRef.current;
      if (!el) return;
      el.scrollBy({ left: direction === 'left' ? -120 : 120, behavior: 'smooth' });
   }, []);

   const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateFile(currentIndex, { zoom: Number(e.target.value) });
   };

   const handleRatioChange = (ratio: SelectedFile['aspectRatio']) => {
      onUpdateFile(currentIndex, { aspectRatio: ratio });
      setShowRatioMenu(false);
   };

   const [isDragging, setIsDragging] = useState(false);

   const handlePointerDown = (e: React.PointerEvent) => {
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      dragRef.current = {
         startX: e.clientX,
         startY: e.clientY,
         panX: currentFile.panX,
         panY: currentFile.panY,
      };
      setIsDragging(true);
   };

   const handlePointerMove = (e: React.PointerEvent) => {
      if (!dragRef.current || !cropBox) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const maxPanX = Math.max(0, (currentFile.zoom - 1) * (cropBox.width / 2) - 80);
      const maxPanY = Math.max(0, (currentFile.zoom - 1) * (cropBox.height / 2) - 80);
      onUpdateFile(currentIndex, {
         panX: Math.max(-maxPanX, Math.min(maxPanX, dragRef.current.panX + dx)),
         panY: Math.max(-maxPanY, Math.min(maxPanY, dragRef.current.panY + dy)),
      });
   };

   const handlePointerUp = () => {
      dragRef.current = null;
      setIsDragging(false);
   };

   if (!currentFile) return null;

   const isFirst = currentIndex === 0;
   const isLast = currentIndex === files.length - 1;
   const hasMultiple = files.length > 1;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <button type="button" {...stylex.props(styles.headerButton)} onClick={onBack} aria-label="Back">
               <IoArrowBack style={{ fontSize: 24 }} />
            </button>
            <span {...stylex.props(styles.headerTitle)}>Crop</span>
            <button type="button" {...stylex.props(styles.nextButton)} onClick={onNext}>
               Next
            </button>
         </div>

         <div ref={previewRef} {...stylex.props(styles.previewArea)}>
            {hasMultiple && !isFirst && (
               <div {...stylex.props(styles.mainArrowLeft)}>
                  <CarouselArrow direction="left" onClick={() => onSelectIndex(currentIndex - 1)} />
               </div>
            )}
            {hasMultiple && !isLast && (
               <div {...stylex.props(styles.mainArrowRight)}>
                  <CarouselArrow direction="right" onClick={() => onSelectIndex(currentIndex + 1)} />
               </div>
            )}

            <div
               {...stylex.props(styles.cropContainer)}
               style={cropBox ? { width: cropBox.width, height: cropBox.height } : { width: '100%', height: '100%' }}
               onPointerDown={handlePointerDown}
               onPointerMove={handlePointerMove}
               onPointerUp={handlePointerUp}
               onPointerCancel={handlePointerUp}
            >
               {/* biome-ignore lint/performance/noImgElement: crop preview needs raw img for panning */}
               <img
                  src={currentFile.preview}
                  alt="Preview"
                  draggable={false}
                  {...stylex.props(styles.previewImage)}
                  style={{
                     transform: `translate(${currentFile.panX}px, ${currentFile.panY}px) scale(${currentFile.zoom})`,
                     transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  }}
               />
            </div>
            {isDragging && (
               <svg
                  viewBox="0 0 3 3"
                  preserveAspectRatio="none"
                  aria-label="Crop grid"
                  {...stylex.props(styles.gridOverlay)}
               >
                  <line x1="1" y1="0" x2="1" y2="3" stroke="white" strokeOpacity={0.3} strokeWidth="0.005" />
                  <line x1="2" y1="0" x2="2" y2="3" stroke="white" strokeOpacity={0.3} strokeWidth="0.005" />
                  <line x1="0" y1="1" x2="3" y2="1" stroke="white" strokeOpacity={0.3} strokeWidth="0.005" />
                  <line x1="0" y1="2" x2="3" y2="2" stroke="white" strokeOpacity={0.3} strokeWidth="0.005" />
               </svg>
            )}
            <div {...stylex.props(styles.controlsBar)}>
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
                           {ASPECT_RATIOS.map(({ key, label }) => (
                              <button
                                 key={key}
                                 type="button"
                                 {...stylex.props(
                                    styles.ratioMenuItem,
                                    currentFile.aspectRatio === key && styles.ratioMenuItemActive,
                                 )}
                                 onClick={() => handleRatioChange(key)}
                              >
                                 <span>{label}</span>
                                 <div
                                    {...stylex.props(styles.ratioIcon)}
                                    style={{
                                       aspectRatio:
                                          key === 'original'
                                             ? '3/2'
                                             : key === '1:1'
                                               ? '1/1'
                                               : key === '4:5'
                                                 ? '4/5'
                                                 : '16/9',
                                    }}
                                 />
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

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
                              onChange={handleZoomChange}
                              {...stylex.props(styles.zoomSlider)}
                           />
                        </div>
                     )}
                  </div>
               </div>

               <Popover.Root>
                  <Popover.Trigger asChild>
                     <button type="button" {...stylex.props(styles.controlButton)} aria-label="View all media">
                        <PiImagesSquareLight style={{ fontSize: 20 }} />
                     </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                     <Popover.Content {...stylex.props(styles.popoverContent)} side="top" align="end" sideOffset={8}>
                        <div {...stylex.props(styles.popoverThumbnails)}>
                           {files.length > 3 && (
                              <div {...stylex.props(styles.popoverArrow)}>
                                 <CarouselArrow direction="left" onClick={() => scrollThumbnails('left')} />
                              </div>
                           )}
                           <div {...stylex.props(styles.popoverScroll)} ref={thumbnailsRef}>
                              {files.map((file, idx) => (
                                 <div key={file.preview} {...stylex.props(styles.popoverThumbWrapper)}>
                                    <button
                                       type="button"
                                       {...stylex.props(
                                          styles.popoverThumb,
                                          idx === currentIndex && styles.popoverThumbActive,
                                       )}
                                       onClick={() => onSelectIndex(idx)}
                                    >
                                       <Image
                                          src={file.preview}
                                          alt={`Thumbnail ${idx + 1}`}
                                          fill
                                          {...stylex.props(styles.thumbImage)}
                                       />
                                    </button>
                                    {files.length > 1 && (
                                       <button
                                          type="button"
                                          {...stylex.props(styles.thumbRemove)}
                                          onClick={() => onRemoveFile(idx)}
                                       >
                                          <IoClose style={{ fontSize: 12 }} />
                                       </button>
                                    )}
                                 </div>
                              ))}
                              {files.length < 10 && (
                                 <button type="button" {...stylex.props(styles.popoverAddButton)} onClick={onAddFiles}>
                                    <MdAdd style={{ fontSize: 20 }} />
                                 </button>
                              )}
                           </div>
                           {files.length > 3 && (
                              <div {...stylex.props(styles.popoverArrow)}>
                                 <CarouselArrow direction="right" onClick={() => scrollThumbnails('right')} />
                              </div>
                           )}
                        </div>
                     </Popover.Content>
                  </Popover.Portal>
               </Popover.Root>
            </div>
         </div>
      </div>
   );
}
