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
    console.debug('[chat-style] remark plugin running, knownEmotions:', [...knownEmotions]);
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'chat-style') return;

      console.debug('[chat-style] found ::::chat-style node, children:', node.children?.length, 'types:', node.children?.map((c: any) => `${c.type}:${c.name}`));

      // ::::chat-style → div.chat-style-container に変換
      node.data = {
        hName: 'div',
        hProperties: { className: ['chat-style-container'] },
      };

      // 子ノードの :::person-emotion-position を変換
      for (const child of (node.children ?? [])) {
        if (child.type !== 'containerDirective') continue;

        const info = parseDirectiveName(child.name, knownEmotions);
        console.debug('[chat-style] child directive:', child.name, '→ parsed:', info);
        if (!info) continue;

        const iconUrl = getIconUrl(iconMap, info.name, info.emotion);
        console.debug('[chat-style] iconUrl for', info.name, info.emotion, ':', iconUrl);

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
