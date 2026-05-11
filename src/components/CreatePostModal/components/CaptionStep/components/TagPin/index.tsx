'use client';

import * as stylex from '@stylexjs/stylex';
import { IoClose } from 'react-icons/io5';
import type { TaggedPerson } from '../../../../types';
import { styles } from './index.stylex';

interface TagPinProps {
   tag: TaggedPerson;
   onRemove: () => void;
}

export default function TagPin({ tag, onRemove }: TagPinProps) {
   return (
      <div {...stylex.props(styles.pin)} style={{ left: `${tag.x}%`, top: `${tag.y}%` }}>
         <div {...stylex.props(styles.label)}>
            <span>{tag.user.username}</span>
            <button
               type="button"
               {...stylex.props(styles.removeBtn)}
               onClick={e => {
                  e.stopPropagation();
                  onRemove();
               }}
            >
               <IoClose style={{ fontSize: 24 }} />
            </button>
         </div>
      </div>
   );
}
