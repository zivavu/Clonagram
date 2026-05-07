import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { MdPlayArrow } from 'react-icons/md';
import { styles } from './index.stylex';

interface ExploreItem {
   id: string;
   image: string;
   isVideo: boolean;
   isTall: boolean;
}

function generateItems(count: number, variant: string): ExploreItem[] {
   const items: ExploreItem[] = [];
   let isTallOnRight = true;

   for (let i = 0; i < count; i++) {
      const positionInGroup = i % 5;
      const isTall = isTallOnRight ? positionInGroup === 2 : positionInGroup === 0;

      const seed = `explore-${variant}-${i}`;
      const width = 400;
      const height = isTall ? 800 : 400;

      // Deterministic "random" for video flag
      const isVideo = (i * 7 + 3) % 10 > 6;

      items.push({
         id: seed,
         image: `https://picsum.photos/seed/${seed}/${width}/${height}`,
         isVideo,
         isTall,
      });

      if (positionInGroup === 4) {
         isTallOnRight = !isTallOnRight;
      }
   }

   return items;
}

export default function ExplorePage({ variant }: { variant: string | null }) {
   const activeVariant = variant ?? 'for_you';
   const isForYou = activeVariant === 'for_you';

   const items = generateItems(45, activeVariant);

   return (
      <div {...stylex.props(styles.page)}>
         <div {...stylex.props(styles.content)}>
            <div {...stylex.props(styles.header)}>
               <Link href="/explore?variant=for_you" {...stylex.props(styles.headerLink)}>
                  <span {...stylex.props(isForYou ? styles.headerActive : styles.headerInactive)}>For you</span>
               </Link>
               <Link href="/explore?variant=nonpersonalized" {...stylex.props(styles.headerLink)}>
                  <span {...stylex.props(!isForYou ? styles.headerActive : styles.headerInactive)}>
                     Not personalized
                  </span>
               </Link>
            </div>
            <div {...stylex.props(styles.grid)}>
               {items.map(item => (
                  <div key={item.id} {...stylex.props(styles.item, item.isTall && styles.itemTall)}>
                     <Image
                        src={item.image}
                        alt="Explore post"
                        fill
                        sizes="(max-width: 960px) 33vw, 317px"
                        style={{ objectFit: 'cover' }}
                     />
                     {item.isVideo && (
                        <div {...stylex.props(styles.videoBadge)}>
                           <MdPlayArrow {...stylex.props(styles.videoIcon)} />
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
