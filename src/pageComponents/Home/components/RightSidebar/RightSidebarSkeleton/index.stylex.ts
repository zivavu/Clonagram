import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
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
      gap: '6px',
      flex: 1,
   },
   suggestionsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '4px',
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
      gap: '6px',
      flex: 1,
   },
});
