import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoChevronForward, IoEyeOffOutline } from 'react-icons/io5';
import { getRequestThreads } from '../messagesData';
import { styles } from './styles';
import { ThreadItem } from './ThreadItem';

export function RequestsContent() {
   const requestThreads = getRequestThreads();

   return (
      <>
         <div {...stylex.props(styles.requestsHeader)}>
            <Link href="/direct" {...stylex.props(styles.backButton)} aria-label="Back to messages" role="button">
               <FaArrowLeft size={24} />
            </Link>
            <span {...stylex.props(styles.headerTitle)}>Message requests</span>
         </div>

         <div {...stylex.props(styles.infoBanner)}>
            <p {...stylex.props(styles.infoText)}>
               Open a chat to get more info about who&apos;s messaging you. They won&apos;t know you&apos;ve seen it
               until you accept.
            </p>
            <a {...stylex.props(styles.infoLink)} href="/accounts/privacy_and_security/">
               Decide who can message you
            </a>
         </div>

         <div {...stylex.props(styles.requestsBody)}>
            <button {...stylex.props(styles.hiddenRequestsRow)} aria-label="Hidden Requests">
               <div {...stylex.props(styles.hiddenRequestsAvatar)}>
                  <IoEyeOffOutline size={22} />
               </div>
               <span {...stylex.props(styles.hiddenRequestsLabel)}>Hidden Requests</span>
               <IoChevronForward size={16} />
            </button>

            {requestThreads.map(thread => (
               <ThreadItem key={thread.id} thread={thread} href={`/direct/requests/${thread.id}`} />
            ))}
         </div>

         <div {...stylex.props(styles.bottomSection)}>
            <button {...stylex.props(styles.deleteAllButton)}>Delete all {requestThreads.length}</button>
         </div>
      </>
   );
}
