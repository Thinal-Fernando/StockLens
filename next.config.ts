import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder. There is a stray package-lock.json in
  // the parent directory, and without this Turbopack sometimes picks that as the
  // root, which breaks its persistent cache.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
