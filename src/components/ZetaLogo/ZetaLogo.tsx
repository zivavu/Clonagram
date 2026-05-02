import * as stylex from '@stylexjs/stylex';
import { MdFilterTiltShift } from 'react-icons/md';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
   },
   zetaText: {
      fontSize: '1rem',
      fontWeight: '400',
      color: colors.textPrimary,
   },
});

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
