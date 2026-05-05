import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { styles } from './index.stylex';

const footerLinks = [
   'Meta',
   'About',
   'Blog',
   'Jobs',
   'Help',
   'API',
   'Privacy',
   'Cookie Settings',
   'Terms',
   'Locations',
   'Clonagram Lite',
   'Meta AI',
   'Threads',
   'Contact Uploading & Non-Users',
   'Meta Verified',
] as const;

export default function AuthPagesFooter({ ...props }: React.ComponentProps<'footer'>) {
   return (
      <footer {...stylex.props(styles.root)} {...props}>
         <div {...stylex.props(styles.footerLinks)}>
            {footerLinks.map(item => (
               <Link key={item} href="/" {...stylex.props(styles.footerLink)}>
                  {item}
               </Link>
            ))}
         </div>
         <div {...stylex.props(styles.footerMetaRow)}>
            <button type="button" {...stylex.props(styles.languageButton)}>
               English
               <MdKeyboardArrowDown style={{ fontSize: 14 }} />
            </button>
            <span>© {new Date().getFullYear()} Clonagram from Zeta</span>
         </div>
      </footer>
   );
}
