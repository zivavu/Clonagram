'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { IconType } from 'react-icons';
import { BsSend, BsSendFill } from 'react-icons/bs';
import {
   MdAddBox,
   MdBarChart,
   MdExplore,
   MdFavorite,
   MdFavoriteBorder,
   MdHome,
   MdOutlineAddBox,
   MdOutlineExplore,
   MdOutlineHome,
   MdOutlinePerson,
   MdOutlineSmartDisplay,
   MdPerson,
   MdSearch,
   MdSmartDisplay,
} from 'react-icons/md';
import { colors, radius } from '../../styles/tokens.stylex';

interface NavItem {
   href: string;
   icon: IconType;
   activeIcon: IconType;
   label: string;
}

const navItems: NavItem[] = [
   { href: '/', icon: MdOutlineHome, activeIcon: MdHome, label: 'Home' },
   { href: '/reels', icon: MdOutlineSmartDisplay, activeIcon: MdSmartDisplay, label: 'Reels' },
   { href: '/direct', icon: BsSend, activeIcon: BsSendFill, label: 'Messages' },
   { href: '/search', icon: MdSearch, activeIcon: MdSearch, label: 'Search' },
   { href: '/explore', icon: MdOutlineExplore, activeIcon: MdExplore, label: 'Explore' },
   { href: '/notifications', icon: MdFavoriteBorder, activeIcon: MdFavorite, label: 'Notifications' },
   { href: '/create', icon: MdOutlineAddBox, activeIcon: MdAddBox, label: 'Create' },
   { href: '/dashboard', icon: MdBarChart, activeIcon: MdBarChart, label: 'Dashboard' },
   { href: '/profile', icon: MdOutlinePerson, activeIcon: MdPerson, label: 'Profile' },
];

const styles = stylex.create({
   navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 8px',
      borderRadius: radius.md,
      color: colors.textPrimary,
      transition: 'background-color 0.15s ease',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   navItemActive: {
      fontWeight: 600,
   },
   navItemLabel: {
      fontSize: '1rem',
      fontWeight: 400,
      color: colors.textPrimary,
      display: 'var(--label-display)',
   },
});

interface NavItemsProps {
   /** The pathname from the initial server render, so there's no flash of wrong icons. */
   initialPathname: string;
}

export function NavItems({ initialPathname }: NavItemsProps) {
   const clientPathname = usePathname();
   // Fall back to initialPathname during hydration so icons match the SSR output
   const pathname = clientPathname || initialPathname;

   return (
      <>
         {navItems.map(({ href, icon: Icon, activeIcon: ActiveIcon, label }) => {
            const isActive = pathname === href;
            const IconComponent = isActive ? ActiveIcon : Icon;
            return (
               <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  {...stylex.props(styles.navItem, isActive && styles.navItemActive)}
               >
                  <IconComponent style={{ fontSize: 26 }} />
                  <span {...stylex.props(styles.navItemLabel)} style={{ fontWeight: isActive ? 600 : 400 }}>
                     {label}
                  </span>
               </Link>
            );
         })}
      </>
   );
}
