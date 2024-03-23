/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "cdn.triumphify.com",
      },
    ],
  },
  env: {
    ENDPOINT: process.env.ENDPOINT,
    APP_WEBSITE: process.env.APP_WEBSITE,
  },
};

export default nextConfig;
