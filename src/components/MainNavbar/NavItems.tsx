'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { BsSend, BsSendFill } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import { GoHome, GoHomeFill } from 'react-icons/go';
import {
   MdExplore,
   MdFavorite,
   MdFavoriteBorder,
   MdOutlineExplore,
   MdOutlineSmartDisplay,
   MdSearch,
   MdSmartDisplay,
} from 'react-icons/md';
import UserAvatar from '@/src/components/UserAvatar';
import { useNotificationsPortalStore, useSearchPortalStore } from '@/src/store/createModalStore';
import { CreateMenuPopover } from '../CreateMenuPopover';
import type { MainSidebarStyles } from './index.stylex';

interface NavItemConfig {
   icon?: IconType;
   activeIcon?: IconType;
   label: string;
   href?: string;
   action?: 'search' | 'notifications' | 'create';
   mobileOrder: number;
}

const navItemsConfig: NavItemConfig[] = [
   { href: '/', icon: GoHome, activeIcon: GoHomeFill, label: 'Home', mobileOrder: 0 },
   {
      href: '/reels',
      icon: MdOutlineSmartDisplay,
      activeIcon: MdSmartDisplay,
      label: 'Reels',
      mobileOrder: 2,
   },
   { href: '/direct', icon: BsSend, activeIcon: BsSendFill, label: 'Messages', mobileOrder: 4 },
   { icon: MdSearch, activeIcon: MdSearch, label: 'Search', action: 'search', mobileOrder: 1 },
   {
      href: '/explore',
      icon: MdOutlineExplore,
      activeIcon: MdExplore,
      label: 'Explore',
      mobileOrder: 5,
   },
   {
      icon: MdFavoriteBorder,
      activeIcon: MdFavorite,
      label: 'Notifications',
      action: 'notifications',
      mobileOrder: 6,
   },
   { icon: FiPlus, activeIcon: FiPlus, label: 'Create', action: 'create', mobileOrder: 3 },
   { href: '/profile', label: 'Profile', mobileOrder: 7 },
];

interface NavItemsProps {
   mainSidebarStyles: MainSidebarStyles;
   profile: { id: string; avatar_url: string | null; username: string } | null;
   isAnonymous: boolean;
}

export function NavItems({ mainSidebarStyles, profile, isAnonymous }: NavItemsProps) {
   const pathname = usePathname();
   const openSearch = useSearchPortalStore(state => state.open);
   const isSearchOpen = useSearchPortalStore(state => state.isOpen);
   const openNotifications = useNotificationsPortalStore(state => state.open);
   const isNotificationsOpen = useNotificationsPortalStore(state => state.isOpen);

   return (
      <>
         {navItemsConfig.map(
            ({ href, icon: Icon, activeIcon: ActiveIcon, label, action, mobileOrder }) => {
               if (isAnonymous && (label === 'Messages' || label === 'Profile')) return null;
               const isActive = (() => {
                  if (action === 'search') return isSearchOpen;
                  if (action === 'notifications') return isNotificationsOpen;
                  if (action === 'create') return false;
                  return pathname.split('/')[1] === href?.split('/')[1];
               })();

               const IconComponent = isActive ? ActiveIcon : Icon;

               const iconElement =
                  label === 'Profile' ? (
                     <UserAvatar
                        src={profile?.avatar_url ?? null}
                        alt={profile?.username ?? ''}
                        size={28}
                        username={profile?.username ?? ''}
                     />
                  ) : (
                     IconComponent && <IconComponent size={28} />
                  );

               const content = (
                  <>
                     {iconElement}
                     <span
                        {...stylex.props(mainSidebarStyles.navItemLabel)}
                        style={{ fontWeight: isActive ? 700 : 400 }}
                     >
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
                        style={{ order: mobileOrder }}
                        {...stylex.props(
                           mainSidebarStyles.navItem,
                           isActive && mainSidebarStyles.navItemActive,
                        )}
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
                        style={{ order: mobileOrder }}
                        {...stylex.props(
                           mainSidebarStyles.navItem,
                           isActive && mainSidebarStyles.navItemActive,
                           mainSidebarStyles.mobileHidden,
                        )}
                     >
                        {content}
                     </button>
                  );
               }

               if (action === 'create') {
                  return (
                     <CreateMenuPopover
                        key={label}
                        mainSidebarStyles={mainSidebarStyles}
                        isAnonymous={isAnonymous}
                        mobileOrder={mobileOrder}
                     />
                  );
               }

               if (!href)
                  return (
                     <div
                        {...stylex.props(mainSidebarStyles.navItem)}
                        style={{ order: mobileOrder }}
                     >
                        {content}
                     </div>
                  );
               return (
                  <Link
                     key={href}
                     href={href}
                     aria-label={label}
                     style={{ order: mobileOrder }}
                     {...stylex.props(
                        mainSidebarStyles.navItem,
                        isActive && mainSidebarStyles.navItemActive,
                     )}
                  >
                     {content}
                  </Link>
               );
            },
         )}
      </>
   );
}
