export interface ChatDirectiveInfo {
  name: string;
  emotion: string;
  position: 'left' | 'right';
  showName: boolean;
}

export function parseDirectiveName(
  rawName: string,
  knownEmotions: Set<string>,
): ChatDirectiveInfo | null {
  // Step 0: 末尾の :noname フラグを切り出し
  let input = rawName;
  let showName = true;
  if (input.endsWith(':noname')) {
    showName = false;
    input = input.slice(0, -7); // remove ':noname'
  }

  // Step 1: 末尾の -left / -right を切り出し
  let position: 'left' | 'right';
  let rest: string;

  if (input.endsWith('-left')) {
    position = 'left';
    rest = input.slice(0, -5); // remove '-left'
  }
  else if (input.endsWith('-right')) {
    position = 'right';
    rest = input.slice(0, -6); // remove '-right'
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
