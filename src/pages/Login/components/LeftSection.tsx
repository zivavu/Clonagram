import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { colors } from '../../../styles/tokens.stylex';

const styles = stylex.create({
	root: {
		position: 'relative',
		width: '100%',
		backgroundColor: colors.bg,
		margin: '58px',
		padding: '28px',
		marginTop: '54px',
		paddingTop: '92px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	clonagramLogo: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
	description: {
		fontSize: '2.65vw',
		marginLeft: '48px',
		fontWeight: '350',
		letterSpacing: '-0.02em',
		width: '80%',
		lineHeight: '64.8px',
		color: colors.textPrimary,
		textAlign: 'center',
	},
});

export default function LeftSection() {
	return (
		<div {...stylex.props(styles.root)}>
			<Image
				src="/clonagram.png"
				alt="Clonagram"
				{...stylex.props(styles.clonagramLogo)}
				width={78}
				height={78}
			/>
			<span {...stylex.props(styles.description)}>
				See everyday moments from your close friends.
			</span>
		</div>
	);
}
