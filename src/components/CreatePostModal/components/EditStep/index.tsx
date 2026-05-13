'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { IoPlay } from 'react-icons/io5';
import { captureVideoFrame } from '@/src/utils/captureVideoFrame';
import { useContainerSize } from '../../hooks/useContainerSize';
import { useCropDimensions } from '../../hooks/useCropDimensions';
import { useMediaNaturalSize } from '../../hooks/useMediaNaturalSize';
import type { AspectRatio, PostMedia } from '../../types';
import PreviewArrows from '../PreviewArrows';
import StepHeader, { StepHeaderAction } from '../StepHeader';
import FilteredCanvas from './components/FilteredCanvas';
import ImageEditPanel from './components/ImageEditPanel';
import VideoEditPanel from './components/VideoEditPanel';
import { styles } from './index.stylex';

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
   const previewRef = useRef<HTMLDivElement>(null);
   const videoRef = useRef<HTMLVideoElement>(null);
   const posterRef = useRef<string | null>(null);
   const [videoPoster, setVideoPoster] = useState<string | null>(null);
   const [isPlaying, setIsPlaying] = useState(false);

   const coverTimeRef = useRef(currentFile.coverTime);
   const trimStartRef = useRef(currentFile.trimStart);
   const trimEndRef = useRef(currentFile.trimEnd);
   const onUpdateFileRef = useRef(onUpdateFile);
   const currentIndexRef = useRef(currentIndex);
   coverTimeRef.current = currentFile.coverTime;
   trimStartRef.current = currentFile.trimStart;
   trimEndRef.current = currentFile.trimEnd;
   onUpdateFileRef.current = onUpdateFile;
   currentIndexRef.current = currentIndex;

   const containerSize = useContainerSize(previewRef);
   const naturalSize = useMediaNaturalSize(currentFile.preview, currentFile.type);
   const { cropBox, imageDisplaySize } = useCropDimensions(containerSize, naturalSize, aspectRatio);

   useEffect(() => {
      if (currentFile.type !== 'video') return;
      let cancelled = false;
      const oldUrl = posterRef.current;

      captureVideoFrame(currentFile.preview, currentFile.coverTime)
         .then(url => {
            if (cancelled) {
               URL.revokeObjectURL(url);
               return;
            }
            if (oldUrl) URL.revokeObjectURL(oldUrl);
            posterRef.current = url;
            setVideoPoster(url);
            onUpdateFileRef.current(currentIndexRef.current, { poster: url });
         })
         .catch(() => {});

      return () => {
         cancelled = true;
      };
   }, [currentFile.preview, currentFile.coverTime, currentFile.type]);

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

   const previewTransform = {
      width: imageDisplaySize ? imageDisplaySize.w : '100%',
      height: imageDisplaySize ? imageDisplaySize.h : '100%',
      transform: `translate(${currentFile.panX}px, ${currentFile.panY}px) scale(${currentFile.zoom})`,
   };

   const cropBoxStyle = cropBox
      ? { width: cropBox.width, height: cropBox.height }
      : { width: '100%', height: '100%' };

   return (
      <div {...stylex.props(styles.root)}>
         <StepHeader
            title="Edit"
            onBack={onBack}
            rightSlot={<StepHeaderAction label="Next" onClick={onNext} />}
         />
         <div {...stylex.props(styles.body)}>
            <div ref={previewRef} {...stylex.props(styles.previewSection)}>
               <PreviewArrows
                  currentIndex={currentIndex}
                  total={files.length}
                  onSelectIndex={onSelectIndex}
               />
               <div {...stylex.props(styles.cropContainer)} style={cropBoxStyle}>
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
                           onLoadedData={() => {
                              const v = videoRef.current;
                              if (v) v.currentTime = coverTimeRef.current;
                           }}
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
                                 <IoPlay fontSize={80} />
                              </div>
                           )}
                        </button>
                     </>
                  ) : (
                     <FilteredCanvas
                        src={currentFile.preview}
                        width={imageDisplaySize?.w ?? 0}
                        height={imageDisplaySize?.h ?? 0}
                        adjustments={currentFile.adjustments}
                        filterPreset={currentFile.filterPreset}
                        filterStrength={currentFile.filterStrength}
                        style={previewTransform}
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
                  <ImageEditPanel
                     file={currentFile}
                     onUpdate={updates => onUpdateFile(currentIndex, updates)}
                  />
               )}
            </div>
         </div>
      </div>
   );
}
