import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
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

   const handlePointerDown = (e: React.PointerEvent) => {
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
            total={files.length}
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
