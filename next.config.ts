import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['dc1.dallari.biz', 'localhost:3000'],
    },
  },
};

export default nextConfig;
