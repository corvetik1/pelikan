import type { NextConfig } from "next";

const hostList = (process.env.NEXT_IMAGE_ALLOWED_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter((h) => h.length > 0);

const patterns = hostList.length > 0
  ? hostList.flatMap((hostname) => [
      { protocol: "https" as const, hostname },
      { protocol: "http" as const, hostname },
    ])
  : [
      { protocol: "http" as const, hostname: "localhost" },
      { protocol: "http" as const, hostname: "127.0.0.1" },
    ];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: patterns,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
