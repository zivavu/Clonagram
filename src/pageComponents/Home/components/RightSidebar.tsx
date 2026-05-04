import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { colors } from '../../../styles/tokens.stylex';
import { CURRENT_USER, SUGGESTED_USERS } from '../data';

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

const styles = stylex.create({
   root: {
      width: '350px',
      marginLeft: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingLeft: '48px',
   },
   profileCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
   },
   profileInfo: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
   },
   profileUsername: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   profileName: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   switchLink: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.accent,
      textDecoration: 'none',
      flexShrink: 0,
      ':hover': {
         color: colors.accentHover,
      },
   },
   suggestionsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '4px',
   },
   suggestionsLabel: {
      fontSize: '0.875rem',
      fontWeight: 600,
   },
   seeAllLink: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.textPrimary,
      textDecoration: 'none',
      ':hover': {
         color: colors.textSecondary,
      },
   },
   suggestionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
   },
   suggestionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '4px 0',
   },
   suggestionInfo: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
   },
   suggestionUsername: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   suggestionSubtext: {
      fontSize: '0.8rem',
      color: colors.textSecondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   followButton: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.accent,
      ':hover': {
         color: colors.accentHover,
      },
   },
   footerLinksContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0 6px',
      marginTop: '18px',
   },
   footerLink: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
      textDecoration: 'none',
      ':hover': {
         textDecoration: 'underline',
      },
   },
   copyright: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
      marginTop: '6px',
      textTransform: 'uppercase',
   },
});

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
