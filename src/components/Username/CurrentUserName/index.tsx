'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { styles } from '../username.stylex';

export type CurrentUserNameProps = {
   style?: StyleXStyles;
};

export default function CurrentUserName({ style }: CurrentUserNameProps) {
   const { data: user } = useAuthUser();

   return <span {...stylex.props(styles.username, style)}>{user?.username}</span>;
}
