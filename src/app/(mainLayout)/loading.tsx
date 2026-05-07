export default function MainLayoutLoading() {
   return (
      <div
         style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100dvh',
            gap: 16,
         }}
      >
         <div
            style={{
               width: 32,
               height: 32,
               border: '3px solid rgb(219, 219, 219)',
               borderTopColor: 'rgb(74, 93, 249)',
               borderRadius: '50%',
               animation: 'spin 0.8s linear infinite',
            }}
         />
         <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
   );
}
