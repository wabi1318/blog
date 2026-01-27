---
title: "ブログを作った"
date: 2026-01-27
tags: [blog, markdown]
---

Markdownで記事を書いて、GitHubにpushするだけで公開されるブログを作った。

## 技術スタック

必要最低限の構成にした。

- **ビルド**: Node.js のカスタムスクリプト（`markdown-it` + `gray-matter`）
- **ホスティング**: GitHub Pages
- **CI/CD**: GitHub Actions（push時に自動ビルド&デプロイ）

## 記事の書き方

`content/posts/` にMarkdownファイルを置く。frontmatterで `date` を指定すれば公開日になる。省略するとgitの最終変更日時が使われる。

```yaml
---
title: "記事タイトル"
date: 2026-01-27
tags: [tag1, tag2]
---
```

## コードのハイライト

シンタックスハイライトも動く。

```javascript
const greeting = (name) => {
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

## なぜ自作したか

既存のSSG（Hugo, Astroなど）でも良かったが、依存を最小限にしたかった。ビルドスクリプトは100行程度で、何が起きているか全部把握できる。
