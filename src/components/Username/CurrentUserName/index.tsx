import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { useAuthUser } from '../../../hooks/useAuthUser';

export type CurrentUserNameProps = {
   style?: StyleXStyles;
};

export default function CurrentUserName({ style }: CurrentUserNameProps) {
   const { data: user } = useAuthUser();

   return <span {...stylex.props(style)}>{user?.username}</span>;
}
