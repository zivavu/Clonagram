import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { CURRENT_USER, SUGGESTED_USERS } from '../data';
import { styles } from './RightSidebar.stylex';

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
   'Meta Verified',
];

export default function RightSidebar() {
   return (
      <aside {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.profileCard)}>
            <Image
               src={CURRENT_USER.avatarUrl}
               alt={CURRENT_USER.username}
               width={44}
               height={44}
               style={{ borderRadius: '50%' }}
            />
            <div {...stylex.props(styles.profileInfo)}>
               <span {...stylex.props(styles.profileUsername)}>{CURRENT_USER.username}</span>
               <span {...stylex.props(styles.profileName)}>{CURRENT_USER.name}</span>
            </div>
            <Link href="/accounts/switch" {...stylex.props(styles.switchLink)}>
               Switch
            </Link>
         </div>

         <div {...stylex.props(styles.suggestionsHeader)}>
            <span {...stylex.props(styles.suggestionsLabel)}>Suggested for you</span>
            <Link href="/explore/people" {...stylex.props(styles.seeAllLink)}>
               See All
            </Link>
         </div>

         <div {...stylex.props(styles.suggestionsList)}>
            {SUGGESTED_USERS.slice(0, 5).map(user => (
               <div key={user.id} {...stylex.props(styles.suggestionItem)}>
                  <Image
                     src={user.avatarUrl}
                     alt={user.username}
                     width={44}
                     height={44}
                     style={{ borderRadius: '50%' }}
                  />
                  <div {...stylex.props(styles.suggestionInfo)}>
                     <span {...stylex.props(styles.suggestionUsername)}>{user.username}</span>
                     {user.name && (
                        <span {...stylex.props(styles.suggestionSubtext)}>
                           {user.name.length > 22 ? `${user.name.slice(0, 22)}…` : user.name}
                        </span>
                     )}
                  </div>
                  <button type="button" {...stylex.props(styles.followButton)}>
                     Follow
                  </button>
               </div>
            ))}
         </div>

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
         <div {...stylex.props(styles.copyright)}>© {new Date().getFullYear()} Clonagram from Zeta</div>
      </aside>
   );
}
