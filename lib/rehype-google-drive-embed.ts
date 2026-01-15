/**
 * Google Drive / YouTube embed 링크를 동영상으로 변환하는 rehype 플러그인
 */
import { visit } from 'unist-util-visit';

// Google Drive 파일 ID 추출
function extractGoogleDriveFileId(url: string): string | null {
  const patterns = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /id=([a-zA-Z0-9_-]+)/, /\/d\/([a-zA-Z0-9_-]+)/];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// YouTube 비디오 ID 추출
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function isGoogleDriveUrl(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function createIframeNode(src: string, className: string) {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: [className, 'my-4'],
    },
    children: [
      {
        type: 'element',
        tagName: 'iframe',
        properties: {
          src,
          width: '100%',
          height: '480',
          allow: 'autoplay; encrypted-media',
          allowFullScreen: true,
          frameBorder: '0',
          className: ['rounded-lg', 'w-full', 'aspect-video'],
          style: 'max-width: 100%;',
        },
        children: [],
      },
    ],
  };
}

function getEmbedNode(href: string): any | null {
  if (isGoogleDriveUrl(href)) {
    const fileId = extractGoogleDriveFileId(href);
    if (fileId) {
      return createIframeNode(
        `https://drive.google.com/file/d/${fileId}/preview`,
        'google-drive-embed'
      );
    }
  }

  if (isYouTubeUrl(href)) {
    const videoId = extractYouTubeVideoId(href);
    if (videoId) {
      return createIframeNode(`https://www.youtube.com/embed/${videoId}`, 'youtube-embed');
    }
  }

  return null;
}

export default function rehypeGoogleDriveEmbed() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (node.tagName === 'a' && node.properties?.href) {
        const embedNode = getEmbedNode(node.properties.href);
        if (embedNode && parent && typeof index === 'number') {
          parent.children[index] = embedNode;
        } else {
          // 일반 링크는 새 탭에서 열리도록 설정
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        }
      }

      // p 태그 안에 링크만 있는 경우
      if (node.tagName === 'p' && node.children?.length === 1) {
        const child = node.children[0];
        if (child.tagName === 'a' && child.properties?.href) {
          const embedNode = getEmbedNode(child.properties.href);
          if (embedNode && parent && typeof index === 'number') {
            parent.children[index] = embedNode;
          }
        }
      }
    });
  };
}
