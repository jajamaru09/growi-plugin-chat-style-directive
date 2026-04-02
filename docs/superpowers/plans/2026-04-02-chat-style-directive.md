# Chat Style Directive Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GROWIのMarkdownで `::::chat-style` ディレクティブを使ってSNS風チャットUIを表示するプラグインを構築する。

**Architecture:** remarkプラグインで `containerDirective` ノードを走査し、チャット用HTMLノードに変換する。アイコン画像は固定パス `/chat-style-icons` のGROWIページからAPI取得し、セッション中キャッシュする。CSSはプラグイン固有クラス（`.chat-style-*`）で定義し、`<style>` タグとして注入する。

**Tech Stack:** TypeScript, Vite, unist-util-visit, GROWI Plugin API (GrowiFacade), GROWI REST API v3

**Spec:** `docs/superpowers/specs/2026-04-02-chat-style-directive-design.md`

---

### Task 1: プロジェクトスキャフォルディング

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `.gitignore`
- Create: `client-entry.tsx`
- Create: `src/activate.ts`

- [ ] **Step 1: package.json を作成**

```json
{
  "name": "growi-plugin-chat-style-directive",
  "version": "0.1.0",
  "description": "GROWI plugin for SNS-style chat UI using ::::chat-style directive",
  "type": "module",
  "keywords": ["growi", "growi-plugin"],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "unist-util-visit": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  },
  "growiPlugin": {
    "schemaVersion": "4",
    "types": ["script"]
  }
}
```

- [ ] **Step 2: tsconfig.json を作成**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src", "client-entry.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: tsconfig.node.json を作成**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: vite.config.ts を作成**

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: ['client-entry.tsx'],
    },
  },
});
```

- [ ] **Step 5: .gitignore を作成**

```
node_modules
```

`dist/` は含めない（GROWIがビルド済みアセットを直接読み込むため）。

- [ ] **Step 6: client-entry.tsx を作成（スケルトン）**

```typescript
import { activate, deactivate } from './src/activate';

const PLUGIN_NAME = 'growi-plugin-chat-style-directive';

if ((window as any).pluginActivators == null) {
  (window as any).pluginActivators = {};
}

(window as any).pluginActivators[PLUGIN_NAME] = { activate, deactivate };
```

- [ ] **Step 7: src/activate.ts を作成（スケルトン）**

```typescript
export const activate = (): void => {
  console.log('[chat-style-directive] activated');
};

export const deactivate = (): void => {
  console.log('[chat-style-directive] deactivated');
};
```

- [ ] **Step 8: npm install を実行**

Run: `npm install`
Expected: `node_modules/` が生成され、`unist-util-visit` がインストールされる。

- [ ] **Step 9: ビルド確認**

Run: `npm run build`
Expected: `dist/.vite/manifest.json` と `dist/assets/client-entry-*.js` が生成される。

- [ ] **Step 10: コミット**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.node.json vite.config.ts .gitignore client-entry.tsx src/activate.ts dist/
git commit -m "feat: scaffold growi-plugin-chat-style-directive project"
```

---

### Task 2: アイコンフェッチャー（icon-fetcher.ts）

**Files:**
- Create: `src/icon-fetcher.ts`

- [ ] **Step 1: src/icon-fetcher.ts を作成**

`/chat-style-icons` ページのMarkdownを取得し、人物・感情・画像URLのマッピングを構築する。セッション中キャッシュする。

```typescript
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
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功。

- [ ] **Step 3: コミット**

```bash
git add src/icon-fetcher.ts dist/
git commit -m "feat: add icon-fetcher for chat-style-icons page"
```

---

### Task 3: ディレクティブ名パーサー（remark-chat-style.ts の前半）

**Files:**
- Create: `src/parse-directive-name.ts`

- [ ] **Step 1: src/parse-directive-name.ts を作成**

ディレクティブ名（例: `PersonA-smile-left`）を name / emotion / position に分解する。

```typescript
export interface ChatDirectiveInfo {
  name: string;
  emotion: string;
  position: 'left' | 'right';
}

export function parseDirectiveName(
  rawName: string,
  knownEmotions: Set<string>,
): ChatDirectiveInfo | null {
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
      return { name: nameCandidate, emotion: emotionCandidate, position };
    }
  }

  // 感情が見つからない or ハイフンなし → default にフォールバック
  return { name: rest, emotion: 'default', position };
}
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功。

- [ ] **Step 3: コミット**

```bash
git add src/parse-directive-name.ts dist/
git commit -m "feat: add directive name parser (name/emotion/position)"
```

---

### Task 4: remarkプラグイン（remark-chat-style.ts）

**Files:**
- Create: `src/remark-chat-style.ts`

- [ ] **Step 1: src/remark-chat-style.ts を作成**

`containerDirective` ノードの `chat-style` を検出し、内部の子ディレクティブをチャットHTMLノードに変換する。

