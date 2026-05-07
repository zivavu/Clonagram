import MuxUploader from '@mux/mux-uploader-react';
import * as stylex from '@stylexjs/stylex';
import { MdAddBox } from 'react-icons/md';
import { muxClient } from '@/src/lib/mux';
import { styles } from './page.stylex';

export default async function CreatePage() {
   const directUpload = await muxClient.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      new_asset_settings: {
         playback_policy: ['public'],
      },
   });

   return (
      <div {...stylex.props(styles.container)}>
         <MdAddBox style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Create</h1>
         <MuxUploader endpoint={directUpload.url} />
      </div>
   );
}
