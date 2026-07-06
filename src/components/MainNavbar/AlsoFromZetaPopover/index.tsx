'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { MdGridView } from 'react-icons/md';
import type { MainSidebarStyles } from '../index.stylex';
import { styles } from './index.stylex';

interface AlsoFromZetaPopoverProps {
   mainSidebarStyles: MainSidebarStyles;
}

export function AlsoFromZetaPopover({ mainSidebarStyles }: AlsoFromZetaPopoverProps) {
   return (
      <Popover>
         <PopoverTrigger asChild>
            <button aria-label="Other apps from Zeta" {...stylex.props(mainSidebarStyles.navItem)}>
               <MdGridView size={28} />
               <span {...stylex.props(mainSidebarStyles.navItemLabel)}>Also from Zeta</span>
            </button>
         </PopoverTrigger>
         <PopoverContent side="top" sideOffset={8} {...stylex.props(styles.root)}>
            <a
               href="https://clonedbook.vercel.app/"
               target="_blank"
               rel="noopener noreferrer"
               {...stylex.props(styles.item)}
            >
               <Image
                  src="/clonedbook-logo-200.png"
                  alt="Clonedbook"
                  width={36}
                  height={36}
                  {...stylex.props(styles.logo)}
               />
               <div {...stylex.props(styles.itemText)}>
                  <span {...stylex.props(styles.itemTitle)}>Clonedbook</span>
                  <span {...stylex.props(styles.itemSubtitle)}>A cloned Facebook experience</span>
               </div>
            </a>
         </PopoverContent>
      </Popover>
   );
}
