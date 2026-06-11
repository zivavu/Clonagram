'use client';

import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useState } from 'react';
import { BsImages } from 'react-icons/bs';
import { FaRegSquarePlus, FaSquarePlus } from 'react-icons/fa6';
import { LuCircleFadingPlus } from 'react-icons/lu';
import { MdOutlineSmartDisplay } from 'react-icons/md';
import { useCreateStoryModalStore } from '@/src/store/createModalStore';
import { useCreatePostModalStore } from '@/src/store/useCreatePostModalStore';
import type { MainSidebarStyles } from '../MainNavbar/index.stylex';
import { styles } from './index.stylex';

interface CreateMenuPopoverProps {
   mainSidebarStyles: MainSidebarStyles;
   isAnonymous: boolean;
   mobileOrder?: number;
}

export function CreateMenuPopover({
   mainSidebarStyles,
   isAnonymous,
   mobileOrder,
}: CreateMenuPopoverProps) {
   const openCreate = useCreatePostModalStore(state => state.open);
   const { open: openStoryCreate } = useCreateStoryModalStore();
   const [isOpen, setIsOpen] = useState(false);

   function handlePost() {
      setIsOpen(false);
      openCreate('post');
   }

   function handleReels() {
      setIsOpen(false);
      openCreate('reel');
   }

   function handleStory() {
      setIsOpen(false);
      openStoryCreate();
   }

   return (
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
         <Popover.Trigger asChild>
            <button
               type="button"
               aria-label="Create"
               style={{ order: mobileOrder }}
               {...stylex.props(mainSidebarStyles.navItem)}
            >
               {isOpen ? <FaSquarePlus size={28} /> : <FaRegSquarePlus size={28} />}
               <span
                  {...stylex.props(mainSidebarStyles.navItemLabel)}
                  style={{ fontWeight: isOpen ? 700 : 400 }}
               >
                  Create
               </span>
            </button>
         </Popover.Trigger>
         <Popover.Content
            side="top"
            sideOffset={8}
            align="center"
            {...stylex.props(styles.content)}
         >
            {isAnonymous ? (
               <div {...stylex.props(styles.anonMessage)}>
                  Log in to create posts, reels, and stories.
                  <Link href="/login" {...stylex.props(styles.anonLoginLink)}>
                     Log in
                  </Link>
               </div>
            ) : (
               <>
                  <button type="button" onClick={handlePost} {...stylex.props(styles.item)}>
                     Post
                     <BsImages size={18} />
                  </button>
                  <button type="button" onClick={handleReels} {...stylex.props(styles.item)}>
                     Reel
                     <MdOutlineSmartDisplay size={18} />
                  </button>
                  <button type="button" onClick={handleStory} {...stylex.props(styles.item)}>
                     Story
                     <LuCircleFadingPlus size={18} />
                  </button>
               </>
            )}
         </Popover.Content>
      </Popover.Root>
   );
}
