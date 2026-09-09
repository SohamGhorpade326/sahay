/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/video-onboarding/:path*',
        destination: `${process.env.VIDEO_ONBOARDING_API_URL || 'http://localhost:8004'}/api/video-onboarding/:path*`,
      },
    ]
  },
}

export default nextConfig
