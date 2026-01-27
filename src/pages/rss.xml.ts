import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getSortedPosts } from "../utils/getSortedPosts";

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();

  return rss({
    title: "Blog",
    description: "技術ブログ",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      pubDate: post.resolvedDate,
      link: `/blog/${post.id}/`,
    })),
  });
}
