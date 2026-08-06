 import type { NextConfig } from "next";

  const nextConfig: NextConfig = {
    images: {
      formats: ["image/webp", "image/avif"],
      deviceSizes: [375, 640, 768, 1024, 1280, 1536],imageSizes: [16, 32, 64, 128, 256],remotePatterns: [
        {
          protocol: "https",
          hostname: "img.youtube.com",
          pathname: "/vi/**",
        },
      ],
    },
    // Server Actions are enabled by default in Next.js 14
  };

  export default nextConfig;
