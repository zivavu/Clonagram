import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         { hostname: 'pggvzapkivjgsybyzjok.supabase.co' },
         { hostname: 'lh3.googleusercontent.com' },
         { hostname: 'image.mux.com' },
         { hostname: 'picsum.photos' },
      ],
   },
   reactCompiler: true,
   reactStrictMode: true,
   async headers() {
      return [
         {
            source: '/(.*)',
            headers: [
               { key: 'X-Frame-Options', value: 'DENY' },
               { key: 'X-Content-Type-Options', value: 'nosniff' },
               { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
               { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
               { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
               {
                  key: 'Content-Security-Policy',
                  value: [
                     "default-src 'self'",
                     "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
                     "style-src 'self' 'unsafe-inline'",
                     "img-src 'self' data: blob: https://pggvzapkivjgsybyzjok.supabase.co https://image.mux.com https://lh3.googleusercontent.com https://picsum.photos",
                     "media-src 'self' blob: https://stream.mux.com",
                     "connect-src 'self' https://pggvzapkivjgsybyzjok.supabase.co wss://pggvzapkivjgsybyzjok.supabase.co https://image.mux.com https://stream.mux.com https://api.mux.com https://graphql.lottiefiles.com https://openrouter.ai https://photon.komoot.io",
                     "font-src 'self'",
                     "frame-src 'none'",
                     "object-src 'none'",
                     "base-uri 'self'",
                     "form-action 'self'",
                  ].join('; '),
               },
            ],
         },
      ];
   },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
