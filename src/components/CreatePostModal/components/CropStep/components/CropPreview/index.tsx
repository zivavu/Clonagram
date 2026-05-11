import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState } from 'react';
import CarouselArrow from '@/src/components/CarouselArrow';
import type { AspectRatio, PostMedia } from '../../../types';
import { RATIO_NUMERIC } from '../../../types';
import { styles } from './index.stylex';

interface CropPreviewProps {
   files: PostMedia[];
   currentIndex: number;
   aspectRatio: AspectRatio;
   onSelectIndex: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
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
   const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
   const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
   const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
   const [isDragging, setIsDragging] = useState(false);

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
      dragRef.current = null;
      setIsDragging(false);
   };

   const isFirst = currentIndex === 0;
   const isLast = currentIndex === files.length - 1;
   const hasMultiple = files.length > 1;

   return (
      <div ref={previewRef} {...stylex.props(styles.root)}>
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
               key={currentFile.preview}
               src={currentFile.preview}
               alt="Preview"
               draggable={false}
               onLoad={e => setNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
               {...stylex.props(styles.previewImage)}
               style={{
                  width: imageDisplaySize ? imageDisplaySize.w : '100%',
                  height: imageDisplaySize ? imageDisplaySize.h : '100%',
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
      </div>
   );
}
