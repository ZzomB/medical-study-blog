import type { NextConfig } from 'next';

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
  // 노션 마크다운은 next-mdx-remote-client로 처리하므로
  // @next/mdx 설정 제거 (직렬화 문제 해결)
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
