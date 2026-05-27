import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';

export type OtherUserUsernameProps = {
   style?: StyleXStyles;
   userProfile: { username: string | null | undefined };
};

export default function OtherUserUsername({ style, userProfile }: OtherUserUsernameProps) {
   return <span {...stylex.props(style)}>{userProfile?.username}</span>;
}
