'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { IoClose, IoPause, IoPlay, IoSend } from 'react-icons/io5';
import { styles } from './index.stylex';

const MAX_SECONDS = 60;

function formatTime(secs: number) {
   const m = Math.floor(secs / 60);
   const s = Math.floor(secs % 60);
   return `${m}:${s.toString().padStart(2, '0')}`;
}

interface VoiceRecorderProps {
   onSend: (blob: Blob) => Promise<void>;
   onCancel: () => void;
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
   const [elapsed, setElapsed] = useState(0);
   const [sending, setSending] = useState(false);
   const [isPaused, setIsPaused] = useState(false);

   const onSendRef = useRef(onSend);
   onSendRef.current = onSend;
   const onCancelRef = useRef(onCancel);
   onCancelRef.current = onCancel;

   const stopAndSendRef = useRef<(() => Promise<void>) | undefined>(undefined);
   const handleCancelRef = useRef<(() => void) | undefined>(undefined);
   const togglePauseRef = useRef<(() => void) | undefined>(undefined);
   const progressFillRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      let active = true;
      let stream: MediaStream | null = null;
      let recorder: MediaRecorder | null = null;
      const chunks: Blob[] = [];
      let rafHandle: number | null = null;
      let sent = false;
      let paused = false;
      let startTime = 0;
      let pauseStart = 0;

      function stopStream() {
         for (const track of stream?.getTracks() ?? []) track.stop();
      }

      function stopRAF() {
         if (rafHandle !== null) {
            cancelAnimationFrame(rafHandle);
            rafHandle = null;
         }
      }

      function tickProgress() {
         if (!active || paused) return;
         const secs = (Date.now() - startTime) / 1000;

         if (progressFillRef.current) {
            progressFillRef.current.style.width = `${Math.min((secs / MAX_SECONDS) * 100, 100)}%`;
         }
         if (active) setElapsed(Math.floor(secs));

         if (secs >= MAX_SECONDS) {
            stopRAF();
            pauseRecording();
         } else {
            rafHandle = requestAnimationFrame(tickProgress);
         }
      }

      function pauseRecording() {
         if (paused || !recorder || recorder.state !== 'recording') return;
         paused = true;
         pauseStart = Date.now();
         recorder.pause();
         stopRAF();
         if (active) setIsPaused(true);
      }

      function resumeRecording() {
         if (!paused || !recorder || recorder.state !== 'paused') return;
         paused = false;
         startTime += Date.now() - pauseStart;
         recorder.resume();
         rafHandle = requestAnimationFrame(tickProgress);
         if (active) setIsPaused(false);
      }

      function togglePause() {
         if (paused) resumeRecording();
         else pauseRecording();
      }

      async function stopAndSend() {
         if (sent) return;
         sent = true;
         stopRAF();
         stopStream();

         if (recorder && recorder.state !== 'inactive') {
            await new Promise<void>(resolve => {
               if (!recorder) {
                  resolve();
                  return;
               }
               recorder.onstop = () => resolve();
               recorder.stop();
            });
         }

         const mimeType = recorder?.mimeType || 'audio/webm';
         const blob = new Blob(chunks, { type: mimeType });

         if (active) setSending(true);
         try {
            await onSendRef.current(blob);
         } finally {
            if (active) setSending(false);
         }
      }

      function handleCancel() {
         sent = true;
         paused = true;
         stopRAF();
         if (recorder && recorder.state !== 'inactive') recorder.stop();
         stopStream();
         onCancelRef.current();
      }

      stopAndSendRef.current = stopAndSend;
      handleCancelRef.current = handleCancel;
      togglePauseRef.current = togglePause;

      async function init() {
         try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!active) {
               stopStream();
               return;
            }

            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
               ? 'audio/webm;codecs=opus'
               : 'audio/webm';
            recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 16000 });
            recorder.ondataavailable = e => {
               if (e.data.size > 0) chunks.push(e.data);
            };
            recorder.start(100);

            startTime = Date.now();
            rafHandle = requestAnimationFrame(tickProgress);
         } catch {
            if (active) onCancelRef.current();
         }
      }

      init();

      return () => {
         active = false;
         stopRAF();
         stopStream();
      };
   }, []);

   return (
      <div {...stylex.props(styles.container)}>
         <button
            type="button"
            {...stylex.props(styles.cancelButton)}
            onClick={() => handleCancelRef.current?.()}
            disabled={sending}
         >
            <IoClose />
         </button>
         <div {...stylex.props(styles.pill)}>
            <div ref={progressFillRef} {...stylex.props(styles.progressFill)} />
            <div {...stylex.props(styles.pillContent)}>
               <button
                  type="button"
                  {...stylex.props(styles.stopButton)}
                  onClick={() => togglePauseRef.current?.()}
                  disabled={sending}
               >
                  {isPaused ? <IoPlay size={20} /> : <IoPause size={20} />}
               </button>
               <div {...stylex.props(styles.spacer)} />
               <span {...stylex.props(styles.timer)}>{formatTime(elapsed)}</span>
            </div>
         </div>
         <button
            type="button"
            {...stylex.props(styles.sendButton)}
            onClick={() => stopAndSendRef.current?.()}
            disabled={sending}
         >
            <IoSend size={16} />
         </button>
      </div>
   );
}
