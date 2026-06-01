import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { styles } from './index.stylex';

const FOOTER_LINKS = [
   'About',
   'Help',
   'Press',
   'API',
   'Jobs',
   'Privacy',
   'Terms',
   'Locations',
   'Language',
   'Zeta Verified',
];

export default function SidebarFooter() {
   return (
      <>
         <div {...stylex.props(styles.footerLinksContainer)}>
            {FOOTER_LINKS.map((link, i) => (
               <span key={link}>
                  <Link href="/" {...stylex.props(styles.footerLink)}>
                     {link}
                  </Link>
                  {i < FOOTER_LINKS.length - 1 && <span> </span>}
               </span>
            ))}
         </div>
         <div {...stylex.props(styles.copyright)}>
            © {new Date().getFullYear()} Clonagram from Zeta
         </div>
      </>
   );
}
