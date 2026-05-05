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
import type { MainSidebarStyles } from './MainSidebar.stylex';

interface NavItem {
   href: string;
   icon: IconType;
   activeIcon: IconType;
   label: string;
}

const navItems: NavItem[] = [
   { href: '/', icon: GoHome, activeIcon: GoHomeFill, label: 'Home' },
   { href: '/reels', icon: MdOutlineSmartDisplay, activeIcon: MdSmartDisplay, label: 'Reels' },
   { href: '/direct', icon: BsSend, activeIcon: BsSendFill, label: 'Messages' },
   { href: '/search', icon: MdSearch, activeIcon: MdSearch, label: 'Search' },
   { href: '/explore', icon: MdOutlineExplore, activeIcon: MdExplore, label: 'Explore' },
   { href: '/notifications', icon: MdFavoriteBorder, activeIcon: MdFavorite, label: 'Notifications' },
   { href: '/create', icon: FaRegSquarePlus, activeIcon: FaSquarePlus, label: 'Create' },
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

   return (
      <>
         {navItems.map(({ href, icon: Icon, activeIcon: ActiveIcon, label }) => {
            const isActive = pathname.split('/')[1] === href.split('/')[1];
            const IconComponent = isActive ? ActiveIcon : Icon;
            return (
               <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  {...stylex.props(mainSidebarStyles.navItem, isActive && mainSidebarStyles.navItemActive)}
               >
                  <IconComponent style={{ fontSize: 28 }} />
                  <span {...stylex.props(mainSidebarStyles.navItemLabel)} style={{ fontWeight: isActive ? 700 : 400 }}>
                     {label}
                  </span>
               </Link>
            );
         })}
      </>
   );
}
