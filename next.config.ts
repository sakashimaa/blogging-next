import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // @ts-expect-error: legacy option
    nodeMiddleware: true,
  },
}

export default nextConfig
