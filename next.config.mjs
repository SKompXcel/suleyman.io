import nextMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import rehypePrism from '@mapbox/rehype-prism';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'www.motortrend.com' },
      { protocol: 'https', hostname: 'hips.hearstapps.com' },
      { protocol: 'https', hostname: 'dealerinspire-image-library-prod.s3.us-east-1.amazonaws.com' },
      { protocol: 'https', hostname: 'scontent-yyz1-1.cdninstagram.com' },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|avi|mov)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'static/videos/',
          publicPath: '/_next/static/videos/',
        },
      },
    });

    config.resolve.alias.canvas = false;

    return config;
  },
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
});

export default withMDX(nextConfig);

