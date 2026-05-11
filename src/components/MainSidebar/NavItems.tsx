'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { BsSend, BsSendFill } from 'react-icons/bs';
import { FaRegSquarePlus, FaSquarePlus } from 'react-icons/fa6';
import { GoHome, GoHomeFill } from 'react-icons/go';
import {
   MdExplore,
   MdFavorite,
   MdFavoriteBorder,
   MdOutlineExplore,
   MdOutlinePerson,
   MdOutlineSmartDisplay,
   MdPerson,
   MdSearch,
   MdSmartDisplay,
} from 'react-icons/md';
import { RiBarChartBoxFill, RiBarChartBoxLine } from 'react-icons/ri';
import { useCreatePostModalStore } from '@/src/store/useCreatePostModalStore';
import { useNotificationsPortalStore } from '@/src/store/useNotificationsPortalStore';
import { useSearchPortalStore } from '@/src/store/useSearchPortalStore';
import type { MainSidebarStyles } from './index.stylex';

interface NavItemConfig {
   icon: IconType;
   activeIcon: IconType;
   label: string;
   href?: string;
   action?: 'search' | 'notifications' | 'create';
}

const navItemsConfig: NavItemConfig[] = [
   { href: '/', icon: GoHome, activeIcon: GoHomeFill, label: 'Home' },
   { href: '/reels', icon: MdOutlineSmartDisplay, activeIcon: MdSmartDisplay, label: 'Reels' },
   { href: '/direct', icon: BsSend, activeIcon: BsSendFill, label: 'Messages' },
   { icon: MdSearch, activeIcon: MdSearch, label: 'Search', action: 'search' },
   { href: '/explore', icon: MdOutlineExplore, activeIcon: MdExplore, label: 'Explore' },
   { icon: MdFavoriteBorder, activeIcon: MdFavorite, label: 'Notifications', action: 'notifications' },
   { icon: FaRegSquarePlus, activeIcon: FaSquarePlus, label: 'Create', action: 'create' },
   { href: '/dashboard', icon: RiBarChartBoxLine, activeIcon: RiBarChartBoxFill, label: 'Dashboard' },
   { href: '/profile', icon: MdOutlinePerson, activeIcon: MdPerson, label: 'Profile' },
];

interface NavItemsProps {
   initialPathname: string;
   mainSidebarStyles: MainSidebarStyles;
}

export function NavItems({ initialPathname, mainSidebarStyles }: NavItemsProps) {
   const clientPathname = usePathname();
   const pathname = clientPathname || initialPathname;
   const openSearch = useSearchPortalStore(state => state.open);
   const isSearchOpen = useSearchPortalStore(state => state.isOpen);
   const openNotifications = useNotificationsPortalStore(state => state.open);
   const isNotificationsOpen = useNotificationsPortalStore(state => state.isOpen);
   const openCreate = useCreatePostModalStore(state => state.open);

   return (
      <>
         {navItemsConfig.map(({ href, icon: Icon, activeIcon: ActiveIcon, label, action }) => {
            const isActive = (() => {
               if (action === 'search') return isSearchOpen;
               if (action === 'notifications') return isNotificationsOpen;
               if (action === 'create') return false;
               return pathname.split('/')[1] === href?.split('/')[1];
            })();

            const IconComponent = isActive ? ActiveIcon : Icon;

            const content = (
               <>
                  <IconComponent style={{ fontSize: 28 }} />
                  <span {...stylex.props(mainSidebarStyles.navItemLabel)} style={{ fontWeight: isActive ? 700 : 400 }}>
                     {label}
                  </span>
               </>
            );

            if (action === 'search') {
               return (
                  <button
                     key={label}
                     type="button"
                     onClick={openSearch}
                     aria-label={label}
                     {...stylex.props(mainSidebarStyles.navItem, isActive && mainSidebarStyles.navItemActive)}
                  >
                     {content}
                  </button>
               );
            }

            if (action === 'notifications') {
               return (
                  <button
                     key={label}
                     type="button"
                     onClick={openNotifications}
                     aria-label={label}
                     {...stylex.props(mainSidebarStyles.navItem, isActive && mainSidebarStyles.navItemActive)}
                  >
                     {content}
                  </button>
               );
            }

            if (action === 'create') {
               return (
                  <button
                     key={label}
                     type="button"
                     onClick={openCreate}
                     aria-label={label}
                     {...stylex.props(mainSidebarStyles.navItem, isActive && mainSidebarStyles.navItemActive)}
                  >
                     {content}
                  </button>
               );
            }

            if (!href) return <div {...stylex.props(mainSidebarStyles.navItem)}>{content}</div>;
            return (
               <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  {...stylex.props(mainSidebarStyles.navItem, isActive && mainSidebarStyles.navItemActive)}
               >
                  {content}
               </Link>
            );
         })}
      </>
   );
}
