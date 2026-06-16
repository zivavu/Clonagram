import * as stylex from '@stylexjs/stylex';
import type { CallEvent } from '@/src/actions/dm/sendCallEvent';
import { styles } from './index.stylex';

interface CallEventMessageProps {
   event: CallEvent;
   senderUsername: string;
   isSelf: boolean;
}

function getCallEventText(event: CallEvent, senderUsername: string, isSelf: boolean) {
   switch (event) {
      case 'audio_started':
         return isSelf ? 'You started an audio call' : `${senderUsername} started an audio call`;
      case 'audio_ended':
         return 'Audio call ended';
      case 'video_started':
         return isSelf ? 'You started a video chat' : `${senderUsername} started a video chat`;
      case 'video_ended':
         return 'Video chat ended';
   }
}

export default function CallEventMessage({ event, senderUsername, isSelf }: CallEventMessageProps) {
   return (
      <div {...stylex.props(styles.row)}>
         <span {...stylex.props(styles.text)}>
            {getCallEventText(event, senderUsername, isSelf)}
         </span>
      </div>
   );
}
