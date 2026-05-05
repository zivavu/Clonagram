import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useSyncExternalStore } from 'react';
import { MdFavorite } from 'react-icons/md';
import loginCardPeople, { type LoginCardPerson } from '../loginCardPeople';
import { imageCardStyles, styles } from './LeftSection.stylex';

function getRandomDistinctPeople(people: readonly LoginCardPerson[], count: number) {
   return [...people].sort(() => Math.random() - 0.5).slice(0, count);
}

const initialCardPeople: readonly LoginCardPerson[] = loginCardPeople.slice(0, 3);

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

export default function LeftSection() {
   const images = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

   return (
      <div {...stylex.props(styles.root)}>
         <Image src="/clonagram.png" alt="Clonagram" {...stylex.props(styles.clonagramLogo)} width={78} height={78} />
         <span {...stylex.props(styles.description)}>See everyday moments from your close friends.</span>

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

function ImageCard({ image, rotation, scale, translateX, translateY, zIndex }: ImageCardProps) {
   return (
      <div
         {...stylex.props(imageCardStyles.imageCard)}
         style={{
            transform: `rotate(${rotation}deg) scale(${scale}) translateX(${translateX}px) translateY(${translateY}px)`,
            zIndex,
         }}
      >
         <div {...stylex.props(imageCardStyles.imagePlayBarContainer)}>
            <div {...stylex.props(imageCardStyles.highlightedPart)}></div>
            <div {...stylex.props(imageCardStyles.dimmedPart)}></div>
         </div>
         <div {...stylex.props(imageCardStyles.reactionBoxContainer)}>
            <div {...stylex.props(imageCardStyles.commentBorder)}></div>
            <MdFavorite style={{ fontSize: 38 }} />
         </div>
         <Image src={`/loginPageCardsPeople/${image.src}`} alt={image.alt} width={260} height={460} />
      </div>
   );
}
