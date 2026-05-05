import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '350px',
      marginLeft: '32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingLeft: '48px',
   },
   profileCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
   },
   profileInfo: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
   },
   profileUsername: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   profileName: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   switchLink: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.accent,
      textDecoration: 'none',
      flexShrink: 0,
      ':hover': {
         color: colors.accentHover,
      },
   },
   suggestionsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '4px',
   },
   suggestionsLabel: {
      fontSize: '0.875rem',
      fontWeight: 600,
   },
   seeAllLink: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.textPrimary,
      textDecoration: 'none',
      ':hover': {
         color: colors.textSecondary,
      },
   },
   suggestionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
   },
   suggestionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '4px 0',
   },
   suggestionInfo: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minWidth: 0,
   },
   suggestionUsername: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   suggestionSubtext: {
      fontSize: '0.8rem',
      color: colors.textSecondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   followButton: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.accent,
      ':hover': {
         color: colors.accentHover,
      },
   },
   footerLinksContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0 6px',
      marginTop: '18px',
   },
   footerLink: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
      textDecoration: 'none',
      ':hover': {
         textDecoration: 'underline',
      },
   },
   copyright: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
      marginTop: '6px',
      textTransform: 'uppercase',
   },
});
