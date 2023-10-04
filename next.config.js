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
  webpack: (config, context) => {
    if (config.plugins) {
      config.plugins.push(
        new context.webpack.IgnorePlugin({
          resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
        })
      )
    }
    return config
  },
}

module.exports = nextConfig
