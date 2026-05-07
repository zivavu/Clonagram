import Link from 'next/link';

export default function NotFound() {
   return (
      <div
         style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100dvh',
            gap: 16,
            padding: 24,
         }}
      >
         <h1 style={{ fontSize: 24, fontWeight: 600 }}>Sorry, this page isn&apos;t available.</h1>
         <p style={{ color: 'rgb(115, 115, 115)', textAlign: 'center' }}>
            The link you followed may be broken, or the page may have been removed.
         </p>
         <Link href="/" style={{ color: 'rgb(0, 100, 224)', fontWeight: 600 }}>
            Go back to Clonagram
         </Link>
      </div>
   );
}
