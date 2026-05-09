import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   grid: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      paddingTop: '8px',
      paddingBottom: '16px',
   },
   thumbButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '33.33%',
      padding: '16px 0 0',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
   },
   imageWrap: {
      position: 'relative',
      width: '88px',
      height: '88px',
      marginRight: '8px',
      marginBottom: '8px',
      marginLeft: '8px',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'rgba(0, 0, 0, 0)',
      borderRadius: '8px',
      overflow: 'hidden',
   },
   imageWrapActive: {
      borderColor: 'rgb(0, 149, 246)',
      borderRadius: '2px',
   },
   placeholder: {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgb(38, 38, 38)',
   },
   name: {
      fontSize: '12px',
      lineHeight: '16px',
      color: 'rgb(168, 168, 168)',
   },
   nameActive: {
      color: 'rgb(0, 149, 246)',
   },
});
