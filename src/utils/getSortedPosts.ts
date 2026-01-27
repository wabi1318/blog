import { getCollection, type CollectionEntry } from "astro:content";
import { getPostDate } from "./getPostDate";

export type BlogPost = CollectionEntry<"blog"> & {
  resolvedDate: Date;
};

/**
 * Get all non-draft blog posts, sorted by date (newest first).
 */
export async function getSortedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection("blog", ({ data }) => data.draft !== true);

  const resolved: BlogPost[] = posts.map((post) => ({
    ...post,
    resolvedDate: getPostDate(
      post.data.date,
      `src/content/blog/${post.id}.md`,
    ),
  }));

  resolved.sort((a, b) => b.resolvedDate.getTime() - a.resolvedDate.getTime());
  return resolved;
}
