---
title: "ブログを作った"
description: "Astro v5でMarkdownベースの技術ブログを構築した話"
date: 2026-01-27
tags: ["astro", "blog"]
---

Markdownで記事を書いて、GitHubにpushするだけで公開される技術ブログを作った。

## 技術スタック

必要最低限の構成にした。

- **SSG**: Astro v5（ゼロJS出力、Content Collections）
- **ホスティング**: Cloudflare Pages（プレビューデプロイ付き）
- **構文ハイライト**: Shiki（ビルド時にHTML生成、クライアントJS不要）

## 記事の書き方

`src/content/blog/` にMarkdownファイルを置く。frontmatterで `date` を指定すれば公開日になる。省略するとgitの最終変更日時が使われる。

```yaml
---
title: "記事タイトル"
date: 2026-01-27
tags: ["astro", "typescript"]
---
```

## コードのハイライト

Shikiによるビルド時ハイライト。クライアントにJavaScriptを送らない。

```typescript
const greeting = (name: string): void => {
  console.log(`Hello, ${name}!`);
};

greeting("World");
```

```python
def fibonacci(n: int) -> list[int]:
    """Generate Fibonacci sequence."""
    fib = [0, 1]
    for _ in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib[:n]

print(fibonacci(10))
```

## なぜAstroか

- **ゼロJS**: 静的ブログにクライアントJSは不要。Astroはデフォルトで0KBのJSを出力する
- **Content Collections**: Zodスキーマでfrontmatterを型安全に検証できる
- **Shiki内蔵**: highlight.jsのような追加パッケージが不要

> フレームワークは変わっても、Markdownの記事はそのまま使える。それが大事。
