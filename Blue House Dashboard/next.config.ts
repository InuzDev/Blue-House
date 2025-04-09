/** @type {import('next').NextConfig} */
const nextConfig = {
  // If your Nest.js API is on a different domain, you'll need CORS or a proxy
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/:path*', // Proxy to your Nest.js API
      },
    ];
  },
}

module.exports = nextConfig;