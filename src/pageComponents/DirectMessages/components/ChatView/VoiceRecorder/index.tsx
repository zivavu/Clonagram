'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { IoClose, IoSend, IoStop } from 'react-icons/io5';
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

   const onSendRef = useRef(onSend);
   onSendRef.current = onSend;
   const onCancelRef = useRef(onCancel);
   onCancelRef.current = onCancel;

   const stopAndSendRef = useRef<(() => Promise<void>) | undefined>(undefined);
   const handleCancelRef = useRef<(() => void) | undefined>(undefined);

   useEffect(() => {
      let active = true;
      let stream: MediaStream | null = null;
      let recorder: MediaRecorder | null = null;
      const chunks: Blob[] = [];
      let timer: ReturnType<typeof setInterval> | null = null;
      let sent = false;

      function stopStream() {
         stream?.getTracks().forEach(t => t.stop());
      }

      async function stopAndSend() {
         if (sent) return;
         sent = true;
         if (timer) clearInterval(timer);
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
         if (timer) clearInterval(timer);
         if (recorder && recorder.state !== 'inactive') recorder.stop();
         stopStream();
         onCancelRef.current();
      }

      stopAndSendRef.current = stopAndSend;
      handleCancelRef.current = handleCancel;

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

            timer = setInterval(() => {
               if (!active) return;
               setElapsed(prev => {
                  const next = prev + 1;
                  if (next >= MAX_SECONDS) {
                     clearInterval(timer!);
                     setTimeout(() => stopAndSend(), 0);
                  }
                  return next;
               });
            }, 1000);
         } catch {
            if (active) onCancelRef.current();
         }
      }

      init();

      return () => {
         active = false;
         if (timer) clearInterval(timer);
         stopStream();
      };
   }, []);

   const progress = (elapsed / MAX_SECONDS) * 100;

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
            <div {...stylex.props(styles.progressFill)} style={{ width: `${progress}%` }} />
            <div {...stylex.props(styles.pillContent)}>
               <button
                  type="button"
                  {...stylex.props(styles.stopButton)}
                  onClick={() => handleCancelRef.current?.()}
                  disabled={sending}
               >
                  <IoStop size={20} />
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
