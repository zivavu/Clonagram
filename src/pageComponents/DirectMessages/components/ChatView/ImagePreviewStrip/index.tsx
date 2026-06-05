'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { TbPhoto } from 'react-icons/tb';
import { styles } from './index.stylex';

export interface PendingImage {
   file: File;
   previewUrl: string;
}

interface ImagePreviewStripProps {
   images: PendingImage[];
   onRemove: (index: number) => void;
   onAdd: (files: File[]) => void;
}

export default function ImagePreviewStrip({ images, onRemove, onAdd }: ImagePreviewStripProps) {
   const fileInputRef = useRef<HTMLInputElement>(null);

   function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
      const files = Array.from(e.target.files ?? []).filter(f => f.type.startsWith('image/'));
      if (files.length) onAdd(files);
      e.target.value = '';
   }

   return (
      <div {...stylex.props(styles.strip)}>
         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
         />
         <div
            {...stylex.props(styles.addButton, styles.addButtonHovered, styles.showTooltip)}
            onClick={() => fileInputRef.current?.click()}
         >
            <TbPhoto />
            <span {...stylex.props(styles.tooltip)}>Upload another photo/video</span>
         </div>
         {images.map((img, i) => (
            <div key={img.previewUrl} {...stylex.props(styles.thumbnail)}>
               <img src={img.previewUrl} alt="" {...stylex.props(styles.thumbnailImg)} />
               <div {...stylex.props(styles.removeButton)} onClick={() => onRemove(i)}>
                  <IoCloseOutline />
               </div>
            </div>
         ))}
      </div>
   );
}
