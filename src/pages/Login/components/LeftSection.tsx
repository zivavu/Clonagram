import * as stylex from '@stylexjs/stylex';
import { HeartIcon } from 'lucide-react';
import Image from 'next/image';
import { useSyncExternalStore } from 'react';
import { colors, radius } from '../../../styles/tokens.stylex';
import loginCardPeople, { LoginCardPerson } from '../loginCardPeople';

function getRandomDistinctPeople(
	people: readonly LoginCardPerson[],
	count: number,
) {
	return [...people].sort(() => Math.random() - 0.5).slice(0, count);
}

const initialCardPeople: readonly LoginCardPerson[] = loginCardPeople.slice(
	0,
	3,
);

let clientCardPeople: readonly LoginCardPerson[] | null = null;
function subscribe() {
	return () => {};
}
function getClientSnapshot(): readonly LoginCardPerson[] {
	clientCardPeople ??= getRandomDistinctPeople(loginCardPeople, 3);
	return clientCardPeople;
}
function getServerSnapshot(): readonly LoginCardPerson[] {
	return initialCardPeople;
}

const cardTransforms = [
	{ rotation: -5, scale: 0.7, translateX: 190, translateY: 0, zIndex: 2 },
	{ rotation: 0, scale: 1, translateX: 0, translateY: -15, zIndex: 3 },
	{ rotation: 4, scale: 0.7, translateX: -190, translateY: 0, zIndex: 2 },
] as const;

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
		letterSpacing: '-0.03em',
		width: '80%',
		lineHeight: '64.8px',
		color: colors.textPrimary,
		textAlign: 'center',
	},
	imagesContainer: {
		display: 'flex',
		gap: '12px',
		marginTop: '64px',
	},
});

export default function LeftSection() {
	const images = useSyncExternalStore(
		subscribe,
		getClientSnapshot,
		getServerSnapshot,
	);

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

			<div {...stylex.props(styles.imagesContainer)}>
				{images.map((image, index) => (
					<ImageCard key={image.src} image={image} {...cardTransforms[index]} />
				))}
			</div>
		</div>
	);
}

interface ImageCardProps {
	image: LoginCardPerson;
	rotation: number;
	scale: number;
	translateX: number;
	translateY: number;
	zIndex: number;
}

const imageCardStyles = stylex.create({
	imageCard: {
		borderRadius: radius.xxl,
		overflow: 'hidden',
	},
	imagePlayBarContainer: {
		position: 'absolute',
		top: '24px',
		width: '80%',
		left: '50%',
		transform: 'translateX(-50%)',
		height: '4px',
		backgroundColor: 'rgb(255, 255, 255, 0.3)',
		borderRadius: radius.full,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	highlightedPart: {
		width: '60%',
		height: '100%',
		backgroundColor: 'rgb(255, 255, 255)',
	},
	dimmedPart: {
		width: '40%',
		height: '100%',
		backgroundColor: 'rgb(255, 255, 255, 0.3)',
	},
	reactionBoxContainer: {
		position: 'absolute',
		bottom: '14px',
		padding: '0 18px',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '18px',
	},
	commentBorder: {
		width: '100%',
		height: '32px',
		borderWidth: '3px',
		borderStyle: 'solid',
		borderColor: '#ffffff',
		borderRadius: radius.full,
	},
});

function ImageCard({
	image,
	rotation,
	scale,
	translateX,
	translateY,
	zIndex,
}: ImageCardProps) {
	return (
		<div
			{...stylex.props(imageCardStyles.imageCard)}
			style={{
				transform: `rotate(${rotation}deg) scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`,
				zIndex,
			}}>
			<div {...stylex.props(imageCardStyles.imagePlayBarContainer)}>
				<div {...stylex.props(imageCardStyles.highlightedPart)}></div>
				<div {...stylex.props(imageCardStyles.dimmedPart)}></div>
			</div>
			<div {...stylex.props(imageCardStyles.reactionBoxContainer)}>
				<div {...stylex.props(imageCardStyles.commentBorder)}></div>
				<HeartIcon size={48} />
			</div>
			<Image
				src={`/loginPageCardsPeople/${image.src}`}
				alt={image.alt}
				width={260}
				height={460}
			/>
		</div>
	);
}
