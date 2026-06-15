'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef, useState } from 'react';
import { FaPause, FaPlay } from 'react-icons/fa6';
import { styles } from './index.stylex';

const BAR_COUNT = 40;

const PLACEHOLDER_BARS = Array.from({ length: BAR_COUNT }, (_, i) =>
   Math.max(0.08, 0.15 + 0.75 * Math.abs(Math.sin(i * 0.45 + 0.5))),
);

function computeWaveform(buffer: AudioBuffer): number[] {
   const data = buffer.getChannelData(0);
   const samplesPerBar = Math.max(1, Math.floor(data.length / BAR_COUNT));
   const raw = Array.from({ length: BAR_COUNT }, (_, i) => {
      const start = i * samplesPerBar;
      let sum = 0;
      for (let j = 0; j < samplesPerBar; j++) {
         sum += Math.abs(data[start + j] ?? 0);
      }
      return sum / samplesPerBar;
   });
   const max = Math.max(...raw, 0.001);
   return raw.map(v => Math.max(v / max, 0.08));
}

function formatTime(secs: number) {
   const m = Math.floor(secs / 60);
   const s = Math.floor(secs % 60);
   return `${m}:${s.toString().padStart(2, '0')}`;
}

interface VoiceMessageProps {
   src: string;
}

export default function VoiceMessage({ src }: VoiceMessageProps) {
   const audioRef = useRef<HTMLAudioElement | null>(null);
   const waveformRef = useRef<number[] | null>(null);
   const playheadRef = useRef<HTMLDivElement | null>(null);
   const rafRef = useRef<number | null>(null);
   const durationRef = useRef(0);

   const [waveform, setWaveform] = useState<number[]>([]);
   const [isPlaying, setIsPlaying] = useState(false);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);

   function stopRAF() {
      if (rafRef.current !== null) {
         cancelAnimationFrame(rafRef.current);
         rafRef.current = null;
      }
   }

   function startRAF() {
      function tick() {
         const audio = audioRef.current;
         const ph = playheadRef.current;
         const dur = durationRef.current;
         if (!audio || !ph || dur <= 0) return;
         const fraction = Math.min(audio.currentTime / dur, 1);
         ph.style.left = `${fraction * 100}%`;
         if (!audio.paused && !audio.ended) {
            rafRef.current = requestAnimationFrame(tick);
         }
      }
      rafRef.current = requestAnimationFrame(tick);
   }

   function ensureAudio() {
      if (audioRef.current) return audioRef.current;
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.addEventListener('ended', () => {
         setIsPlaying(false);
         setCurrentTime(0);
         stopRAF();
         if (playheadRef.current) playheadRef.current.style.left = '0%';
      });
      return audio;
   }

   async function ensureWaveform() {
      if (waveformRef.current) return;
      const res = await fetch(src);
      const buf = await res.arrayBuffer();
      const ctx = new AudioContext();
      const decoded = await ctx.decodeAudioData(buf);
      await ctx.close();
      const bars = computeWaveform(decoded);
      waveformRef.current = bars;
      setWaveform(bars);
      durationRef.current = decoded.duration;
      setDuration(decoded.duration);
   }

   function handleWaveformClick(e: React.MouseEvent<HTMLDivElement>) {
      const audio = ensureAudio();
      const dur = durationRef.current;
      if (dur <= 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = fraction * dur;
      setCurrentTime(fraction * dur);
      if (playheadRef.current) playheadRef.current.style.left = `${fraction * 100}%`;
   }

   async function handleToggle() {
      const audio = ensureAudio();
      ensureWaveform().catch(() => null);
      if (isPlaying) {
         audio.pause();
         setIsPlaying(false);
         stopRAF();
      } else {
         await audio.play();
         setIsPlaying(true);
         startRAF();
      }
   }

   const displayBars = waveform.length ? waveform : PLACEHOLDER_BARS;
   const playedFraction = duration > 0 ? currentTime / duration : 0;
   const playedBarCount = Math.floor(playedFraction * BAR_COUNT);
   const displayTime = duration > 0 ? formatTime(isPlaying ? currentTime : duration) : '0:00';

   return (
      <div {...stylex.props(styles.bubble)}>
         <button type="button" {...stylex.props(styles.playButton)} onClick={handleToggle}>
            {isPlaying ? <FaPause size={12} color="#fff" /> : <FaPlay size={12} color="#fff" />}
         </button>
         {/* biome-ignore lint/a11y/noStaticElementInteractions: seek bar interaction */}
         {/* biome-ignore lint/a11y/useKeyWithClickEvents: seek bar interaction */}
         <div {...stylex.props(styles.waveformArea)} onClick={handleWaveformClick}>
            {displayBars.map((h, i) => (
               <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable ordered waveform bars
                  key={i}
                  {...stylex.props(
                     styles.bar,
                     i < playedBarCount ? styles.barPlayed : styles.barUnplayed,
                  )}
                  style={{ height: `${Math.max(Math.round(h * 36), 3)}px` }}
               />
            ))}
            <div ref={playheadRef} {...stylex.props(styles.playhead)} />
         </div>
         <span {...stylex.props(styles.timer)}>{displayTime}</span>
      </div>
   );
}
