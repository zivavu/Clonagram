'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import {
   fetchFeaturedAnimations,
   type LottieAnimation,
   searchAnimations,
} from '@/src/utils/lottieApi';
import { styles } from './index.stylex';

interface StickerPickerProps {
   onSelect: (url: string) => void;
   onClose: () => void;
}

export default function StickerPicker({ onSelect, onClose }: StickerPickerProps) {
   const [query, setQuery] = useState('');
   const [animations, setAnimations] = useState<LottieAnimation[]>([]);
   const [loading, setLoading] = useState(true);
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
         if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            onClose();
         }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, [onClose]);

   useEffect(() => {
      setLoading(true);
      if (!query.trim()) {
         fetchFeaturedAnimations().then(data => {
            setAnimations(data);
            setLoading(false);
         });
         return;
      }
      const timer = setTimeout(() => {
         searchAnimations(query).then(data => {
            setAnimations(data);
            setLoading(false);
         });
      }, 350);
      return () => clearTimeout(timer);
   }, [query]);

   return (
      <div ref={containerRef} {...stylex.props(styles.popover)}>
         <div {...stylex.props(styles.searchWrapper)}>
            <input
               {...stylex.props(styles.searchInput)}
               placeholder="Search stickers..."
               value={query}
               onChange={e => setQuery(e.target.value)}
            />
         </div>
         <div {...stylex.props(styles.grid)}>
            {!loading && animations.length === 0 && (
               <span {...stylex.props(styles.empty)}>No stickers found</span>
            )}
            {animations.map(anim => (
               <button
                  type="button"
                  key={anim.id}
                  {...stylex.props(styles.cell)}
                  onClick={() => onSelect(anim.jsonUrl)}
               >
                  <DotLottieReact
                     src={anim.jsonUrl}
                     playOnHover
                     style={{ width: '100%', height: '100%' }}
                  />
               </button>
            ))}
         </div>
      </div>
   );
}
