import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { useSyncExternalStore } from 'react';
import { MdFavorite } from 'react-icons/md';
import loginCardPeople, { type LoginCardPerson } from '../../loginCardPeople';
import { imageCardStyles, styles } from './index.stylex';

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
   { rotation: -5, scale: 0.7, translateX: '13.15vw', translateY: '0px', zIndex: 2 },
   { rotation: 0, scale: 1, translateX: '0px', translateY: '-1.04vw', zIndex: 3 },
   { rotation: 4, scale: 0.7, translateX: '-13.15vw', translateY: '0px', zIndex: 2 },
] as const;

export default function LeftSection() {
   const images = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.topSection)}>
            <Image
               src="/clonagram.png"
               alt="Clonagram"
               {...stylex.props(styles.clonagramLogo)}
               width={76}
               height={76}
            />
            <span {...stylex.props(styles.description)}>
               See everyday moments from your close friends.
            </span>
         </div>

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
   translateX: string;
   translateY: string;
   zIndex: number;
}

function ImageCard({ image, rotation, scale, translateX, translateY, zIndex }: ImageCardProps) {
   return (
      <div
         {...stylex.props(imageCardStyles.imageCard)}
         style={{
            transform: `rotate(${rotation}deg) scale(${scale}) translateX(${translateX}) translateY(${translateY})`,
            zIndex,
         }}
      >
         <div {...stylex.props(imageCardStyles.imagePlayBarContainer)}>
            <div {...stylex.props(imageCardStyles.highlightedPart)}></div>
            <div {...stylex.props(imageCardStyles.dimmedPart)}></div>
         </div>
         <div {...stylex.props(imageCardStyles.reactionBoxContainer)}>
            <div {...stylex.props(imageCardStyles.commentBorder)}></div>
            <MdFavorite size={38} />
         </div>
         <Image
            src={`/loginPageCardsPeople/${image.src}`}
            alt={image.alt}
            fill
            sizes="18vw"
            style={{ objectFit: 'cover' }}
            preload
         />
      </div>
   );
}
