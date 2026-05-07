import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '100%',
      maxWidth: '650px',
      margin: '0 auto',
      padding: '32px 28px',
      display: 'flex',
      flexDirection: 'column',
   },
   backButton: {
      borderRadius: radius.full,
      padding: '8px',
      display: 'flex',
      width: 'fit-content',
      color: colors.textSecondary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   contentContainer: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px',
   },
   title: {
      fontSize: '1.5rem',
      fontWeight: '450',
      color: colors.textPrimary,
      marginTop: '16px',
   },
   description: {
      fontSize: '0.9375rem',
      fontWeight: '400',
      marginTop: '4px',
   },
   learnMoreLinkContainer: {
      fontSize: '0.9375rem',
      fontWeight: '400',
      marginTop: '12px',
   },
   policyText: {
      fontSize: '0.9375rem',
      fontWeight: '300',
      lineHeight: '1.2667',
      marginTop: '16px',
      marginBottom: '24px',
   },
   policyParagraph: {
      display: 'block',
      marginTop: '8px',
   },
   accentLink: {
      color: colors.accentText,
      ':hover': {
         color: colors.accentTextHover,
         textDecoration: 'underline',
      },
   },
   topLabel: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: colors.textPrimary,
   },
   errorAlert: {
      color: 'rgb(237, 73, 86)',
      fontSize: 13,
      textAlign: 'center',
   },
   accountButton: {
      marginTop: '16px',
      marginBottom: '16px',
   },
});
