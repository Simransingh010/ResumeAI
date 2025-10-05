import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Node-only PDF libraries are not bundled; load at runtime instead
  serverExternalPackages: ["pdfjs-dist", "canvas", "tesseract.js"],
  experimental: {
    // Force Node.js runtime for route handlers
    serverMinification: true,
  },
};

export default nextConfig;
