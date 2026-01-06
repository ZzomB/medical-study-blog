'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

interface TableOfContentsProps {
  toc: TocEntry[];
}

function TableOfContentsLink({
  item,
  activeId,
}: {
  item: TocEntry;
  activeId: string | null;
}) {
  const isActive = activeId === item.id;

  return (
    <div className="space-y-2">
      <Link
        key={item.id}
        href={`#${item.id}`}
        className={`block font-medium transition-colors ${
          isActive
            ? 'text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {item.value}
      </Link>
      {item.children && item.children.length > 0 && (
        <div className="space-y-2 pl-4">
          {item.children.map((subItem) => (
            <TableOfContentsLink
              key={subItem.id}
              item={subItem}
              activeId={activeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // 모든 헤딩 요소의 ID 수집 (재귀적으로)
    const collectIds = (items: TocEntry[]): string[] => {
      const ids: string[] = [];
      items.forEach((item) => {
        if (item.id) {
          ids.push(item.id);
        }
        if (item.children) {
          ids.push(...collectIds(item.children));
        }
      });
      return ids;
    };

    const headings = collectIds(toc).filter(Boolean);

    if (headings.length === 0) return;

    // 헤딩 요소들을 관찰하기 위한 옵션
    // rootMargin을 사용하여 뷰포트 상단에서 약간 아래 지점을 기준으로 함
    const observerOptions = {
      rootMargin: '-100px 0px -60% 0px', // 뷰포트 상단에서 100px 아래 지점 기준
      threshold: [0, 0.1, 0.5, 1],
    };

    const observer = new IntersectionObserver((entries) => {
      // 현재 뷰포트에 보이는 헤딩들을 찾음
      const visibleHeadings = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => {
          // 화면 상단에 가까운 순서로 정렬
          const rectA = a.boundingClientRect;
          const rectB = b.boundingClientRect;
          return rectA.top - rectB.top;
        });

      if (visibleHeadings.length > 0) {
        // 가장 위에 있는 헤딩을 활성화
        setActiveId(visibleHeadings[0].target.id);
      } else {
        // 뷰포트에 보이는 헤딩이 없으면, 스크롤 위치를 기준으로 가장 가까운 헤딩을 찾음
        interface ClosestHeading {
          id: string;
          distance: number;
        }
        let closestHeading: ClosestHeading | null = null;

        for (const entry of entries) {
          const rect = entry.boundingClientRect;
          const targetId = entry.target.id;
          // 뷰포트 상단보다 위에 있는 요소 중 가장 가까운 것
          if (rect.top <= 150 && targetId) {
            const distance = Math.abs(rect.top - 100);
            if (!closestHeading || distance < closestHeading.distance) {
              closestHeading = { id: targetId, distance };
            }
          }
        }

        if (closestHeading) {
          setActiveId(closestHeading.id);
        }
      }
    }, observerOptions);

    // 모든 헤딩 요소 관찰 시작
    headings.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // 초기 활성화를 위해 첫 번째 헤딩 설정
    const firstHeading = headings[0];
    if (firstHeading && document.getElementById(firstHeading)) {
      const rect = document.getElementById(firstHeading)!.getBoundingClientRect();
      if (rect.top <= 150) {
        setActiveId(firstHeading);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [toc]);

  return (
    <nav className="space-y-3 text-base">
      {toc.map((item) => (
        <TableOfContentsLink key={item.id} item={item} activeId={activeId} />
      ))}
    </nav>
  );
}
