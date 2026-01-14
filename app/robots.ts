import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  // 기본 URL이 없으면 sitemap 없이 반환
  const sitemapUrl = baseUrl 
    ? `${baseUrl.replace(/\/$/, '')}/sitemap.xml`
    : undefined;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    ...(sitemapUrl && { sitemap: sitemapUrl }),
  };
}
