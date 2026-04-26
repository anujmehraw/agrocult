import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.1.7",
    "http://192.168.1.7:3000",
    "http://192.168.1.7:3001",
  ],
};

export default nextConfig;