```typescript
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
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功。

- [ ] **Step 3: コミット**

```bash
git add src/remark-chat-style.ts dist/
git commit -m "feat: add remark-chat-style plugin for directive transformation"
```

---

### Task 5: CSSスタイル定義・注入（styles.ts）

**Files:**
- Create: `src/styles.ts`

- [ ] **Step 1: src/styles.ts を作成**

```typescript
const STYLE_ID = 'chat-style-directive-css';

const CSS = `
.chat-style-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.chat-style-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 85%;
}

.chat-style-message-left {
  flex-direction: row;
  margin-right: auto;
}

.chat-style-message-right {
  flex-direction: row-reverse;
  margin-left: auto;
}

.chat-style-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
}

.chat-style-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-style-body {
  min-width: 0;
}

.chat-style-message-right .chat-style-body {
  text-align: right;
}

.chat-style-name {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 4px;
}

.chat-style-bubble {
  padding: 10px 16px;
  line-height: 1.5;
  word-break: break-word;
}

.chat-style-bubble > *:first-child {
  margin-top: 0;
}

.chat-style-bubble > *:last-child {
  margin-bottom: 0;
}

.chat-style-bubble-left {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0 12px 12px 12px;
  color: #212529;
}

.chat-style-bubble-right {
  background: #6f5de0;
  border-radius: 12px 0 12px 12px;
  color: #ffffff;
}

.chat-style-bubble-right a {
  color: #c4b5fd;
}
`;

export function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}
```

- [ ] **Step 2: ビルド確認**

Run: `npm run build`
Expected: ビルド成功。

- [ ] **Step 3: コミット**

```bash
git add src/styles.ts dist/
git commit -m "feat: add chat-style CSS injection with default theme"
```

---

### Task 6: activate.ts の完成（全モジュール統合）

**Files:**
- Modify: `src/activate.ts`

- [ ] **Step 1: src/activate.ts を書き換え**

GrowiFacadeをフックし、アイコン取得→remarkプラグイン追加→CSS注入を行う。

```typescript
import { fetchIconMap, getCachedIconMap } from './icon-fetcher';
import { remarkChatStyle } from './remark-chat-style';
import { injectStyles } from './styles';

declare const growiFacade: {
  markdownRenderer?: {
    optionsGenerators: {
      customGenerateViewOptions: (...args: any[]) => any;
      generateViewOptions: (...args: any[]) => any;
      customGeneratePreviewOptions: (...args: any[]) => any;
      generatePreviewOptions: (...args: any[]) => any;
    };
  };
};

export const activate = (): void => {
  if (typeof growiFacade === 'undefined' || growiFacade.markdownRenderer == null) {
    console.warn('[chat-style-directive] growiFacade not available');
    return;
  }

  // アイコンマップの先行取得を開始（結果はキャッシュされる）
  fetchIconMap();

  const { optionsGenerators } = growiFacade.markdownRenderer;

  // 閲覧モード
  const origView = optionsGenerators.generateViewOptions;
  optionsGenerators.customGenerateViewOptions = (...args: any[]) => {
    const options = origView(...args);
    injectStyles();
    const iconMap = getCachedIconMap() ?? new Map();
    options.remarkPlugins.push(remarkChatStyle(iconMap));
    return options;
  };

  // エディタプレビュー
  const origPreview = optionsGenerators.generatePreviewOptions;
  optionsGenerators.customGeneratePreviewOptions = (...args: any[]) => {
    const options = origPreview(...args);
    injectStyles();
    const iconMap = getCachedIconMap() ?? new Map();
    options.remarkPlugins.push(remarkChatStyle(iconMap));
    return options;
  };
};

export const deactivate = (): void => {};
```

- [ ] **Step 3: ビルド確認**

Run: `npm run build`
Expected: ビルド成功。`dist/` にバンドルされたファイルが出力される。

- [ ] **Step 4: コミット**

```bash
git add src/activate.ts dist/
git commit -m "feat: integrate all modules in activate.ts with GrowiFacade hooks"
```

---

### Task 7: ビルド最終確認と dist コミット

**Files:**
- Verify: `dist/.vite/manifest.json`
- Verify: `dist/assets/client-entry-*.js`

- [ ] **Step 1: クリーンビルド**

Run: `rm -rf dist && npm run build`
Expected: `dist/.vite/manifest.json` と `dist/assets/client-entry-*.js` が生成される。

- [ ] **Step 2: manifest.json の内容確認**

Run: `cat dist/.vite/manifest.json`
Expected: `client-entry.tsx` がエントリポイントとして含まれ、`file` フィールドにビルド済みJSへのパスがある。

- [ ] **Step 3: 最終コミット**

```bash
git add dist/
git commit -m "build: add dist for GROWI plugin installation"
```
