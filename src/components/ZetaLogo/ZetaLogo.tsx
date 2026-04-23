import * as stylex from '@stylexjs/stylex';
import { ApertureIcon } from 'lucide-react';
import { colors } from '../../styles/tokens.stylex';

export default function ZetaLogo({
	rootProps,
}: {
	rootProps?: React.ComponentProps<'div'>;
}) {
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
			<ApertureIcon size={20} color={colors.textPrimary} />
			<span {...stylex.props(styles.zetaText)}>Zeta</span>
		</div>
	);
}
