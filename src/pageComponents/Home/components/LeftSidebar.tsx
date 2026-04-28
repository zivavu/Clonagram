import AddBoxOutlined from '@mui/icons-material/AddBoxOutlined';
import AddBoxRounded from '@mui/icons-material/AddBoxRounded';
import BarChartRounded from '@mui/icons-material/BarChartRounded';
import ExploreOutlined from '@mui/icons-material/ExploreOutlined';
import ExploreRounded from '@mui/icons-material/ExploreRounded';
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRounded from '@mui/icons-material/FavoriteRounded';
import GridViewRounded from '@mui/icons-material/GridViewRounded';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import HomeRounded from '@mui/icons-material/HomeRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import PersonRounded from '@mui/icons-material/PersonRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import SmartDisplayOutlined from '@mui/icons-material/SmartDisplayOutlined';
import SmartDisplayRounded from '@mui/icons-material/SmartDisplayRounded';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { colors, radius } from '../../../styles/tokens.stylex';

const navItems = [
   { href: '/', icon: HomeOutlined, activeIcon: HomeRounded, label: 'Home' },
   { href: '/reels', icon: SmartDisplayOutlined, activeIcon: SmartDisplayRounded, label: 'Reels' },
   { href: '/explore', icon: ExploreOutlined, activeIcon: ExploreRounded, label: 'Explore' },
   { href: '/search', icon: SearchRounded, activeIcon: SearchRounded, label: 'Search' },
   { href: '/notifications', icon: FavoriteBorderRounded, activeIcon: FavoriteRounded, label: 'Notifications' },
   { href: '/create', icon: AddBoxOutlined, activeIcon: AddBoxRounded, label: 'Create' },
   { href: '/dashboard', icon: BarChartRounded, activeIcon: BarChartRounded, label: 'Dashboard' },
   { href: '/profile', icon: PersonOutlined, activeIcon: PersonRounded, label: 'Profile' },
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
   console.log(pathname, url);
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
                        <span {...stylex.props(styles.navItemLabel)} style={{ fontWeight: isActive ? 600 : 300 }}>
                           {label}
                        </span>
                     </Link>
                  );
               })}
            </nav>

            <div {...stylex.props(styles.nav)}>
               <button aria-label="More" {...stylex.props(styles.navItem)}>
                  <MenuRounded style={{ fontSize: 26 }} />
                  <span {...stylex.props(styles.navItemLabel)}>More</span>
               </button>
               <button aria-label="Other apps from Zeta" {...stylex.props(styles.navItem)}>
                  <GridViewRounded style={{ fontSize: 26 }} />
                  <span {...stylex.props(styles.navItemLabel)}>Also from Zeta</span>
               </button>
            </div>
         </div>
      </div>
   );
}
