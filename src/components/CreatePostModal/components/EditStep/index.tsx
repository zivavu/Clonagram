'use client';

import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoArrowBack, IoPlay } from 'react-icons/io5';
import CarouselArrow from '@/src/components/CarouselArrow';
import { useFilterThumbnails } from '@/src/hooks/useFilterThumbnails';
import { useMediaNaturalSize } from '@/src/hooks/useMediaNaturalSize';
import { useWebGLFilter } from '@/src/hooks/useWebGLFilter';
import type { Adjustments, AspectRatio, PostMedia } from '../../types';
import { RATIO_NUMERIC } from '../../types';
import AdjustmentSliders from './components/AdjustmentSliders';
import type { FilterPreset } from './components/FilterGrid';
import FilterGrid from './components/FilterGrid';
import VideoEditPanel from './components/VideoEditPanel';
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

const FILTER_PRESET_NAMES = FILTER_PRESETS.map(p => p.name);

interface EditStepProps {
   files: PostMedia[];
   currentIndex: number;
   onBack: () => void;
   onNext: () => void;
   onSelectIndex: (index: number) => void;
   onUpdateFile: (index: number, updates: Partial<PostMedia>) => void;
   aspectRatio: AspectRatio;
}

async function captureFrame(src: string, time: number): Promise<string> {
   return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = src;
      video.muted = true;
      video.crossOrigin = 'anonymous';
      video.playsInline = true;
      video.preload = 'auto';
      video.onloadedmetadata = () => {
         video.currentTime = Math.min(time, video.duration || time);
      };
      video.onseeked = () => {
         const canvas = document.createElement('canvas');
         canvas.width = video.videoWidth || 640;
         canvas.height = video.videoHeight || 360;
         const ctx = canvas.getContext('2d');
         if (!ctx) {
            reject(new Error('No 2d context'));
            return;
         }
         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
         canvas.toBlob(
            blob => {
               if (blob) resolve(URL.createObjectURL(blob));
               else reject(new Error('Blob creation failed'));
            },
            'image/jpeg',
            0.85,
         );
      };
      video.onerror = () => reject(new Error('Video load error'));
      video.load();
   });
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
   const [videoPoster, setVideoPoster] = useState<string | null>(null);
   const posterRef = useRef<string | null>(null);
   const videoRef = useRef<HTMLVideoElement>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const coverTimeRef = useRef(currentFile.coverTime);
   const trimStartRef = useRef(currentFile.trimStart);
   const trimEndRef = useRef(currentFile.trimEnd);

   coverTimeRef.current = currentFile.coverTime;
   trimStartRef.current = currentFile.trimStart;
   trimEndRef.current = currentFile.trimEnd;

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

   useEffect(() => {
      if (currentFile.type !== 'video') return;
      let cancelled = false;
      const oldUrl = posterRef.current;

      captureFrame(currentFile.preview, currentFile.coverTime)
         .then(url => {
            if (cancelled) {
               URL.revokeObjectURL(url);
               return;
            }
            if (oldUrl) URL.revokeObjectURL(oldUrl);
            posterRef.current = url;
            setVideoPoster(url);
         })
         .catch(() => {});

      return () => {
         cancelled = true;
      };
   }, [currentFile.preview, currentFile.coverTime, currentFile.type]);

   useEffect(() => {
      return () => {
         if (posterRef.current) URL.revokeObjectURL(posterRef.current);
      };
   }, []);

   const handleVideoClick = () => {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
         video.currentTime = trimStartRef.current;
         video.play().catch(() => {});
      } else {
         video.pause();
      }
   };

   const handleVideoPause = () => {
      setIsPlaying(false);
      const video = videoRef.current;
      if (video) video.currentTime = coverTimeRef.current;
   };

   const handleVideoTimeUpdate = () => {
      const video = videoRef.current;
      if (!video || video.paused || trimEndRef.current <= 0) return;
      if (video.currentTime >= trimEndRef.current) {
         video.currentTime = trimStartRef.current;
      }
   };

   const handleVideoLoaded = () => {
      const video = videoRef.current;
      if (video) video.currentTime = coverTimeRef.current;
   };

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

   const naturalSize = useMediaNaturalSize(currentFile.preview, currentFile.type);

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

   const effectiveAdjustments = showOriginal
      ? { brightness: 0, contrast: 0, fade: 0, saturation: 0, temperature: 0, vignette: 0 }
      : currentFile.adjustments;
   const effectivePreset = showOriginal ? 'Original' : currentFile.filterPreset;

   const { canvasRef } = useWebGLFilter({
      src: currentFile.preview,
      width: imageDisplaySize?.w ?? 0,
      height: imageDisplaySize?.h ?? 0,
      adjustments: effectiveAdjustments,
      filterPreset: effectivePreset,
      filterStrength: showOriginal ? 0 : currentFile.filterStrength,
   });

   const thumbnails = useFilterThumbnails(
      currentFile.type === 'image' ? currentFile.preview : '',
      FILTER_PRESET_NAMES,
   );

   const handlePresetChange = (name: string) => {
      onUpdateFile(currentIndex, {
         filterPreset: name,
         filterStrength: 100,
         adjustments: {
            brightness: 0,
            contrast: 0,
            fade: 0,
            saturation: 0,
            temperature: 0,
            vignette: 0,
         },
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

   const previewTransform = {
      width: imageDisplaySize ? imageDisplaySize.w : '100%',
      height: imageDisplaySize ? imageDisplaySize.h : '100%',
      transform: `translate(${currentFile.panX}px, ${currentFile.panY}px) scale(${currentFile.zoom})`,
   };

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.header)}>
            <button
               type="button"
               {...stylex.props(styles.headerButton)}
               onClick={onBack}
               aria-label="Back"
            >
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
                     <CarouselArrow
                        direction="left"
                        onClick={() => onSelectIndex(currentIndex - 1)}
                     />
                  </div>
               )}
               {hasMultiple && !isLast && (
                  <div {...stylex.props(styles.mainArrowRight)}>
                     <CarouselArrow
                        direction="right"
                        onClick={() => onSelectIndex(currentIndex + 1)}
                     />
                  </div>
               )}
               <div
                  {...stylex.props(styles.cropContainer)}
                  style={
                     cropBox
                        ? { width: cropBox.width, height: cropBox.height }
                        : { width: '100%', height: '100%' }
                  }
               >
                  {currentFile.type === 'video' ? (
                     <>
                        <video
                           ref={videoRef}
                           key={currentFile.preview}
                           src={currentFile.preview}
                           muted={currentFile.muted}
                           playsInline
                           poster={videoPoster ?? undefined}
                           draggable={false}
                           onPlay={() => setIsPlaying(true)}
                           onPause={handleVideoPause}
                           onTimeUpdate={handleVideoTimeUpdate}
                           onLoadedData={handleVideoLoaded}
                           {...stylex.props(styles.previewImage)}
                           style={previewTransform}
                        />
                        <button
                           type="button"
                           {...stylex.props(styles.videoOverlayBtn)}
                           onClick={handleVideoClick}
                           aria-label={isPlaying ? 'Pause video' : 'Play video'}
                        >
                           {!isPlaying && (
                              <div {...stylex.props(styles.playButton)}>
                                 <IoPlay />
                              </div>
                           )}
                        </button>
                     </>
                  ) : (
                     <canvas
                        ref={canvasRef}
                        {...stylex.props(styles.previewImage)}
                        style={previewTransform}
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
                  )}
               </div>
            </div>

            <div {...stylex.props(styles.panel)}>
               {currentFile.type === 'video' ? (
                  <VideoEditPanel
                     file={currentFile}
                     videoRef={videoRef}
                     onUpdate={updates => onUpdateFile(currentIndex, updates)}
                  />
               ) : (
                  <>
                     <div {...stylex.props(styles.tabs)}>
                        <button
                           type="button"
                           {...stylex.props(
                              styles.tab,
                              activeTab !== 'filters' && styles.tabInactive,
                           )}
                           onClick={() => setActiveTab('filters')}
                        >
                           Filters
                        </button>
                        <button
                           type="button"
                           {...stylex.props(
                              styles.tab,
                              activeTab !== 'adjustments' && styles.tabInactive,
                           )}
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
                                 <span {...stylex.props(styles.strengthValue)}>
                                    {currentFile.filterStrength}
                                 </span>
                              </div>
                           )}
                        </>
                     )}

                     {activeTab === 'adjustments' && (
                        <AdjustmentSliders
                           adjustments={currentFile.adjustments}
                           onChange={handleAdjustmentChange}
                        />
                     )}
                  </>
               )}
            </div>
         </div>
      </div>
   );
}
