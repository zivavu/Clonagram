'use client';

export default function MainLayoutError({ error, reset }: { error: Error; reset: () => void }) {
   return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', gap: 16, padding: 24 }}>
         <h1 style={{ fontSize: 24, fontWeight: 600 }}>Something went wrong</h1>
         <p style={{ color: 'rgb(115, 115, 115)', textAlign: 'center' }}>
            {error.message || 'An unexpected error occurred.'}
         </p>
         <button
            onClick={reset}
            style={{
               background: 'rgb(0, 100, 224)',
               color: 'white',
               border: 'none',
               borderRadius: 8,
               padding: '10px 24px',
               fontWeight: 600,
               cursor: 'pointer',
            }}
         >
            Try again
         </button>
      </div>
   );
}
