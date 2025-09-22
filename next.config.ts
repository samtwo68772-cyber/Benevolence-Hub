
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['github.dev', 'app.github.dev', 'localhost:9002', 'didactic-space-giggle-wrjx77x64xvrhggp6-9002.app.github.dev'],
      bodySizeLimit: '4mb'
    }
  },
  // Optimize development and production
  webpack: (config, { dev }) => {
    // Development-specific optimizations
    if (dev) {
      config.watchOptions = {
        // Reduce file system watching overhead
        ignored: ['**/node_modules', '**/.next'],
        aggregateTimeout: 1000,
        poll: false
      };
    }
    return config;
  },
  // Reduce unnecessary recompilation
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
