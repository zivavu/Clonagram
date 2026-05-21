import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import UserAvatar from '@/src/components/UserAvatar';
import { createServerClient } from '@/src/lib/supabase/server';
import { SUGGESTED_USERS } from '@/src/pageComponents/mocks/users';
import { styles } from './index.stylex';
import LogoutButton from './LogoutButton';

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

export default async function RightSidebar() {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url')
      .eq('id', user!.id)
      .single();

   return (
      <aside {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.profileCard)}>
            <UserAvatar src={profile?.avatar_url ?? null} alt={profile?.username ?? ''} size={44} />
            <div {...stylex.props(styles.profileInfo)}>
               <span {...stylex.props(styles.profileUsername)}>{profile?.username}</span>
               <span {...stylex.props(styles.profileName)}>{profile?.full_name}</span>
            </div>
            <LogoutButton />
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
                  <UserAvatar src={user.avatar_url} alt={user.username} size={44} />
                  <div {...stylex.props(styles.suggestionInfo)}>
                     <span {...stylex.props(styles.suggestionUsername)}>{user.username}</span>
                     {user.full_name && (
                        <span {...stylex.props(styles.suggestionSubtext)}>
                           {user.full_name.length > 22
                              ? `${user.full_name.slice(0, 22)}…`
                              : user.full_name}
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
         <div {...stylex.props(styles.copyright)}>
            © {new Date().getFullYear()} Clonagram from Zeta
         </div>
      </aside>
   );
}
