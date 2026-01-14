/**
 * MDX 특수 노드(mdxJsxTextElement)를 일반 element로 변환하는 rehype 플러그인
 * 이 플러그인은 밑줄과 같은 서식이 MDX 특수 노드로 처리되어 제거되는 문제를 해결합니다.
 */
import { visit } from 'unist-util-visit';
import type { Element } from 'hast';

export default function rehypeMdxToElement() {
  return (tree: any) => {
    visit(tree, 'mdxJsxTextElement', (node: any, index: number | undefined, parent: any) => {
      if (!parent || index === undefined) return;

      // <u> 태그인 경우
      if (node.name === 'u') {
        const uElement: Element = {
          type: 'element',
          tagName: 'u',
          properties: {},
          children: node.children || [],
        };
        parent.children[index] = uElement;
      }
      // <del> 또는 <s> 태그인 경우
      else if (node.name === 'del' || node.name === 's') {
        const delElement: Element = {
          type: 'element',
          tagName: 'del',
          properties: {},
          children: node.children || [],
        };
        parent.children[index] = delElement;
      }
    });
  };
}
