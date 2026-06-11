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
            ],
         },
      ];
   },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
