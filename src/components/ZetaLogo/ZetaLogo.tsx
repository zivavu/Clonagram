import * as stylex from '@stylexjs/stylex';
import { MdFilterTiltShift } from 'react-icons/md';
import { colors } from '../../styles/tokens.stylex';
import { styles } from './ZetaLogo.stylex';

export interface ZetaLogoProps {
   rootProps?: React.ComponentProps<'div'>;
   useText?: boolean;
   iconSize?: number;
}

export default function ZetaLogo({ rootProps, useText = true, iconSize = 20 }: ZetaLogoProps) {
   return (
      <div {...stylex.props(styles.root)} {...rootProps}>
         <MdFilterTiltShift size={iconSize} style={{ color: colors.textPrimary }} />
         {useText && <span {...stylex.props(styles.zetaText)}>Zeta</span>}
      </div>
   );
}
