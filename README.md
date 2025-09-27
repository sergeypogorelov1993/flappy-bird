# Flappy Bird — Primitive Edition

A TypeScript + Vite implementation of the classic Flappy Bird game using only primitive Canvas shapes for rendering. The rendering pipeline is structured to make it easy to swap in animated sprite sheets in the future.

## Play online

The latest build is automatically deployed to GitHub Pages — play it here: https://sergeypogorelov1993.github.io/flappy-bird/

## Getting started

```bash
npm install
npm run dev
```

Then open the printed URL (typically `http://localhost:5173`) in your browser.

## Gameplay

- Tap/click or press <kbd>Space</kbd>/<kbd>Arrow Up</kbd> to flap.
- Avoid the pipes and the ground to survive.
- Your best score is tracked locally per session.

## Testing

Unit tests cover the physics helpers that drive the game loop.

```bash
npm test
```

## Build & deploy locally

```bash
npm run build
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs the same production build and publishes the `dist` folder to GitHub Pages.
