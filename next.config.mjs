import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

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
      {
        protocol: 'https',
        hostname: 'vidyaai-poc-backend.ultimeet.io',
        pathname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
};

export default withNextIntl(nextConfig);