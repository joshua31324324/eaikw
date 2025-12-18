# Eleventy Config Analysis

## Overview

This configuration sets up Eleventy (`.eleventy.js`) with:

- Passthrough copies for static assets.
- Plugins for base URL handling and RSS feeds.
- Custom collections for blog posts and projects.
- Filters for date formatting, excerpts, navigation, and utility functions.
- An async shortcode for responsive images using `@11ty/eleventy-img`.
- Markdown configuration with anchors via `markdown-it` and `markdown-it-anchor`.
- Explicit directory and template engine settings.

---

## Passthrough Copy

### What It Does

```js
// copies non-processed files into _site/
eleventyConfig.addPassthroughCopy({ "src/images": "images" });
eleventyConfig.addPassthroughCopy("src/assets");
eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
eleventyConfig.addPassthroughCopy({ "src/css/print.css": "css/print.css" });
eleventyConfig.addPassthroughCopy("CNAME");

// plugins
//// adds base tag support for relative urls
eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
//// generates rss feeds from collections
eleventyConfig.addPlugin(pluginRss);

// Eleventy does not skip files ignored by Git
eleventyConfig.setUseGitIgnore(false);

// collections
eleventyConfig.addCollection("blog", api => api.getFilteredByGlob("src/blog/*.md").reverse());
eleventyConfig.addCollection("projects", api => api.getFilteredByGlob("src/projects/*.md").reverse());

// responsive image shortcode
eleventyConfig.addAsyncShortcode("image", async (src, alt, sizes = "100vw") => { ... });

// enables html in markdown
const md = markdownIt({ html: true, breaks: true, linkify: true });
md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink(),
    slugify: ...
});
eleventyConfig.setLibrary("md", md);

//directs eleventy
return {
  dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
  templateFormats: ["md", "njk", "html"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dataTemplateEngine: "njk",
  serverOptions: { port: 8080, host: "0.0.0.0" },
};
```

## Strengths

- Robust error handling in filters (date fallbacks, invalid input handling).
- Responsive image pipeline with lazy loading and multiple formats (WebP + JPEG).
- Clear collections for blog posts and projects with newest-first ordering.
- Plugins cover essential needs: base URL handling and RSS feed generation.
- Markdown anchors improve navigation and deep linking for long-form content.

## Areas to Improve

- Add AVIF image format for cutting-edge performance and modern browser support.
- Introduce environment-specific configs (development vs. production builds).
- Expand collections with tags/categories for better content organization.
- Automate sitemap generation and schema markup for stronger SEO.
- Integrate PurgeCSS or Tailwind JIT to remove unused CSS and improve performance.
