import { execSync } from "child_process";

/**
 * Resolve the display date for a post.
 * Priority: frontmatter date > git last commit date > current date.
 */
export function getPostDate(
  frontmatterDate: Date | undefined,
  filePath: string,
): Date {
  if (frontmatterDate) return frontmatterDate;

  try {
    const result = execSync(
      `git log -1 --format="%aI" -- "${filePath}"`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
    if (result) return new Date(result);
  } catch {
    // git not available or file not tracked
  }

  return new Date();
}
