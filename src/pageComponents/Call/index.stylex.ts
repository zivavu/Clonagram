import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100dvh',
      backgroundColor: '#0c1014',
      color: colors.white,
      overflow: 'hidden',
   },

   lobbyLayout: {
      display: 'flex',
      flex: 1,
      gap: 0,
      overflow: 'hidden',
   },

   lobbyPreview: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#111518',
      position: 'relative',
      overflow: 'hidden',
   },

   lobbyPreviewVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'scaleX(-1)',
   },

   cameraOffPlaceholder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      color: colors.textSecondary,
   },

   cameraOffIcon: {
      fontSize: 40,
      color: colors.textSecondary,
   },

   cameraOffText: {
      fontSize: '0.875rem',
      color: colors.accentText,
   },

   lobbyPanel: {
      width: 280,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      backgroundColor: '#1c2025',
      padding: '32px 24px',
   },

   lobbyPanelTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: colors.white,
   },

   lobbyPanelSubtitle: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
      marginTop: -8,
   },

   startButton: {
      backgroundColor: colors.accent,
      color: colors.white,
      border: 'none',
      borderRadius: radius.full,
      padding: '10px 28px',
      fontSize: '0.9rem',
      fontWeight: 600,
      marginTop: 8,
   },

   mediaError: {
      fontSize: '0.8rem',
      color: colors.danger,
      textAlign: 'center',
      maxWidth: 240,
   },

   controlBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: '16px 24px',
      backgroundColor: '#111518',
      flexShrink: 0,
   },

   controlBtn: {
      width: 48,
      height: 48,
      borderRadius: radius.full,
      border: 'none',
      backgroundColor: '#2a2e34',
      color: colors.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
   },

   controlBtnActive: {
      backgroundColor: '#3a3f47',
   },

   hangUpBtn: {
      backgroundColor: colors.danger,
   },

   inCallLayout: {
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
      overflow: 'hidden',
      position: 'relative',
   },

   remoteVideoSlot: {
      flex: '1 1 50%',
      minWidth: 240,
      backgroundColor: '#111518',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },

   remoteVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
   },

   remoteAudioOnly: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      color: colors.textSecondary,
   },

   localPip: {
      position: 'absolute',
      bottom: 80,
      right: 16,
      width: 120,
      height: 90,
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: '#1c2025',
      zIndex: 10,
   },

   localPipVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'scaleX(-1)',
   },

   waitingText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: colors.textSecondary,
      fontSize: '0.9rem',
   },
});
