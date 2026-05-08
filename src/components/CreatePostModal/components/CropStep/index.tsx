'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { IoArrowBack, IoClose } from 'react-icons/io5';
import { MdAspectRatio, MdZoomIn } from 'react-icons/md';
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

const RATIO_CSS: Record<SelectedFile['aspectRatio'], string> = {
   original: 'auto',
   '1:1': '1 / 1',
   '4:5': '4 / 5',
   '16:9': '16 / 9',
   '9:16': '9 / 16',
};

interface CropStepProps {
   files: SelectedFile[];
   currentIndex: number;
   onBack: () => void;
   onNext: () => void;
   onSelectIndex: (index: number) => void;
   onRemoveFile: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<SelectedFile>) => void;
}

export default function CropStep({
   files,
   currentIndex,
   onBack,
   onNext,
   onSelectIndex,
   onRemoveFile,
   onUpdateFile,
}: CropStepProps) {
   const currentFile = files[currentIndex];
   const [showRatioMenu, setShowRatioMenu] = useState(false);
   const [showZoomSlider, setShowZoomSlider] = useState(false);
   const thumbnailsRef = useRef<HTMLDivElement>(null);

   const scrollThumbnails = useCallback((direction: 'left' | 'right') => {
      const el = thumbnailsRef.current;
      if (!el) return;
      const amount = direction === 'left' ? -120 : 120;
      el.scrollBy({ left: amount, behavior: 'smooth' });
   }, []);

   const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateFile(currentIndex, { zoom: Number(e.target.value) });
   };

   const handleRatioChange = (ratio: SelectedFile['aspectRatio']) => {
      onUpdateFile(currentIndex, { aspectRatio: ratio });
      setShowRatioMenu(false);
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

         <div {...stylex.props(styles.previewArea)}>
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

            <div {...stylex.props(styles.cropContainer)} style={{ aspectRatio: RATIO_CSS[currentFile.aspectRatio] }}>
               <Image
                  src={currentFile.preview}
                  alt="Preview"
                  fill
                  {...stylex.props(styles.previewImage)}
                  style={{ transform: `scale(${currentFile.zoom})` }}
                  priority
               />
            </div>
         </div>

         <div {...stylex.props(styles.controlsBar)}>
            <div {...stylex.props(styles.leftControls)}>
               <div {...stylex.props(styles.controlWrapper)}>
                  <button
                     type="button"
                     {...stylex.props(styles.controlButton)}
                     onClick={() => setShowRatioMenu(prev => !prev)}
                     aria-label="Aspect ratio"
                  >
                     <MdAspectRatio style={{ fontSize: 20 }} />
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

            <div {...stylex.props(styles.thumbnailsWrapper)}>
               {files.length > 4 && (
                  <div {...stylex.props(styles.thumbNavButton)}>
                     <CarouselArrow direction="left" onClick={() => scrollThumbnails('left')} />
                  </div>
               )}
               <div {...stylex.props(styles.thumbnails)} ref={thumbnailsRef}>
                  {files.map((file, idx) => (
                     <div key={file.preview} {...stylex.props(styles.thumbWrapper)}>
                        <button
                           type="button"
                           {...stylex.props(styles.thumbItem, idx === currentIndex && styles.thumbItemActive)}
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
               </div>
               {files.length > 4 && (
                  <div {...stylex.props(styles.thumbNavButton)}>
                     <CarouselArrow direction="right" onClick={() => scrollThumbnails('right')} />
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
