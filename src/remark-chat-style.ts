import { visit } from 'unist-util-visit';
import type { IconMap } from './icon-fetcher';
import { getIconUrl } from './icon-fetcher';
import { parseDirectiveName } from './parse-directive-name';

export function remarkChatStyle(iconMap: IconMap) {
  // iconMapからknownEmotionsを構築
  const knownEmotions = new Set<string>();
  for (const emotionMap of iconMap.values()) {
    for (const emotion of emotionMap.keys()) {
      knownEmotions.add(emotion);
    }
  }

  return () => (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'chat-style') return;

      // ::::chat-style → div.chat-style-container に変換
      node.data = {
        hName: 'div',
        hProperties: { className: ['chat-style-container'] },
      };

      // 子ノードの :::person-emotion-position を変換
      for (const child of (node.children ?? [])) {
        if (child.type !== 'containerDirective') continue;

        const info = parseDirectiveName(child.name, knownEmotions);
        if (!info) continue;

        const iconUrl = getIconUrl(iconMap, info.name, info.emotion);

        // メッセージラッパー div に変換
        child.data = {
          hName: 'div',
          hProperties: {
            className: [
              'chat-style-message',
              `chat-style-message-${info.position}`,
            ],
          },
        };

        // 既存のchildren（テキスト内容）を吹き出しdivにラップ
        const bubbleChildren = child.children ?? [];

        child.children = [
          // アバター
          {
            type: 'containerDirective',
            data: {
              hName: 'div',
              hProperties: { className: ['chat-style-avatar'] },
            },
            children: iconUrl
              ? [{
                  type: 'image',
                  url: iconUrl,
                  alt: `${info.name} ${info.emotion}`,
                }]
              : [{
                  type: 'text',
                  value: info.name.charAt(0),
                }],
          },
          // 名前 + 吹き出しラッパー
          {
            type: 'containerDirective',
            data: {
              hName: 'div',
              hProperties: { className: ['chat-style-body'] },
            },
            children: [
              // 名前
              {
                type: 'paragraph',
                data: {
                  hName: 'div',
                  hProperties: { className: ['chat-style-name'] },
                },
                children: [{ type: 'text', value: info.name }],
              },
              // 吹き出し
              {
                type: 'containerDirective',
                data: {
                  hName: 'div',
                  hProperties: {
                    className: [
                      'chat-style-bubble',
                      `chat-style-bubble-${info.position}`,
                    ],
                  },
                },
                children: bubbleChildren,
              },
            ],
          },
        ];
      }
    });
  };
}
