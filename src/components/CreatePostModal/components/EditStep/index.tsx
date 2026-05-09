import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import CarouselArrow from '@/src/components/CarouselArrow';
import type { Adjustments, AspectRatio, SelectedFile } from '../../types';
import { RATIO_NUMERIC } from '../../types';
import AdjustmentSliders from './components/AdjustmentSliders';
import type { FilterPreset } from './components/FilterGrid';
import FilterGrid from './components/FilterGrid';
import { styles } from './index.stylex';

const FILTER_PRESETS: FilterPreset[] = [
   { name: 'Aden', filter: 'sepia(0.2) brightness(1.15) saturate(0.85)' },
   { name: 'Clarendon', filter: 'brightness(1.1) contrast(1.2) saturate(1.3)' },
   { name: 'Crema', filter: 'sepia(0.3) brightness(1.05) contrast(0.95)' },
   { name: 'Gingham', filter: 'brightness(1.05) sepia(0.15) contrast(0.9)' },
   { name: 'Juno', filter: 'brightness(1.05) contrast(1.1) saturate(1.4)' },
   { name: 'Lark', filter: 'brightness(1.1) saturate(1.3) sepia(0.05)' },
   { name: 'Ludwig', filter: 'sepia(0.1) brightness(1.05) saturate(1.2)' },
   { name: 'Moon', filter: 'grayscale(1) brightness(1.1) contrast(1.1)' },
   { name: 'Original', filter: '' },
   { name: 'Perpetua', filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' },
   { name: 'Reyes', filter: 'sepia(0.4) brightness(0.9) contrast(0.85)' },
   { name: 'Slumber', filter: 'sepia(0.35) brightness(0.9) saturate(0.85)' },
];

function getFilterString(file: SelectedFile): string {
   const preset = FILTER_PRESETS.find(p => p.name === file.filterPreset);
   const presetFilter = preset?.filter ?? '';
   const adj = file.adjustments;
   const brightness = 100 + adj.brightness;
   const contrast = 100 + adj.contrast;
   const saturation = 100 + adj.saturation;
   let filter = `${presetFilter} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`.trim();
   if (adj.temperature !== 0) {
      const sepia = Math.abs(adj.temperature) * 0.002;
      filter += ` sepia(${sepia})`;
      if (adj.temperature > 0) {
         filter += ` hue-rotate(-10deg)`;
      }
   }
   return filter;
}

interface EditStepProps {
   files: SelectedFile[];
   currentIndex: number;
   onBack: () => void;
   onSelectIndex: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<SelectedFile>) => void;
   aspectRatio: AspectRatio;
}

export default function EditStep({
   files,
   currentIndex,
   onBack,
   onSelectIndex,
   onUpdateFile,
   aspectRatio,
}: EditStepProps) {
   const currentFile = files[currentIndex];
   const [activeTab, setActiveTab] = useState<'filters' | 'adjustments'>('filters');
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

   const handlePresetChange = (name: string) => {
      onUpdateFile(currentIndex, {
         filterPreset: name,
         adjustments: { brightness: 0, contrast: 0, fade: 0, saturation: 0, temperature: 0, vignette: 0 },
      });
   };

   const handleAdjustmentChange = (key: keyof Adjustments, value: number) => {
      onUpdateFile(currentIndex, {
         filterPreset: 'Original',
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
            <button type="button" {...stylex.props(styles.shareButton)}>
               Share
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
                  {/* biome-ignore lint/performance/noImgElement: crop preview needs raw img for CSS filters */}
                  <img
                     src={currentFile.preview}
                     alt="Preview"
                     draggable={false}
                     {...stylex.props(styles.previewImage)}
                     style={{
                        transform: `translate(${currentFile.panX}px, ${currentFile.panY}px) scale(${currentFile.zoom})`,
                        filter: getFilterString(currentFile),
                     }}
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
                  <FilterGrid
                     presets={FILTER_PRESETS}
                     selectedPreset={currentFile.filterPreset}
                     preview={currentFile.preview}
                     onSelect={handlePresetChange}
                  />
               )}

               {activeTab === 'adjustments' && (
                  <AdjustmentSliders adjustments={currentFile.adjustments} onChange={handleAdjustmentChange} />
               )}
            </div>
         </div>
      </div>
   );
}
