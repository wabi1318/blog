import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap()],
  // Astro 7 defaults to JSX whitespace trimming. Keep the HTML-aware
  // compression this site was built with so inline spacing stays the same.
  compressHTML: true,
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
    },
  },
});
