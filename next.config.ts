import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [{ hostname: 'picsum.photos' }],
   },
   reactCompiler: true,
   reactStrictMode: false,
};

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig);
