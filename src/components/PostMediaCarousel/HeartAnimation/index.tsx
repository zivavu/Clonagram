'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { MdFavorite } from 'react-icons/md';
import { styles } from './index.stylex';

interface HeartInstance {
   id: number;
   rotation: number;
}

const ANIMATION_DURATION_MS = 750;

interface HeartAnimationProps {
   triggerCount: number;
}

export default function HeartAnimation({ triggerCount }: HeartAnimationProps) {
   const [hearts, setHearts] = useState<HeartInstance[]>([]);

   useEffect(() => {
      if (triggerCount === 0) return;
      const rotation = Math.floor(Math.random() * 50) - 25;
      const id = Date.now() + Math.random() * 1000;
      setHearts(prev => [...prev, { id, rotation }]);
      const timer = setTimeout(() => {
         setHearts(prev => prev.filter(h => h.id !== id));
      }, ANIMATION_DURATION_MS);
      return () => clearTimeout(timer);
   }, [triggerCount]);

   if (hearts.length === 0) return null;

   return (
      <div {...stylex.props(styles.overlay)}>
         {hearts.map(heart => (
            <div key={heart.id} {...stylex.props(styles.heartWrapper)}>
               <div
                  {...stylex.props(styles.heartInner)}
                  style={{ '--rotation': `${heart.rotation}deg` } as React.CSSProperties}
               >
                  <MdFavorite
                     size={140}
                     style={{
                        color: '#FF2D78',
                        filter: 'drop-shadow(0 2px 16px rgba(255, 45, 120, 0.55))',
                     }}
                  />
               </div>
            </div>
         ))}
      </div>
   );
}
