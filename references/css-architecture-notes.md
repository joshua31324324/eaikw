# CSS Architecture System (Tailwind + Swiss Design)

## 1. Core Inputs

- **Entry file:** `src/css/tailwind.css`  
  Contains Tailwind directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

## Custom Layers for Swiss Design System

- `@layer base`
- `@layer components`
- `@layer utilities`

---

## Config File: `tailwind.config.js`

Defines purge paths (`content`) for:

- `.html`
- `.njk`
- `.md`
- `.js`

Extends theme with:

- **Swiss color palette**
- **Fluid typography scale**
- **Spacing system**

Includes plugins:

- `@tailwindcss/typography`
- `@headlessui/tailwindcss`
- `@tailwindcss/container-queries`

## 2. Build Output

- **Compiled file:** `dist/output.css`

### Contents

- Includes Tailwind’s generated utilities  
- Merges Swiss custom components (`.btn-swiss`, `.swiss-grid`, `.prose-swiss`)  
- Normalizes browser quirks via Tailwind’s base reset  

### Advanced Features

- Fluid typography (`clamp()`)  
- Glassmorphism effects  
- Scroll-driven animations  
- HDR / P3 color support  

## 3. Layering Strategy

### Base Layer

- Global resets (`scroll-behavior`, `hyphens`, `overflow-wrap`)  
- CSS custom properties (`--swiss-grid-columns`, `--fluid-h1`, `--swiss-red`)  
- Accessibility preferences (`prefers-reduced-motion`, `prefers-reduced-transparency`)  

### Components Layer

- Reusable UI patterns (`.btn-swiss`, `.swiss-container`, `.swiss-divider`)  
- Grid utilities (`.swiss-grid`, `.swiss-col-*`, `.swiss-asymmetric-*`)  
- Typography blocks (`.prose-swiss`, `.ai-voice`)  
- Glassmorphism and hover effects  

### Utilities Layer

- Shadow utilities (`.shadow-swiss-*`)  
- Performance utilities (`content-visibility`)  
- Animation utilities (`.scroll-fade-in`, `.scroll-slide-left`)  

## 4. Progressive Enhancement

### Modern CSS Features

- `text-wrap: balance;` → fallback with `overflow-wrap: break-word`  
- `hyphens: auto;` → vendor prefixes for Safari/IE  
- `@supports` blocks for `backdrop-filter`, `animation-timeline`, `view-transition-name`  
- `@media (color-gamut: p3)` and `(dynamic-range: high)` for wide‑gamut/HDR displays  

### Fallbacks

- Legacy properties (`word-wrap`, `-webkit-hyphens`)  
- Graceful degradation for unsupported features  

## 5. Workflow Notes

### Development

- Edit `src/css/tailwind.css` → Tailwind rebuilds into `dist/output.css`  
- Use `--watch` for live updates  

### Linting

- Disable VS Code's `css.validate` or configure Stylelint to ignore Tailwind at‑rules (`tailwind`, `apply`, `layer`)  
- Add `stylelint-tailwindcss` plugin for proper recognition  

## 6. Architecture Principles

- **Utility‑first:** Tailwind handles atomic classes  
- **Swiss design system:** Custom layers enforce grid, typography, and minimal geometric components  
- **Progressive enhancement:** Modern CSS features with fallbacks  
- **Maintainability:** Clear separation of base, components, and utilities  
- **Accessibility:** Motion preferences, touch targets, WCAG‑compliant buttons  
