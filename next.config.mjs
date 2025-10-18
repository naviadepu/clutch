/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root detection issue
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
