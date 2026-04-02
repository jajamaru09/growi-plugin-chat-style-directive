export interface ChatDirectiveInfo {
  name: string;
  emotion: string;
  position: 'left' | 'right';
  showName: boolean;
}

export function parseDirectiveName(
  rawName: string,
  knownEmotions: Set<string>,
  attributes?: Record<string, any>,
): ChatDirectiveInfo | null {
  // showName: attributes に noname があれば非表示
  const showName = !(attributes && ('noname' in attributes));

  // Step 1: 末尾の -left / -right を切り出し
  let position: 'left' | 'right';
  let rest: string;

  if (rawName.endsWith('-left')) {
    position = 'left';
    rest = rawName.slice(0, -5); // remove '-left'
  }
  else if (rawName.endsWith('-right')) {
    position = 'right';
    rest = rawName.slice(0, -6); // remove '-right'
  }
  else {
    return null; // position必須
  }

  if (rest.length === 0) return null;

  // Step 2: 末尾の -xxx を感情候補として試す
  const lastHyphen = rest.lastIndexOf('-');
  if (lastHyphen > 0) {
    const emotionCandidate = rest.slice(lastHyphen + 1);
    const nameCandidate = rest.slice(0, lastHyphen);

    if (knownEmotions.has(emotionCandidate)) {
      return { name: nameCandidate, emotion: emotionCandidate, position, showName };
    }
  }

  // 感情が見つからない or ハイフンなし → default にフォールバック
  return { name: rest, emotion: 'default', position, showName };
}
