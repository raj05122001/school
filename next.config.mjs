/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vidyaai-backend.ultimeet.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'dev-vidyaai.ultimeet.io',
        pathname: '**',
      },
      
    ],
  },
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
};

export default nextConfig;
