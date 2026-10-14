# Emoji Mono

A small collection of single-purpose emoji animations. Each site sends an
emoji bouncing around the viewport and switches to another skin-tone variant
whenever it hits an edge.

The monorepo consolidates the original standalone Hand Shake and Middle Finger
experiments so they can share the animation, layout, styling, and tooling.

## Apps

- `apps/hand-shake` — cycles through the mixed-skin-tone handshake emoji
  combinations
- `apps/middle-finger` — cycles through the middle-finger skin-tone variants

## Shared packages

- `@repo/astro-shared` — shared Astro layout and bouncing-emoji animation
- `@repo/tailwind` — shared Tailwind CSS theme
- `@repo/typescript-config` — shared TypeScript configuration
- `@repo/ui` — shared UI utilities

## Stack

- Astro
- TypeScript
- Tailwind CSS
- Turborepo
- Bun workspaces

## Local development

Use Node.js 22.12 or newer and Bun 1.3.14. Install the workspace dependencies:

```sh
bun install
```

Run every app in development mode:

```sh
bun run dev
```

Or run one app at a time:

```sh
bunx turbo dev --filter=hand-shake
bunx turbo dev --filter=middle-finger
```

The Middle Finger app uses port `4322`; Astro assigns the default development
port to Hand Shake.

## Build and check

```sh
bun run build
bun run check-types
bun run knip
bun run test
```

The sites are deliberately tiny: the animation runs in the browser, respects
viewport resizing, and does not require a backend or runtime configuration.
