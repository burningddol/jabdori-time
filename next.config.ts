import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  reactCompiler: true,
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
