# Farm2Ayur

A Vite-powered vanilla JavaScript site, organized so it can be migrated to React later without changing the project tooling.

## Run locally

```bash
npm install
npm run dev
```

## Structure

- `index.html` contains semantic page markup only.
- `assets/css/style.css` is the base design system and page styling.
- `assets/css/overrides.css` contains focused visual and accessibility refinements.
- `assets/js/app.js` contains the application behaviour.
- `assets/js/animations.js` contains optional progressive-enhancement animations.
- `assets/images/` contains local image assets.

When you are ready to use React, add React and ReactDOM, then move page sections into components under `src/`. Vite will remain the build and development tool.
