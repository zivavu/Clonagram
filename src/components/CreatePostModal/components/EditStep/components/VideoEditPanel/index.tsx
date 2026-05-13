'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { extractVideoFrames } from '@/src/utils/extractVideoFrames';
import type { PostMedia } from '../../../../types';
import Toggle from '../../../CaptionStep/components/Toggle';
import CoverPhoto from './components/CoverPhoto';
import TrimStrip from './components/TrimStrip';
import { styles } from './index.stylex';

interface VideoEditPanelProps {
   file: PostMedia;
   videoRef: React.RefObject<HTMLVideoElement | null>;
   onUpdate: (updates: Partial<PostMedia>) => void;
}

export default function VideoEditPanel({ file, videoRef, onUpdate }: VideoEditPanelProps) {
   const [frames, setFrames] = useState<string[]>([]);
   const framesRef = useRef<string[]>([]);

   const onUpdateRef = useRef(onUpdate);
   const durationRef = useRef(file.duration);
   onUpdateRef.current = onUpdate;
   durationRef.current = file.duration;

   useEffect(() => {
      if (file.frames !== undefined) {
         for (const old of framesRef.current) URL.revokeObjectURL(old);
         framesRef.current = [];
         setFrames(file.frames);
         return;
      }

      let cancelled = false;
      extractVideoFrames(file.preview)
         .then(({ urls, duration }) => {
            if (cancelled) {
               for (const u of urls) URL.revokeObjectURL(u);
               return;
            }
            if (durationRef.current === 0 && duration > 0) {
               onUpdateRef.current({ duration, trimEnd: duration });
            }
            for (const old of framesRef.current) URL.revokeObjectURL(old);
            framesRef.current = urls;
            setFrames(urls);
         })
         .catch(() => {
            if (!cancelled) setFrames([]);
         });
      return () => {
         cancelled = true;
      };
   }, [file.preview, file.frames]);

   useEffect(() => {
      return () => {
         for (const u of framesRef.current) URL.revokeObjectURL(u);
         framesRef.current = [];
      };
   }, []);

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.section)}>
            <span {...stylex.props(styles.sectionTitle)}>Cover photo</span>
            <CoverPhoto file={file} frames={frames} videoRef={videoRef} onUpdate={onUpdate} />
         </div>

         <div {...stylex.props(styles.section)}>
            <span {...stylex.props(styles.sectionTitle)}>Trim</span>
            <TrimStrip
               frames={frames}
               duration={file.duration || 0}
               trimStart={file.trimStart}
               trimEnd={file.trimEnd}
               videoRef={videoRef}
               onChange={(key, value) => onUpdate({ [key]: value })}
            />
         </div>

         <div {...stylex.props(styles.section, styles.soundSection)}>
            <span {...stylex.props(styles.sectionTitle)}>Sound</span>
            <Toggle checked={!file.muted} onChange={v => onUpdate({ muted: !v })} />
         </div>
      </div>
   );
}
