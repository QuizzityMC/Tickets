/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
}

module.exports = {
  ...nextConfig,
  server: {
    port: 9028,
  },
}

