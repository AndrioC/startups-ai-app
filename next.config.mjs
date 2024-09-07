/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "organizations-imgs.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
