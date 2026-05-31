'use client';

import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { BsImages } from 'react-icons/bs';
import { FaRegSquarePlus, FaSquarePlus } from 'react-icons/fa6';
import { MdOutlineSmartDisplay } from 'react-icons/md';
import { useCreatePostModalStore } from '@/src/store/useCreatePostModalStore';
import type { MainSidebarStyles } from '../MainSidebar/index.stylex';
import { styles } from './index.stylex';

interface CreateMenuPopoverProps {
   mainSidebarStyles: MainSidebarStyles;
}

export function CreateMenuPopover({ mainSidebarStyles }: CreateMenuPopoverProps) {
   const openCreate = useCreatePostModalStore(state => state.open);
   const [isOpen, setIsOpen] = useState(false);

   function handlePost() {
      setIsOpen(false);
      openCreate();
   }

   function handleReels() {
      setIsOpen(false);
      openCreate();
   }

   return (
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
         <Popover.Trigger asChild>
            <button type="button" aria-label="Create" {...stylex.props(mainSidebarStyles.navItem)}>
               {isOpen ? (
                  <FaSquarePlus style={{ fontSize: 28 }} />
               ) : (
                  <FaRegSquarePlus style={{ fontSize: 28 }} />
               )}
               <span
                  {...stylex.props(mainSidebarStyles.navItemLabel)}
                  style={{ fontWeight: isOpen ? 700 : 400 }}
               >
                  Create
               </span>
            </button>
         </Popover.Trigger>
         <Popover.Content side="bottom" sideOffset={8} align="start" {...stylex.props(styles.content)}>
            <button type="button" onClick={handlePost} {...stylex.props(styles.item)}>
               Post
               <BsImages style={{ fontSize: 18 }} />
            </button>
            <button type="button" onClick={handleReels} {...stylex.props(styles.item)}>
               Reels
               <MdOutlineSmartDisplay style={{ fontSize: 18 }} />
            </button>
         </Popover.Content>
      </Popover.Root>
   );
}
