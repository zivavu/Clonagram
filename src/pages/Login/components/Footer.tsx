import * as stylex from '@stylexjs/stylex';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { colors } from '../../../styles/tokens.stylex';

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

export default function Footer() {
	return (
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
	);
}
