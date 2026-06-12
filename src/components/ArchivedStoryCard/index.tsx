import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { IoCheckmark } from 'react-icons/io5';
import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';
import DateBadge from '@/src/pageComponents/Archive/components/DateBadge';
import { getMuxThumbnailUrl } from '@/src/utils/mux';
import { styles } from './index.stylex';

export function getThumbnailUrl(story: ArchivedStory) {
   if (story.type === 'image') return story.url;
   return getMuxThumbnailUrl(story.url);
}

interface StoryCardProps {
   story: ArchivedStory;
   href?: string;
   selected?: boolean;
   onSelect?: () => void;
   showDate?: boolean;
}

export default function StoryCard({
   story,
   href,
   selected,
   onSelect,
   showDate = true,
}: StoryCardProps) {
   const thumbnailUrl = getThumbnailUrl(story);

   const imageEl = (
      <>
         {showDate && <DateBadge isoDate={story.createdAt} />}
         {story.type === 'image' && story.blurDataUrl ? (
            <Image
               src={thumbnailUrl}
               alt=""
               fill
               unoptimized
               placeholder="blur"
               blurDataURL={story.blurDataUrl}
               style={{ objectFit: 'cover' }}
            />
         ) : (
            <Image src={thumbnailUrl} alt="" fill unoptimized style={{ objectFit: 'cover' }} />
         )}
         {onSelect !== undefined && (
            <div
               {...stylex.props(styles.selectionCircle, selected && styles.selectionCircleSelected)}
            >
               {selected && <IoCheckmark size={14} color="white" />}
            </div>
         )}
      </>
   );

   if (href) {
      return (
         <Link href={href} {...stylex.props(styles.wrapper)}>
            {imageEl}
         </Link>
      );
   }

   if (onSelect) {
      return (
         <button
            type="button"
            onClick={onSelect}
            {...stylex.props(styles.wrapper, styles.buttonReset)}
         >
            {imageEl}
         </button>
      );
   }

   return <div {...stylex.props(styles.wrapper)}>{imageEl}</div>;
}
