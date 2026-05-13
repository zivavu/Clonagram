import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         { hostname: 'picsum.photos' },
         { hostname: 'pggvzapkivjgsybyzjok.supabase.co' },
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
            ],
         },
      ];
   },
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
