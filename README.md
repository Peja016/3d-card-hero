# hero-stand-3d

A publishable npm package for a 3D standing hero/project-card stack.

## Features

- Multi-image 3D stacked card list
- Fixed base tilt on the list plane
- Cards stand up from that plane
- Per-card hover shift
- Adjustable stack density
- Optional mouse-driven dynamic tilt

## Demo (Local)

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

### 3. What to verify

- Cards are standing in 3D and centered in the viewport
- Hover on each card raises the card and fades overlay
- Density slider changes stack compactness
- Base angles update the plane orientation correctly
- Mobile viewport still renders correctly

## Install

```bash
npm install hero-stand-3d
```

## Usage (Project List)

```html
<div id="heroList"></div>
```

```ts
import { createHero3DProjectList } from "hero-stand-3d";
import "hero-stand-3d/style.css";

const el = document.getElementById("heroList");

if (el) {
  createHero3DProjectList(el, {
    items: [
      { image: "https://example.com/a.jpg", href: "/a" },
      { image: "https://example.com/b.jpg", href: "/b" },
      { image: "https://example.com/c.jpg", href: "/c" },
    ],
    baseAngles: { x: 70, y: 0, z: 40 },
    hoverRotate: 0,
    hoverShift: 0,
    density: 0.3,
    enableMouseDynamic: false,
    cardAspectRatio: "16 / 9",
  });
}
```

## Legacy Single Card Mode

You can still use the single-card API:

```html
<div class="hero3d" id="hero">
  <img class="hero3d-image" src="/your-image.jpg" alt="Hero" />
  <div class="hero3d-content">
    <h1>Powerful Visual</h1>
    <p>3D standing scene with mouse rotate.</p>
  </div>
</div>
```

```ts
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

## API

### createHero3D(element, options)

- element: HTMLElement root element (recommended class: hero3d)
- options.maxRotate (number, default 11): max X/Y rotate range
- options.scaleOnHover (number, default 1.02): hover scale
- options.transitionMs (number, default 320): return transition
- options.depth (number, default 40): Z-axis depth lift
- options.glare (boolean, default true): enable glare layer

Returns:

- destroy(): remove listeners and cleanup
- update(partialOptions): runtime option update

### createHero3DProjectList(element, options)

- options.items (required): array of card items
- item.image (string): image URL
- item.title (string, optional): card title
- item.href (string, optional): card URL
- item.target (string, optional): e.g. \_blank
- item.overlayOpacity (number, optional): overlay opacity
- options.baseAngles (default { x: 70, y: 0, z: 40 }): list base tilt
- options.hoverRotate (default 0): additional rotate by pointer movement
- options.hoverShift (default 0): hover shift in px
- options.density (default 0.3): layout compactness (0 loose, 1 dense)
- options.enableMouseDynamic (default false): enable pointer-driven X/Z angle dynamics
- options.resetOnPointerLeave (default false): reset to base angles when pointer leaves; false keeps the last pose
- options.transitionMs (default 320): transition duration
- options.cardAspectRatio (default 16 / 9): card ratio
- options.className (default ""): extra class for root element

Returns:

- destroy(): remove content and listeners
- update(partialOptions): update options and/or items

## Pre-publish Check

```bash
npm run check
npm run build
npm run pack:check
```

## Publish to npm

```bash
npm login
npm publish --access public
```

Before publishing, confirm the name field in package.json is available on npm.
