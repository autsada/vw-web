/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "storage.googleapis.com",
      "customer-ndc778ybs24fn8ir.cloudflarestream.com",
    ],
  },
}

module.exports = nextConfig
