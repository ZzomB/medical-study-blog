import PostListSuspense from '@/components/features/blog/PostListSuspense';
import ProfileSection from '@/app/_components/ProfileSection';
import ContactSection from '@/app/_components/ContactSection';
import { getTagList } from '@/lib/notion';
import HeaderSection from '@/app/_components/HeaderSection';
import { Suspense } from 'react';
import TagSectionClient from '@/app/_components/TagSection.client';
import PostListSkeleton from '@/components/features/blog/PostListSkeleton';
import TagSectionSkeleton from '@/app/_components/TagSectionSkeleton';
import { getPublishedPosts } from '@/lib/notion';

interface HomeProps {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag, sort } = await searchParams;
  const selectedTag = tag || '전체';
  const selectedSort = sort || 'latest';

  // 서버사이드에서 필터링된 포스트 가져오기
  const tags = getTagList();
  const postsPromise = getPublishedPosts({ tag: selectedTag, sort: selectedSort });

  return (
    // min-h-screen으로 전체 높이 보장, grid로 3개 영역 분할
    <div className="container py-8">
      <div className="grid grid-cols-[200px_1fr_220px] gap-6">
        {/* 좌측사이드바 */}
        <aside>
          <Suspense fallback={<TagSectionSkeleton />}>
            <TagSectionClient tags={tags} selectedTag={selectedTag} />
          </Suspense>
        </aside>
        <div className="space-y-8">
          {/* 섹션 제목 */}
          <HeaderSection selectedTag={selectedTag} />
          {/* 블로그 카드 그리드 */}
          <Suspense fallback={<PostListSkeleton />}>
            <PostListSuspense postsPromise={postsPromise} />
          </Suspense>
        </div>
        {/* 우측 사이드바 */}
        <aside className="flex flex-col gap-6">
          <ProfileSection />
          <ContactSection />
        </aside>
      </div>
    </div>
  );
}
