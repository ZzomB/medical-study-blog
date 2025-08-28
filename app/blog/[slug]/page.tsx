import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '@/lib/notion';
import { formatDate } from '@/lib/date';
import { MDXRemote } from 'next-mdx-remote-client/rsc';
import rehypeSanitize from 'rehype-sanitize';
import rehypePrettycode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import { compile } from '@mdx-js/mdx';
import withSlugs from 'rehype-slug';
import withToc from '@stefanprobst/rehype-extract-toc';
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx';
import GiscusComments from '@/components/GiscusComments';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPostBySlug(slug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다.',
      description: '포스트를 찾을 수 없습니다.',
    };
  }

  return {
    title: post.title,
    description: post.description || `${post.title} - Joos Blog`,
    keywords: post.tags,
    authors: [{ name: post.author || 'Joo' }],
    publisher: 'Joo',
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: post.author || 'joo',
      tags: post.tags,
    },
  };
}

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

export const generateStaticParams = async () => {
  const { posts } = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
};

export const revalidate = 60; // 1분마다 캐시 재검증

function TableOfContentsLink({ item }: { item: TocEntry }) {
  return (
    <div className="space-y-2">
      <Link
        key={item.id}
        href={`#${item.id}`}
        className="hover:text-foreground text-muted-foreground block font-medium transition-colors"
      >
        {item.value}
      </Link>
      {item.children && item.children.length > 0 && (
        <div className="space-y-2 pl-4">
          {item.children.map((subItem) => (
            <TableOfContentsLink key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
}

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const { markdown, post } = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { data } = await compile(markdown, {
    rehypePlugins: [
      withSlugs,
      withToc,
      withTocExport,
      /** Optionally, provide a custom name for the export. */
      // [withTocExport, { name: 'toc' }],
    ],
  });

  return (
    <div className="container py-6 md:py-12 lg:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr_240px] md:gap-8">
        <aside className="hidden md:block">{/* 추후콘텐츠 추가 */}</aside>
        <section>
          {/* 블로그 헤더 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
            </div>

            {/* 메타 정보 */}
            <div className="text-muted-foreground flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{post.date ? formatDate(post.date) : ''}</span>
              </div>
            </div>
          </div>

          <Separator className="my-8" />
          {/* 모바일 전용 목차 */}
          <div className="sticky top-[var(--sticky-top)] mb-6 md:hidden">
            <details className="bg-muted/60 rounded-lg p-4 backdrop-blur-sm">
              <summary className="cursor-pointer text-lg font-semibold">목차</summary>
              <nav className="mt-3 space-y-3 text-sm">
                {data?.toc?.map((item: TocEntry) => (
                  <TableOfContentsLink key={item.id} item={item} />
                ))}
              </nav>
            </details>
          </div>

          {/* 블로그 본문 */}
          <div className="prose prose-slate dark:prose-invert prose-headings:scroll-mt-[var(--header-height)] max-w-none">
            <MDXRemote
              source={markdown}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeSanitize, rehypePrettycode, rehypeSlug],
                },
              }}
            />
          </div>

          <Separator className="my-16" />

          {/* 이전/다음 포스트 네비게이션 */}
          <GiscusComments />
        </section>
        <aside className="relative hidden md:block">
          <div className="sticky top-[var(--sticky-top)]">
            <div className="bg-muted/50 space-y-4 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold">목차</h3>
              <nav className="space-y-3 text-sm">
                {data?.toc?.map((item) => (
                  <TableOfContentsLink key={item.id} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
