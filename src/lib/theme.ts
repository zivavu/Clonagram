import * as stylex from '@stylexjs/stylex';
import { darkTheme } from '@/src/styles/tokens.stylex';

export const darkClass = (stylex.props(darkTheme) as unknown as { className: string }).className;
