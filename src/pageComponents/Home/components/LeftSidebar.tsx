import * as stylex from '@stylexjs/stylex';
import {
   BarChart2,
   Heart,
   Home as HomeIcon,
   LayoutGrid,
   Menu,
   MonitorPlay,
   Navigation,
   PlusSquare,
   Search,
   User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { colors, radius } from '../../../styles/tokens.stylex';

const navItems = [
   { href: '/', icon: HomeIcon, label: 'Home' },
   { href: '/reels', icon: MonitorPlay, label: 'Reels' },
   { href: '/explore', icon: Navigation, label: 'Explore' },
   { href: '/search', icon: Search, label: 'Search' },
   { href: '/notifications', icon: Heart, label: 'Notifications' },
   { href: '/create', icon: PlusSquare, label: 'Create' },
   { href: '/dashboard', icon: BarChart2, label: 'Dashboard' },
   { href: '/profile', icon: User, label: 'Profile' },
];

const styles = stylex.create({
   root: {
      width: '280px',
      padding: '16px',
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
      fontWeight: 300,
      color: colors.textPrimary,
      display: 'var(--label-display)',
   },
});

export default function LeftSidebar({ url }: { url: string | null }) {
   const pathname = url ? new URL(url).pathname : '/';
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.leftSidebarContent)}>
            <Link href="/" {...stylex.props(styles.navItem)}>
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
               {navItems.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname === href;
                  return (
                     <Link
                        key={href}
                        href={href}
                        aria-label={label}
                        {...stylex.props(styles.navItem, isActive && styles.navItemActive)}
                     >
                        <Icon size={26} strokeWidth={isActive ? 2.25 : 1.75} />
                        <span {...stylex.props(styles.navItemLabel)} style={{ fontWeight: isActive ? 600 : 300 }}>
                           {label}
                        </span>
                     </Link>
                  );
               })}
            </nav>
            <div {...stylex.props(styles.nav)}>
               <button aria-label="More" {...stylex.props(styles.navItem)}>
                  <Menu size={26} strokeWidth={1.75} />
                  <span {...stylex.props(styles.navItemLabel)}>More</span>
               </button>
               <button aria-label="Other apps from Zeta" {...stylex.props(styles.navItem)}>
                  <LayoutGrid size={26} strokeWidth={1.75} />
                  <span {...stylex.props(styles.navItemLabel)}>Also from Zeta</span>
               </button>
            </div>
         </div>
      </div>
   );
}
