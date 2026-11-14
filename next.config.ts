import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/gatherings",
        destination: "/off-the-clock",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
