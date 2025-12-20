/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  images: {
    domains: ['images.unsplash.com'],
    // Security: restrict image formats
    formats: ['image/webp', 'image/avif'],
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig