import * as stylex from '@stylexjs/stylex';
import { ApertureIcon } from 'lucide-react';
import { colors } from '../../styles/tokens.stylex';

export interface ZetaLogoProps {
   rootProps?: React.ComponentProps<'div'>;
   useText?: boolean;
   iconSize?: number;
}

export default function ZetaLogo({ rootProps, useText = true, iconSize = 20 }: ZetaLogoProps) {
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

   return (
      <div {...stylex.props(styles.root)} {...rootProps}>
         <ApertureIcon size={iconSize} color={colors.textPrimary} />
         {useText && <span {...stylex.props(styles.zetaText)}>Zeta</span>}
      </div>
   );
}
