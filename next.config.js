/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Is se deployment ke waqt TypeScript ke errors ignore ho jayenge
    ignoreBuildErrors: true,
  },
  eslint: {
    // Is se ESLint ki warnings ignore ho jayengi
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;