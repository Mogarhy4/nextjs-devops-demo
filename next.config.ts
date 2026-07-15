import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // <--- This is the magic line for Docker optimization!
};

export default nextConfig;