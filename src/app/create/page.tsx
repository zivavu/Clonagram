import MuxUploader from '@mux/mux-uploader-react';
import * as stylex from '@stylexjs/stylex';
import { MdAddBox } from 'react-icons/md';
import { muxClient } from '@/src/lib/mux';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '16px',
      color: colors.textSecondary,
   },
   title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   subtitle: {
      fontSize: '0.95rem',
      color: colors.textSecondary,
   },
});

export default async function CreatePage() {
   const directUpload = await muxClient.video.uploads.create({
      cors_origin: '*',
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
