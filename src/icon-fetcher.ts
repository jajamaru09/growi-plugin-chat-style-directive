export type IconMap = Map<string, Map<string, string>>;

let cachedIconMap: IconMap | null = null;

export function getCachedIconMap(): IconMap | null {
  return cachedIconMap;
}

export async function fetchIconMap(): Promise<IconMap> {
  if (cachedIconMap) return cachedIconMap;

  const iconMap: IconMap = new Map();

  try {
    const res = await fetch('/_api/v3/page?path=/chat-style-icons', {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      console.warn('[chat-style-directive] Failed to fetch /chat-style-icons:', res.status);
      return iconMap;
    }

    const data = await res.json();
    const markdown: string = data.page?.revision?.body ?? '';
    parseIconMarkdown(markdown, iconMap);
  }
  catch (e) {
    console.warn('[chat-style-directive] Error fetching icon map:', e);
  }

  cachedIconMap = iconMap;
  return iconMap;
}

export function parseIconMarkdown(markdown: string, iconMap: IconMap): void {
  const lines = markdown.split('\n');
  let currentName: string | null = null;

  const headingRe = /^##\s+(.+)$/;
  const itemRe = /^-\s+(\S+?):\s*\[.*?\]\((.+?)\)\s*$/;

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
