# Card Reveal Background

A React-friendly package for creating a standing 3D card reveal background effect.

The main entry point is `HeroCardContainer`, which accepts a single props object and renders a stacked card scene with a fixed base tilt, per-card hover behavior, optional mouse-driven dynamics, and adjustable density.

## Install

```bash
npm install hero-stand-3d react react-dom
```

## Basic Usage

```tsx
import { HeroCardContainer } from "hero-stand-3d";
import "hero-stand-3d/style.css";

export default function App() {
  return (
    <HeroCardContainer
      items={[
        { image: "/images/a.jpg", href: "/a" },
        { image: "/images/b.jpg", href: "/b" },
        { image: "/images/c.jpg", href: "/c" },
      ]}
      baseAngles={{ x: 70, y: 0, z: 40 }}
      hoverRotate={0}
      hoverShift={0}
      density={0.3}
      enableMouseDynamic={true}
      resetOnPointerLeave={false}
      cardAspectRatio="16 / 9"
    />
  );
}
```

## Props

| Prop                  | Type                                     |                  Default | Description                                          |
| --------------------- | ---------------------------------------- | -----------------------: | ---------------------------------------------------- |
| `items`               | `Hero3DProjectItem[]`                    |                 required | Array of cards to render                             |
| `baseAngles`          | `{ x?: number; y?: number; z?: number }` | `{ x: 70, y: 0, z: 40 }` | Initial tilt of the outer list plane                 |
| `hoverRotate`         | `number`                                 |                      `0` | Additional pointer-driven rotation range             |
| `hoverShift`          | `number`                                 |                      `0` | Hover lift in pixels                                 |
| `density`             | `number`                                 |                    `0.3` | Stack compactness from loose (`0`) to dense (`1`)    |
| `enableMouseDynamic`  | `boolean`                                |                  `false` | Enables pointer-based X/Z angle dynamics             |
| `resetOnPointerLeave` | `boolean`                                |                  `false` | If `true`, the stack returns to base angles on leave |
| `transitionMs`        | `number`                                 |                    `320` | Transition duration in milliseconds                  |
| `cardAspectRatio`     | `string`                                 |                 `16 / 9` | Card aspect ratio                                    |
| `className`           | `string`                                 |                     `""` | Extra class name applied to the root element         |

### Item props

| Prop             | Type     | Default  | Description                       |
| ---------------- | -------- | -------- | --------------------------------- |
| `image`          | `string` | required | Background image URL              |
| `title`          | `string` | optional | Optional card title               |
| `href`           | `string` | `"#"`    | Card link URL                     |
| `target`         | `string` | optional | Link target, for example `_blank` |
| `overlayOpacity` | `number` | `0.52`   | Default overlay opacity           |

## Behavior

- The outer `project-list-wrap` stays flat in 3D space.
- The inner `project-list` is tilted with the configured base angles.
- Each `project-item` stands upright using `rotateX(-90deg) rotateY(0deg) rotateZ(0deg)`.
- Hovering a card lifts it, fades the overlay, and brings it to the front.
- If `enableMouseDynamic` is enabled, pointer movement adjusts the base angles around the center point.

## Demo

### 1. Install dependencies

```bash
npm install
```

### 2. Run the local demo

```bash
npm run demo
```

Then open:

- http://localhost:5173/

### 3. What to check

- Cards stand upright and stay centered in the viewport
- Hovering a card lifts it and fades its overlay
- Density changes the stack spacing
- The mouse dynamic toggle changes pointer behavior
- The layout still looks correct on mobile

## API

### `HeroCardContainer`

```tsx
import { HeroCardContainer } from "hero-stand-3d";
```

Use `HeroCardContainer` when you want a React component interface. It accepts the same props listed above and internally mounts the card scene for you.

### `createHero3DProjectList(element, props)`

You can still use the imperative DOM API directly if you prefer.

Returns:

- `destroy()` - removes the rendered content and listeners
- `update(partialProps)` - updates options and/or items

### `createHero3D(element, options)`

Legacy single-card mode is still available.

```tsx
import { createHero3D } from "hero-stand-3d";
import "hero-stand-3d/style.css";

const heroEl = document.getElementById("hero");

if (heroEl) {
  createHero3D(heroEl, {
    maxRotate: 12,
    depth: 48,
    scaleOnHover: 1.03,
    glare: true,
  });
}
```

## Publish

```bash
npm run check
npm run build
npm run pack:check
npm login
npm publish --access public
```

Before publishing, make sure the package name in `package.json` is available on npm.
