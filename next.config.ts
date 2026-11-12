import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: let a phone on the same Wi-Fi load the dev scripts (live site unaffected).
  allowedDevOrigins: ["192.168.0.179"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
