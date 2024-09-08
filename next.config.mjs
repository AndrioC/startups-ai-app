/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "organizations-imgs.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "user-sgl-imgs.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "startups-logo-imgs.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
