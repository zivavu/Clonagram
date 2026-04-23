import ZetaLogo from '@/src/components/ZetaLogo/ZetaLogo';
import * as stylex from '@stylexjs/stylex';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { colors, radius } from '../../styles/tokens.stylex';

export default function EmailSignupPage() {
	const styles = stylex.create({
		root: {
			width: '100%',
			maxWidth: '650px',
			height: '100%',
			margin: '0 auto',
			marginTop: '34px',
			padding: '0 28px',
			display: 'flex',
			flexDirection: 'column',
		},
		backButton: {
			borderRadius: radius.full,
			padding: '8px',
			display: 'flex',
			width: 'fit-content',
			color: colors.textSecondary,
			':hover': {
				backgroundColor: colors.buttonHover,
			},
		},
		contentContainer: {
			display: 'flex',
			flexDirection: 'column',
			padding: '0 20px',
		},
		title: {
			fontSize: '1.5rem',
			fontWeight: '450',
			color: colors.textPrimary,
			marginTop: '16px',
		},
		description: {
			fontSize: '0.9375rem',
			fontWeight: '400',
			marginTop: '4px',
		},
	});

	return (
		<div {...stylex.props(styles.root)}>
			<Link href="/login" {...stylex.props(styles.backButton)}>
				<ChevronLeft strokeWidth={1.75} size={28} />
			</Link>
			<div {...stylex.props(styles.contentContainer)}>
				<ZetaLogo />
				<h1 {...stylex.props(styles.title)}>Get started on Clonagram</h1>
				<span {...stylex.props(styles.description)}>
					Sign up to see photos and videos from your friends.
				</span>
			</div>
		</div>
	);
}
