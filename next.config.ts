import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'picsum.photos',
      },
      {
        hostname: 'images.unsplash.com',
      },
      {
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx', 'md'],
};

// 노션 마크다운은 next-mdx-remote-client로 처리하므로
// @next/mdx 옵션은 최소화 (옵션 없이 사용 시 직렬화 문제 해결)
const withMDX = createMDX();

export default withMDX(nextConfig);
