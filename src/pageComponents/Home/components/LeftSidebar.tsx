import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import {
   MdAddBox,
   MdBarChart,
   MdExplore,
   MdFavorite,
   MdFavoriteBorder,
   MdGridView,
   MdHome,
   MdMenu,
   MdOutlineAddBox,
   MdOutlineExplore,
   MdOutlineHome,
   MdOutlinePerson,
   MdOutlineSmartDisplay,
   MdPerson,
   MdSearch,
   MdSmartDisplay,
} from 'react-icons/md';
import { colors, radius } from '../../../styles/tokens.stylex';

const navItems = [
   { href: '/', icon: MdOutlineHome, activeIcon: MdHome, label: 'Home' },
   { href: '/reels', icon: MdOutlineSmartDisplay, activeIcon: MdSmartDisplay, label: 'Reels' },
   { href: '/explore', icon: MdOutlineExplore, activeIcon: MdExplore, label: 'Explore' },
   { href: '/search', icon: MdSearch, activeIcon: MdSearch, label: 'Search' },
   { href: '/notifications', icon: MdFavoriteBorder, activeIcon: MdFavorite, label: 'Notifications' },
   { href: '/create', icon: MdOutlineAddBox, activeIcon: MdAddBox, label: 'Create' },
   { href: '/dashboard', icon: MdBarChart, activeIcon: MdBarChart, label: 'Dashboard' },
   { href: '/profile', icon: MdOutlinePerson, activeIcon: MdPerson, label: 'Profile' },
];

const styles = stylex.create({
   root: {
      width: '280px',
      padding: '16px',
      height: '100svh',
      position: 'sticky',
      top: 0,
   },
   leftSidebarContent: {
      display: 'flex',
      flexDirection: 'column',
      height: '100svh',
      width: 'min-content',
      justifyContent: 'space-between',
      paddingBottom: '36px',
      gap: '12px',
      '--label-display': 'none',
      ':hover': {
         '--label-display': 'block',
         width: '100%',
      },
   },
   nav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
   },
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
      color: colors.textPrimary,
   },
   navItemLabel: {
      fontSize: '1rem',
      fontWeight: 400,
      color: colors.textPrimary,
      display: 'var(--label-display)',
   },
});

export default function LeftSidebar({ url }: { url: string | null }) {
   const pathname = url ? new URL(url).pathname : '/';
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.leftSidebarContent)}>
            <Link href="/" {...stylex.props(styles.navItem)} style={{ width: 'fit-content' }}>
               <Image
                  src="/clonagram.png"
                  alt="Clonagram"
                  width={26}
                  height={26}
                  style={{ filter: 'brightness(0) invert(1)' }}
                  loading="eager"
               />
            </Link>

            <nav {...stylex.props(styles.nav)}>
               {navItems.map(({ href, icon, activeIcon, label }) => {
                  const isActive = pathname === href;
                  const Icon = isActive ? activeIcon : icon;
                  return (
                     <Link
                        key={href}
                        href={href}
                        aria-label={label}
                        {...stylex.props(styles.navItem, isActive && styles.navItemActive)}
                     >
                        <Icon style={{ fontSize: 26 }} />
                        <span {...stylex.props(styles.navItemLabel)} style={{ fontWeight: isActive ? 600 : 400 }}>
                           {label}
                        </span>
                     </Link>
                  );
               })}
            </nav>

            <div {...stylex.props(styles.nav)}>
               <button aria-label="More" {...stylex.props(styles.navItem)}>
                  <MdMenu style={{ fontSize: 26 }} />
                  <span {...stylex.props(styles.navItemLabel)}>More</span>
               </button>
               <button aria-label="Other apps from Zeta" {...stylex.props(styles.navItem)}>
                  <MdGridView style={{ fontSize: 26 }} />
                  <span {...stylex.props(styles.navItemLabel)}>Also from Zeta</span>
               </button>
            </div>
         </div>
      </div>
   );
}
