const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const hljs = require("highlight.js");

const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

md.use(require("markdown-it-anchor"), { permalink: false });

const CONTENT_DIR = path.join(__dirname, "content", "posts");
const TEMPLATE_DIR = path.join(__dirname, "templates");
const STATIC_DIR = path.join(__dirname, "static");
const OUTPUT_DIR = path.join(__dirname, "public");

function clean() {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, "posts"), { recursive: true });
}

function loadTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATE_DIR, `${name}.html`), "utf-8");
}

function render(template, vars) {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

function formatDate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getGitLastModified(filePath) {
  try {
    const { execSync } = require("child_process");
    const result = execSync(
      `git log -1 --format="%aI" -- "${filePath}"`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    ).trim();
    if (result) return new Date(result);
  } catch {}
  return new Date(fs.statSync(filePath).mtime);
}

function collectPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = [];

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(raw);

    const slug = file.replace(/\.md$/, "");
    const title = frontmatter.title || slug;
    const date = frontmatter.date
      ? new Date(frontmatter.date)
      : getGitLastModified(filePath);
    const tags = frontmatter.tags || [];
    const draft = frontmatter.draft === true;

    if (draft) continue;

    const html = md.render(content);

    posts.push({ slug, title, date, tags, html, filePath });
  }

  posts.sort((a, b) => b.date - a.date);
  return posts;
}

function build() {
  console.log("Building...");
  clean();

  // Copy static files
  if (fs.existsSync(STATIC_DIR)) {
    for (const file of fs.readdirSync(STATIC_DIR)) {
      fs.copyFileSync(
        path.join(STATIC_DIR, file),
        path.join(OUTPUT_DIR, file)
      );
    }
  }

  const posts = collectPosts();
  const baseTemplate = loadTemplate("base");
  const postTemplate = loadTemplate("post");
  const indexTemplate = loadTemplate("index");

  // Build each post
  for (const post of posts) {
    const postHtml = render(postTemplate, {
      title: post.title,
      date: formatDate(post.date),
      tags: post.tags.map((t) => `<span class="tag">${t}</span>`).join(" "),
      content: post.html,
    });

    const page = render(baseTemplate, {
      title: `${post.title} | Blog`,
      body: postHtml,
    });

    fs.writeFileSync(path.join(OUTPUT_DIR, "posts", `${post.slug}.html`), page);
  }

  // Build index
  const postListHtml = posts
    .map(
      (p) =>
        `<li class="post-item">
          <time datetime="${formatDate(p.date)}">${formatDate(p.date)}</time>
          <a href="posts/${p.slug}.html">${p.title}</a>
        </li>`
    )
    .join("\n");

  const indexHtml = render(indexTemplate, { posts: postListHtml });
  const indexPage = render(baseTemplate, {
    title: "Blog",
    body: indexHtml,
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), indexPage);

  console.log(`Built ${posts.length} post(s) -> public/`);
}

// Watch mode
if (process.argv.includes("--watch")) {
  build();
  console.log("Watching for changes...");
  const dirs = [CONTENT_DIR, TEMPLATE_DIR, STATIC_DIR].filter(fs.existsSync);
  for (const dir of dirs) {
    fs.watch(dir, { recursive: true }, () => {
      try { build(); } catch (e) { console.error(e.message); }
    });
  }
} else {
  build();
}
