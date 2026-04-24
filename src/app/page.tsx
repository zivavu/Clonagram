'use client';

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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ZetaLogo from '../components/ZetaLogo/ZetaLogo';
import { colors, radius } from '../styles/tokens.stylex';

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

export default function Home() {
   const pathname = usePathname();

   const styles = stylex.create({
      root: {
         display: 'flex',
         flexDirection: 'column',
         gap: '12px',
         height: '100%',
      },
      rightSidebar: {
         width: '652px',
         height: '100%',
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'space-between',
         gap: '12px',
         padding: '16px',
         paddingBottom: '26px',
      },
      nav: {
         display: 'flex',
         flexDirection: 'column',
         gap: '12px',
      },
      navItem: {
         display: 'flex',
         alignItems: 'center',
         padding: '8px',
         width: 'fit-content',
         borderRadius: radius.md,
         color: colors.textPrimary,
         transition: 'background-color 0.15s ease',

         ':hover': {
            backgroundColor: colors.buttonHover,
         },
      },
      navItemActive: {
         backgroundColor: colors.buttonHover,
      },
   });

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.rightSidebar)}>
            <Link href="/" {...stylex.props(styles.navItem)}>
               <ZetaLogo useText={false} iconSize={26} />
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
                     </Link>
                  );
               })}
            </nav>
            <div {...stylex.props(styles.nav)}>
               <button aria-label="More" {...stylex.props(styles.navItem)}>
                  <Menu size={26} strokeWidth={1.75} />
               </button>
               <button aria-label="Apps" {...stylex.props(styles.navItem)}>
                  <LayoutGrid size={26} strokeWidth={1.75} />
               </button>
            </div>
         </div>
      </div>
   );
}
