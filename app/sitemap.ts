import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 기본 URL - 환경 변수가 없으면 에러 발생
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    console.error('NEXT_PUBLIC_SITE_URL 환경 변수가 설정되지 않았습니다.');
    return [];
  }

  // URL 형식 검증 (http:// 또는 https://로 시작해야 함)
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    console.error('NEXT_PUBLIC_SITE_URL은 http:// 또는 https://로 시작해야 합니다.');
    return [];
  }

  // 마지막 슬래시 제거
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  // 정적 페이지 목록
  const staticPages = [
    {
      url: cleanBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${cleanBaseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${cleanBaseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  // 블로그 게시물 가져오기
  const { posts } = await getPublishedPosts({ pageSize: 100 });

  // 블로그 게시물 URL 생성
  const blogPosts = posts.map((post) => ({
    url: `${cleanBaseUrl}/blog/${post.slug}`,
    lastModified: post.modifiedDate ? new Date(post.modifiedDate) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 정적 페이지와 블로그 게시물 결합
  return [...staticPages, ...blogPosts];
}
