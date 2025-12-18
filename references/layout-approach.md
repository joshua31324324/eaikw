# Layout Approach Reference

This layout strategy is based on the **`base.njk`** file from the referenced repository:  
[eaikw/src/_layouts/base.njk](https://github.com/joshua31324324/eaikw/blob/main/src/_layouts/base.njk)

---

## 1. Template Structure

- **Base Layout (`base.njk`)**
  - Acts as the root template for all pages.
  - Defines global HTML structure (`<html>`, `<head>`, `<body>`).
  - Provides consistent header, footer, and metadata across the site.

---

## 2. Head Section

- **Meta Tags**
  - Charset, viewport, and SEO-friendly metadata.
  - Dynamic title and description injected via template variables.
- **Stylesheets**
  - Tailwind CSS included for utility-first styling.
  - Custom CSS layers (Swiss design system) applied globally.
- **Scripts**
  - Global JavaScript references.
  - Optional analytics or tracking scripts.

---

## 3. Body Section

- **Header**
  - Site-wide navigation bar.
  - Logo and primary links.
- **Main Content**
  - `{% block content %}` placeholder for page-specific content.
  - Ensures modularity: each page injects its own content into the base layout.
- **Footer**
  - Consistent footer with links, copyright, and accessibility notes.

---

## 4. Layout Principles

- **Separation of Concerns**
  - Base layout handles global structure.
  - Individual templates extend `base.njk` and provide page-specific content.
- **Reusability**
  - Shared components (header, footer, navigation) defined once.
  - Avoids duplication across pages.
- **Maintainability**
  - Centralized updates: changes to `base.njk` propagate site-wide.
- **Accessibility**
  - Semantic HTML structure.
  - WCAG-compliant navigation and landmarks.

---

## 5. Integration with Tailwind + Swiss Design

- **Utility-first styling** from Tailwind ensures rapid prototyping.
- **Swiss design system overrides** applied via custom layers:
  - Grid system (`.swiss-grid`, `.swiss-col-*`).
  - Typography (`.prose-swiss`).
  - Components (`.btn-swiss`, `.swiss-container`).
- **Progressive enhancement**:
  - Modern CSS features (`text-wrap`, `hyphens`, `clamp()`).
  - Fallbacks for older browsers.

---

## 6. Summary

The `base.njk` layout provides:

- A **consistent site-wide structure**.
- **Reusable components** for navigation and footer.
- A **modular content injection system** via `{% block content %}`.
- Integration with **Tailwind utilities** and **Swiss design custom layers**.
- Alignment with **SEO best practices** and **accessibility standards**.
