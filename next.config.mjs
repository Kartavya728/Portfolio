/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Next 14's built-in lint step doesn't support ESLint v9's flat config
    // API. `npm run lint` still runs the real eslint.config.js directly.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
