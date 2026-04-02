# growi-plugin-chat-style-directive 設計仕様

## 概要

GROWIのMarkdownに `::::chat-style` ディレクティブを追加し、SNS風（LINE/Slack風）のチャットUIを表示するプラグイン。

- **プラグインカテゴリ**: A（プレビュー/閲覧側プラグイン — remarkプラグイン）+ API連携
- **schemaVersion**: 4
- **types**: `["script"]`

## ディレクティブ記法

```markdown
::::chat-style

:::PersonA-smile-left
こんにちは！今日の打ち合わせの件ですが…
:::

:::PersonB-smile-right
了解です！資料を準備しておきますね 👍
:::

:::PersonA-left
感情省略時はdefaultにフォールバック
:::

::::
```

### パース規則

ディレクティブ名（例: `PersonA-smile-left`）を末尾から順に分解する:

1. 末尾の `-left` / `-right` を切り出し → **position**
2. 残りの末尾 `-xxx` を感情候補として切り出し → **emotion**（`chat-style-icons` に登録されている感情と照合。一致しなければ `default` にフォールバックし、切り出した部分は人物名に戻す）
3. 残り全体 → **name**（ハイフンを含んでもよい）
4. emotion が省略された場合（例: `PersonA-left`）は `default` にフォールバック

**例:**

| ディレクティブ | name | emotion | position |
|---|---|---|---|
| `PersonA-smile-left` | PersonA | smile | left |
| `Person-A-sad-right` | Person-A | sad | right |
| `PersonA-left` | PersonA | default | left |
| `My-Friend-happy-right` | My-Friend | happy | right |

## chat-style-icons ページ

### パス

固定パス: `/chat-style-icons`

### フォーマット（見出し＋画像リスト形式）

```markdown
## PersonA
- smile: [PersonA-smile](/attachment/xxxx)
- sad: [PersonA-sad](/attachment/yyyy)
- default: [PersonA-default](/attachment/zzzz)

## PersonB
- smile: [PersonB-smile](/attachment/aaaa)
- default: [PersonB-default](/attachment/bbbb)
```

- `##` 見出し → 人物名
- リストアイテム → `emotion: [alttext](imageUrl)` の形式
- 画像URLはGROWIの添付ファイルリンク

### API取得

- エンドポイント: `GET /_api/v3/page?path=/chat-style-icons`
- レスポンスからMarkdown本文を取得し、パースしてアイコンマッピングを構築
- **キャッシュ**: セッション中キャッシュ（初回API取得後、ブラウザリロードまで保持）

### パースロジック

Markdownテキストを行単位で解析:

1. `## ` で始まる行 → 人物名のキー開始
2. `- emotion: [alttext](url)` 形式の行 → emotion と画像URLを抽出
3. 結果を `Map<name, Map<emotion, imageUrl>>` として保持

## 表示スタイル

### レイアウト

- **left**: アイコン（左）→ 名前 → 吹き出し（左寄せ）
- **right**: 吹き出し（右寄せ）→ 名前 → アイコン（右）、flex-direction: row-reverse

### CSSクラス設計

Bootstrap非依存。プラグイン固有の `.chat-style-*` プレフィックスを使用。GROWIのカスタムCSSで全て上書き可能。

```
.chat-style-container       — ::::chat-style 全体のラッパー
.chat-style-message         — 各メッセージ行（:::person-emotion-position）
.chat-style-message-left    — 左寄せメッセージ
.chat-style-message-right   — 右寄せメッセージ
.chat-style-avatar          — アイコン画像のラッパー
.chat-style-avatar img      — アイコン画像
.chat-style-name            — 人物名表示
.chat-style-bubble          — 吹き出し本体
.chat-style-bubble-left     — 左側吹き出し（白背景系）
.chat-style-bubble-right    — 右側吹き出し（色付き背景）
```

### デフォルト配色

- 左吹き出し: 白背景、グレーボーダー、角丸（左上のみ直角）
- 右吹き出し: 薄紫系背景、白文字、角丸（右上のみ直角）
- アイコン: 48px丸、object-fit: cover
- 名前: 小さめフォント、グレー

## 技術アーキテクチャ

### ファイル構成

```
growi-plugin-chat-style-directive/
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── client-entry.tsx
├── src/
│   ├── activate.ts              # activate/deactivate、GrowiFacade連携
│   ├── remark-chat-style.ts     # remarkプラグイン（ディレクティブ→HAST変換）
│   ├── icon-fetcher.ts          # chat-style-iconsページの取得・パース・キャッシュ
│   └── styles.ts                # CSSスタイル文字列定義・注入
└── dist/                        # ビルド出力（Gitに含める）
```

### 処理フロー

1. **activate()** が呼ばれる
2. `customGenerateViewOptions` / `customGeneratePreviewOptions` をフックし、remarkプラグインを追加
3. remarkプラグインが `::::chat-style` ディレクティブを検出
4. 内部の `:::person-emotion-position` ディレクティブをパース
5. アイコンフェッチャーが `/chat-style-icons` からマッピングを取得（キャッシュ済みなら即座に返す）
6. 各メッセージを適切なHTMLノード（div + クラス + img）に変換
7. CSSスタイルがまだ注入されていなければ `<style>` タグとしてdocument.headに追加

### 依存パッケージ

- `unist-util-visit` — ASTノードの走査

**注意**: `remark-directive` は追加不要。GROWIは既にディレクティブ記法をサポートしており、`::::` / `:::` はremark処理パイプラインで `containerDirective` ノードとしてASTに存在する。プラグインはこのノードを `visit()` で走査・変換するだけでよい。

### remarkプラグインでのAPI呼び出しに関する注意

remarkプラグインはAST変換を行う同期的な処理だが、アイコンURLの解決にはAPI呼び出し（非同期）が必要。対処法:

- **方式**: activate時にアイコンマッピングを先行取得し、クロージャでremarkプラグインに渡す。remarkプラグインファクトリはアイコンマップを引数に取る: `remarkChatStyle(iconMap)`
- アイコンマッピングの取得完了前にレンダリングが走った場合は、画像なしで表示（graceful degradation）
- activate()は1回しか呼ばれないため、customGenerateViewOptionsフック内でアイコン取得を行い、取得後にremarkプラグインを追加する流れとする
