/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "vidyaai-backend.ultimeet.io",
    ],
  },
  env: {
    NEXT_PUBLIC_AWS_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  },
};

export default nextConfig;
