import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old Q3 URL still works for anyone who bookmarked it
      { source: "/q3-problem-statements", destination: "/q4-problem-statements", permanent: true },
    ];
  },
};

export default nextConfig;
