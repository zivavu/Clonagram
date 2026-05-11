'use client';

import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import CarouselArrow from '@/src/components/CarouselArrow';
import { useFilterThumbnails } from '@/src/hooks/useFilterThumbnails';
import { useImageNaturalSize } from '@/src/hooks/useImageNaturalSize';
import { useWebGLFilter } from '@/src/hooks/useWebGLFilter';
import type { Adjustments, AspectRatio, PostMedia } from '../../types';
import { RATIO_NUMERIC } from '../../types';
import AdjustmentSliders from './components/AdjustmentSliders';
import type { FilterPreset } from './components/FilterGrid';
import FilterGrid from './components/FilterGrid';
import { styles } from './index.stylex';

const FILTER_PRESETS: FilterPreset[] = [
   { name: 'Aden' },
   { name: 'Clarendon' },
   { name: 'Crema' },
   { name: 'Gingham' },
   { name: 'Juno' },
   { name: 'Lark' },
   { name: 'Ludwig' },
   { name: 'Moon' },
   { name: 'Original' },
   { name: 'Perpetua' },
   { name: 'Reyes' },
   { name: 'Slumber' },
];

interface EditStepProps {
   files: PostMedia[];
   currentIndex: number;
   onBack: () => void;
   onNext: () => void;
   onSelectIndex: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
   aspectRatio: AspectRatio;
}

export default function EditStep({
   files,
   currentIndex,
   onBack,
   onNext,
   onSelectIndex,
   onUpdateFile,
   aspectRatio,
}: EditStepProps) {
   const currentFile = files[currentIndex];
   const [activeTab, setActiveTab] = useState<'filters' | 'adjustments'>('filters');
   const [showOriginal, setShowOriginal] = useState(false);
   const previewRef = useRef<HTMLDivElement>(null);
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
      const ratio = RATIO_NUMERIC[aspectRatio];
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

   const effectiveAdjustments = showOriginal
      ? { brightness: 0, contrast: 0, fade: 0, saturation: 0, temperature: 0, vignette: 0 }
      : currentFile.adjustments;
   const effectivePreset = showOriginal ? 'Original' : currentFile.filterPreset;

   const naturalSize = useImageNaturalSize(currentFile.preview);

   const imageDisplaySize = (() => {
      if (!cropBox || naturalSize.w === 0 || naturalSize.h === 0) return null;
      const imgRatio = naturalSize.w / naturalSize.h;
      const cropRatio = cropBox.width / cropBox.height;
      if (imgRatio >= cropRatio) {
         const h = cropBox.height;
         return { w: h * imgRatio, h };
      }
      const w = cropBox.width;
      return { w, h: w / imgRatio };
   })();

   const { canvasRef } = useWebGLFilter({
      src: currentFile.preview,
      width: imageDisplaySize?.w ?? 0,
      height: imageDisplaySize?.h ?? 0,
      adjustments: effectiveAdjustments,
      filterPreset: effectivePreset,
      filterStrength: showOriginal ? 0 : currentFile.filterStrength,
   });

   const thumbnails = useFilterThumbnails(
      currentFile.preview,
      FILTER_PRESETS.map(p => p.name),
   );

   const handlePresetChange = (name: string) => {
      onUpdateFile(currentIndex, {
         filterPreset: name,
         filterStrength: 100,
         adjustments: { brightness: 0, contrast: 0, fade: 0, saturation: 0, temperature: 0, vignette: 0 },
      });
   };

   const handleStrengthChange = (value: number) => {
      onUpdateFile(currentIndex, { filterStrength: value });
   };

   const handleAdjustmentChange = (key: keyof Adjustments, value: number) => {
      onUpdateFile(currentIndex, {
         adjustments: { ...currentFile.adjustments, [key]: value },
      });
   };

   const isFirst = currentIndex === 0;
   const isLast = currentIndex === files.length - 1;
   const hasMultiple = files.length > 1;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <button type="button" {...stylex.props(styles.headerButton)} onClick={onBack} aria-label="Back">
               <IoArrowBack style={{ fontSize: 24 }} />
            </button>
            <span {...stylex.props(styles.headerTitle)}>Edit</span>
            <button type="button" {...stylex.props(styles.nextButton)} onClick={onNext}>
               Next
            </button>
         </div>

         <div {...stylex.props(styles.body)}>
            <div ref={previewRef} {...stylex.props(styles.previewSection)}>
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
               >
                  <canvas
                     ref={canvasRef}
                     {...stylex.props(styles.previewImage)}
                     style={{
                        width: imageDisplaySize ? imageDisplaySize.w : '100%',
                        height: imageDisplaySize ? imageDisplaySize.h : '100%',
                        transform: `translate(${currentFile.panX}px, ${currentFile.panY}px) scale(${currentFile.zoom})`,
                     }}
                     onPointerDown={e => {
                        const el = e.currentTarget;
                        el.setPointerCapture(e.pointerId);
                        setShowOriginal(true);
                     }}
                     onPointerUp={e => {
                        const el = e.currentTarget;
                        el.releasePointerCapture(e.pointerId);
                        setShowOriginal(false);
                     }}
                     onPointerCancel={() => setShowOriginal(false)}
                  />
               </div>
            </div>

            <div {...stylex.props(styles.panel)}>
               <div {...stylex.props(styles.tabs)}>
                  <button
                     type="button"
                     {...stylex.props(styles.tab, activeTab !== 'filters' && styles.tabInactive)}
                     onClick={() => setActiveTab('filters')}
                  >
                     Filters
                  </button>
                  <button
                     type="button"
                     {...stylex.props(styles.tab, activeTab !== 'adjustments' && styles.tabInactive)}
                     onClick={() => setActiveTab('adjustments')}
                  >
                     Adjustments
                  </button>
               </div>

               {activeTab === 'filters' && (
                  <>
                     <FilterGrid
                        presets={FILTER_PRESETS}
                        selectedPreset={currentFile.filterPreset}
                        thumbnails={thumbnails}
                        onSelect={handlePresetChange}
                     />
                     {currentFile.filterPreset !== 'Original' && (
                        <div {...stylex.props(styles.strengthRow)}>
                           <input
                              type="range"
                              min={0}
                              max={100}
                              value={currentFile.filterStrength}
                              onChange={e => handleStrengthChange(Number(e.target.value))}
                              {...stylex.props(styles.strengthSlider)}
                              style={{
                                 background: `linear-gradient(to right, rgb(255,255,255) 0%, rgb(255,255,255) ${currentFile.filterStrength}%, rgb(0,0,0) ${currentFile.filterStrength}%, rgb(0,0,0) 100%)`,
                              }}
                           />
                           <span {...stylex.props(styles.strengthValue)}>{currentFile.filterStrength}</span>
                        </div>
                     )}
                  </>
               )}

               {activeTab === 'adjustments' && (
                  <AdjustmentSliders adjustments={currentFile.adjustments} onChange={handleAdjustmentChange} />
               )}
            </div>
         </div>
      </div>
   );
}
