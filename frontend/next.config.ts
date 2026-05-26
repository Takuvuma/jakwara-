import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "s1.ticketmaster.com" },
      { hostname: "media.seatgeek.com" },
      { hostname: "img.evbuc.com" },
      { hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
