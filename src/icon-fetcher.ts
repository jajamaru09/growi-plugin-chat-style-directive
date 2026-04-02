export type IconMap = Map<string, Map<string, string>>;

let cachedIconMap: IconMap | null = null;

// 同期XHRを使用する理由:
// remarkプラグインは同期的なAST変換のため、非同期fetchだと最初のレンダリングに間に合わない。
// 初回のみ同期リクエストが走り、以降はキャッシュから即座に返す。
export function ensureIconMap(): IconMap {
  if (cachedIconMap) {
    return cachedIconMap;
  }

  const iconMap: IconMap = new Map();

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/_api/v3/page?path=/chat-style-icons', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();

    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      const markdown: string = data.page?.revision?.body ?? '';
      parseIconMarkdown(markdown, iconMap);
    }
    else {
      console.warn('[chat-style] ensureIconMap: HTTP error', xhr.status);
    }
  }
  catch (e) {
    console.warn('[chat-style] ensureIconMap: error:', e);
  }

  cachedIconMap = iconMap;
  return iconMap;
}

export function parseIconMarkdown(markdown: string, iconMap: IconMap): void {
  const lines = markdown.split('\n');
  let currentName: string | null = null;

  const headingRe = /^##\s+(.+)$/;
  const itemRe = /^-\s+(\S+?):\s*!?\[.*?\]\((.+?)\)\s*$/;

  for (const line of lines) {
    const headingMatch = line.match(headingRe);
    if (headingMatch) {
      currentName = headingMatch[1].trim();
      if (!iconMap.has(currentName)) {
        iconMap.set(currentName, new Map());
      }
      continue;
    }

    if (currentName == null) continue;

    const itemMatch = line.match(itemRe);
    if (itemMatch) {
      const emotion = itemMatch[1];
      const url = itemMatch[2];
      iconMap.get(currentName)!.set(emotion, url);
    }
  }
}

export function getIconUrl(iconMap: IconMap, name: string, emotion: string): string | null {
  const emotions = iconMap.get(name);
  if (!emotions) return null;
  return emotions.get(emotion) ?? emotions.get('default') ?? null;
}
