'use client';

import LoginPageButton from '@/src/components/LoginPageButton';
import * as stylex from '@stylexjs/stylex';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FloatingInput from '../../components/FloatingInput';
import { colors, radii } from '../../styles/tokens.stylex';
import loginCardPeople from './loginCardPeople';

const footerLinks = [
	'Meta',
	'About',
	'Blog',
	'Jobs',
	'Help',
	'API',
	'Privacy',
	'Cookie Settings',
	'Terms',
	'Locations',
	'Instagram Lite',
	'Meta AI',
	'Threads',
	'Contact Uploading & Non-Users',
	'Meta Verified',
] as const;

const styles = stylex.create({
	root: {
		width: '100%',
		minHeight: '100svh',
		height: '100svh',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: colors.bg,
	},
	content: {
		flex: 1,
		display: 'flex',
		width: '100%',
	},
	leftSection: {
		width: '100%',
		height: '100%',
		backgroundColor: colors.bg,
	},
	rightSection: {
		minWidth: '652px',
		maxWidth: '750px',
		height: '100%',
		backgroundColor: colors.bgSecondary,
		borderLeftWidth: '2px',
		borderLeftStyle: 'solid',
		borderLeftColor: colors.border,
		padding: '52px',
		paddingTop: '96px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: '16px',
	},
	backButton: {
		backgroundColor: 'transparent',
		border: 'none',
		cursor: 'pointer',
		borderRadius: radii.full,
		padding: '8px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		':hover': {
			backgroundColor: colors.buttonHover,
		},
	},
	titleContainer: {
		fontSize: '18px',
		fontWeight: '600',
		color: colors.textPrimary,
		alignSelf: 'flex-start',
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
		marginBottom: '10px',
	},
	reportContent: {
		marginTop: '42px',
		fontSize: '0.8125rem',
		color: colors.textSecondary,
	},
	reportContentLink: {
		color: colors.accentText,
		fontSize: '0.8125rem',
		fontWeight: '600',
		':hover': {
			color: colors.accentTextHover,
			textDecoration: 'underline',
		},
	},
	footer: {
		width: '100%',
		height: '135px',
		paddingTop: '22px',
		paddingBottom: '20px',
		paddingLeft: '32px',
		paddingRight: '32px',
		backgroundColor: colors.bg,
		borderTopWidth: '1px',
		borderTopStyle: 'solid',
		borderTopColor: colors.border,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '18px',
		fontSize: '0.75rem',
	},
	footerLinks: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		columnGap: '12px',
		rowGap: '8px',
		maxWidth: '1220px',
	},
	footerLink: {
		fontSize: '0.75rem',
		lineHeight: '1.2',
		color: '#a8adb7',
		':hover': {
			textDecoration: 'underline',
		},
	},
	footerMetaRow: {
		display: 'flex',
		alignItems: 'center',
		gap: '16px',
		color: '#9ea4b0',
		fontSize: '0.75rem',
	},
	languageButton: {
		display: 'flex',
		alignItems: 'center',
		gap: '6px',
		color: '#9ea4b0',
	},
});

const GoogleIcon = (
	<Image src="/icons/google.svg" alt="" aria-hidden width={20} height={20} />
);

export default function LoginPage() {
	const router = useRouter();

	return (
		<div {...stylex.props(styles.root)}>
			<div {...stylex.props(styles.content)}>
				<div {...stylex.props(styles.leftSection)}></div>
				<div {...stylex.props(styles.rightSection)}>
					<div {...stylex.props(styles.titleContainer)}>
						<button
							onClick={() => router.push('/')}
							{...stylex.props(styles.backButton)}>
							<ChevronLeft />
						</button>
						Log into Clonagram
					</div>
					<FloatingInput label="Mobile number, username or email" />
					<FloatingInput label="Password" type="password" />
					<LoginPageButton
						variant="primary"
						text="Log in"
						style={{ marginTop: '12px' }}
					/>
					<LoginPageButton variant="transparent" text="Forgot password?" />
					<LoginPageButton
						variant="outlined"
						text="Log in with Google"
						icon={GoogleIcon}
						style={{ marginTop: '42px' }}
					/>
					<LoginPageButton
						variant="outlined"
						text="Create new account"
						style={{ borderColor: colors.accent, color: colors.accent }}
					/>
					<span {...stylex.props(styles.reportContent)}>
						You can also{' '}
						<Link href="/" {...stylex.props(styles.reportContentLink)}>
							report content you believe is unlawful
						</Link>{' '}
						in your country without logging in.
					</span>
				</div>
			</div>
			<footer {...stylex.props(styles.footer)}>
				<div {...stylex.props(styles.footerLinks)}>
					{footerLinks.map((item) => (
						<Link key={item} href="/" {...stylex.props(styles.footerLink)}>
							{item}
						</Link>
					))}
				</div>
				<div {...stylex.props(styles.footerMetaRow)}>
					<button type="button" {...stylex.props(styles.languageButton)}>
						English
						<ChevronDown size={14} />
					</button>
					<span>© 2026 Instagram from Meta</span>
				</div>
			</footer>
		</div>
	);
}
