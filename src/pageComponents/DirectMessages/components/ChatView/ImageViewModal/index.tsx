'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { styles } from './index.stylex';

interface ImageViewModalProps {
   src: string;
   onClose: () => void;
}

export default function ImageViewModal({ src, onClose }: ImageViewModalProps) {
   useEffect(() => {
      function onKey(e: KeyboardEvent) {
         if (e.key === 'Escape') onClose();
      }
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
   }, [onClose]);

   return (
      // biome-ignore lint/a11y/useKeyWithClickEvents: overlay click closes modal, Escape handled via useEffect
      // biome-ignore lint/a11y/noStaticElementInteractions: overlay backdrop
      <div {...stylex.props(styles.overlay)} onClick={onClose}>
         {/* biome-ignore lint/a11y/useKeyWithClickEvents: stops overlay click, not an interactive element */}
         {/* biome-ignore lint/a11y/noStaticElementInteractions: stops overlay click propagation */}
         <div onClick={e => e.stopPropagation()}>
            {/* biome-ignore lint/performance/noImgElement: Supabase storage or blob URL, Next Image does not support it */}
            <img src={src} alt="" {...stylex.props(styles.image)} />
         </div>
         <button type="button" {...stylex.props(styles.closeButton)} onClick={onClose}>
            <IoCloseOutline />
         </button>
      </div>
   );
}
