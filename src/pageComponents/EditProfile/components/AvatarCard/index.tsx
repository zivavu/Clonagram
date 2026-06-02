import * as stylex from '@stylexjs/stylex';
import UserAvatar from '@/src/components/UserAvatar';
import { styles } from './index.stylex';

interface AvatarCardProps {
   avatarUrl: string | null;
   username: string;
   fullName: string;
   onChangePhoto: () => void;
}

export default function AvatarCard({
   avatarUrl,
   username,
   fullName,
   onChangePhoto,
}: AvatarCardProps) {
   return (
      <div {...stylex.props(styles.root)}>
         <UserAvatar src={avatarUrl} alt={username} size={56} />
         <div {...stylex.props(styles.info)}>
            <span {...stylex.props(styles.username)}>{username}</span>
            {fullName && <span {...stylex.props(styles.fullName)}>{fullName}</span>}
         </div>
         <button type="button" {...stylex.props(styles.changeBtn)} onClick={onChangePhoto}>
            Change photo
         </button>
      </div>
   );
}
