---
name: "3D Interactive Web Design"
description: "Design and build immersive 3D interactive web experiences using Three.js, React Three Fiber, drei, Spline, Blender, and WebGPU. Use when creating product configurators, virtual tours, 3D portfolios, scrollytelling, immersive landing pages, WebXR/VR scenes, or any browser-based 3D environment requiring user interaction (orbit/drag/click/hover/scroll), physics, animations, lighting, performance optimization (LOD, instancing, draco compression), or accessibility (a11y, SEO) for 3D content."
---

# 3D Interactive Web Design

## Level 1: Overview

Build production-grade 3D interactive web experiences that respond to user input — orbit, click, drag, hover, scroll, gestures, voice, and XR controllers. This skill covers the **full pipeline**: modeling → optimization → integration → interaction → performance → accessibility → ship.

**Core stack**: Three.js (renderer), React Three Fiber (declarative React glue), drei (helpers), Blender (authoring), Spline (no-code), Rapier/Cannon (physics), GSAP/Framer Motion 3D (animation), WebGPU (next-gen rendering).

---

## Prerequisites

- **Node.js** 20+ and a package manager (pnpm preferred per global rules)
- **React** 18+ (for R3F path) or vanilla JS (for raw Three.js)
- **GPU-capable browser** for testing (Chrome/Edge/Firefox/Safari with WebGL2; Chrome Canary for WebGPU)
- **Blender** 4.x (optional, for authoring custom assets)
- **Familiarity** with vectors, matrices, quaternions at a conceptual level

---

## What This Skill Does

1. **Tool selection** — picks the right framework for the project (Three.js vs R3F vs Spline vs Unity WebGL)
2. **Asset pipeline** — guides Blender → glTF/GLB export → Draco/Meshopt compression → web-ready delivery
3. **Interaction design** — implements orbit controls, raycasting (click/hover), drag, scroll-driven animation, physics, XR
4. **Performance** — applies LOD, instancing, frustum culling, texture compression (KTX2/Basis), shader optimization, adaptive DPR
5. **Accessibility & SEO** — adds `@react-three/a11y`, ARIA, keyboard nav, reduced-motion fallbacks, structured data
6. **Verification** — provides screenshot harness, FPS budgets, bundle budgets, Lighthouse checks

---

## Level 2: Quick Start

### Scaffold a React Three Fiber Project (Recommended Default)

```bash
pnpm create vite@latest my-3d-app -- --template react-ts
cd my-3d-app
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
pnpm dev
```

Replace `src/App.tsx` with the **Interactive Cube** template:

```tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useRef, useState } from 'react'
import type { Mesh } from 'three'

function InteractiveBox() {
  const ref = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.5
  })

  return (
    <mesh
      ref={ref}
      scale={active ? 1.4 : 1}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive((v) => !v)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#ff5577' : '#3388ff'} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas camera={{ position: [3, 2, 3] }} dpr={[1, 2]}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <InteractiveBox />
      <OrbitControls enableDamping />
      <Environment preset="city" />
    </Canvas>
  )
}
```

That's a fully interactive 3D scene: hover changes color, click scales up, drag orbits the camera. **Ship-quality starting point.**

### Common Scenarios → Pick the Right Path

| Goal | Best Tool | Why |
|---|---|---|
| Marketing landing page with hero 3D | **R3F + drei** | Fast, declarative, small bundle |
| No-code designer-led 3D | **Spline** | Visual editor, embed via iframe or `@splinetool/react-spline` |
| Game-like complex world | **Unity WebGL** or **PlayCanvas** | Mature engines, but heavier bundles |
| Detailed model authoring | **Blender** → glTF | Industry standard, free, full pipeline |
| Procedural / shader-heavy art | **Three.js + custom GLSL** | Maximum control via raw `ShaderMaterial` |
| Bleeding-edge perf | **WebGPU** (`three/webgpu`) | 2-5× faster than WebGL2 where supported |

---

## Level 3: Detailed Instructions

### Step 1: Choose Your Framework

Run the **decision tree** in [`docs/FRAMEWORK_DECISION.md`](docs/FRAMEWORK_DECISION.md) — it asks 6 questions (team skill, asset complexity, interaction depth, target devices, SEO needs, budget) and outputs a recommendation.

Default for most teams: **React Three Fiber + drei**. Reasons:
- Declarative scene graph composes like normal React
- Huge ecosystem (drei, postprocessing, rapier, xr, a11y, csg)
- Tree-shakeable — typical landing scene ships ~120-180 KB gzipped JS
- Hot-reloads scene changes without losing GPU state

### Step 2: Asset Pipeline (Blender → Web)

#### 2a. Author or Source Models
- **Author**: Blender 4.x. Keep poly count modest — aim ≤ 50k triangles for hero meshes, ≤ 5k for background props.
- **Source**: Sketchfab, Quaternius, Poly Pizza, Kenney, KhronosGroup glTF samples (CC0/CC-BY).
- **Capture**: Photogrammetry via Polycam, RealityScan, or LiDAR for real-world objects.

#### 2b. Export to glTF 2.0 / GLB
glTF is **the** web 3D format — JSON+binary, supports PBR materials, animations, skeletons, morph targets.

Blender export checklist:
- Format: **glTF Binary (.glb)** for single-file delivery
- Apply transforms (Object → Apply → All Transforms) before export
- Triangulate faces
- Bake lighting into textures if scene is mostly static
- Pack textures (Image → Pack All)

#### 2c. Compress
Run a **single command** to draco+meshopt+ktx2 compress:

```bash
pnpm dlx @gltf-transform/cli optimize input.glb output.glb \
  --texture-compress webp --texture-resize 2048 \
  --simplify --simplify-ratio 0.75
```

For aggressive compression also see `scripts/optimize-glb.sh`.

Typical savings: **70-90%** file size, imperceptible quality loss.

#### 2d. Load in R3F

```tsx
import { useGLTF, Center } from '@react-three/drei'

useGLTF.preload('/models/product.glb')

function Product() {
  const { scene } = useGLTF('/models/product.glb')
  return <Center><primitive object={scene} /></Center>
}
```

### Step 3: Implement Interactivity

**Five interaction archetypes** — pick what your UX needs:

#### 3a. Orbit / Inspect (product viewer)
```tsx
<OrbitControls enableDamping minDistance={2} maxDistance={8} />
```

#### 3b. Click / Hover (raycasting)
R3F gives you `onClick`, `onPointerOver`, `onPointerOut`, `onPointerMove` for free on any mesh. Always `e.stopPropagation()` to prevent bubbling through layered meshes.

#### 3c. Drag (gesture)
Use `@use-gesture/react` + `useThree` to convert pointer deltas to world-space movement. See [`docs/INTERACTION_PATTERNS.md`](docs/INTERACTION_PATTERNS.md) for a full draggable-with-physics example.

#### 3d. Scroll-Driven (scrollytelling)
Use `@react-three/drei`'s `<ScrollControls>` + `useScroll()` hook to drive camera or timeline based on page scroll offset. Combine with GSAP ScrollTrigger for editorial layouts.

#### 3e. Physics (real-world feel)
Add `@react-three/rapier` for fast Rust-WASM physics:

```tsx
import { Physics, RigidBody } from '@react-three/rapier'

<Physics gravity={[0, -9.81, 0]}>
  <RigidBody><mesh>{/* falls */}</mesh></RigidBody>
  <RigidBody type="fixed"><mesh>{/* ground */}</mesh></RigidBody>
</Physics>
```

#### 3f. XR (VR/AR)
`@react-three/xr` gives you VR sessions, hand tracking, and AR hit-testing in ~20 lines. See [`docs/XR_GUIDE.md`](docs/XR_GUIDE.md).

### Step 4: Performance Optimization

**Hard targets** (must hit before ship):
- 60 FPS on mid-tier mobile (e.g. iPhone 12, Pixel 6)
- ≤ 200 KB gzipped JS for landing-page hero scene
- LCP < 2.5s, INP < 200ms (per global web/performance.md rules)
- ≤ 100 draw calls in a typical frame

**Tactics** (apply in this order):

1. **Adaptive DPR**: `dpr={[1, 2]}` in `<Canvas>` — caps device pixel ratio to 2 even on retina screens.
2. **Frustum culling**: enabled by default in Three.js — make sure mesh `frustumCulled` isn't disabled.
3. **Instancing**: 100+ identical meshes? Use `<Instances>` from drei. Drops 100 draws to 1.
4. **LOD**: drei `<Detailed>` swaps mesh resolution based on camera distance.
5. **Texture compression**: KTX2/Basis via `gltf-transform`. Saves GPU memory + bandwidth.
6. **Lazy load**: Heavy scenes? Use `React.lazy()` + `Suspense` with a 2D loading state.
7. **Disable shadows by default**, enable per-light only if needed. Shadow maps are expensive.
8. **Profile**: open `r3f-perf` (`pnpm add r3f-perf` then `<Perf />`) and Chrome DevTools → Performance.

Full checklist: [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md).

### Step 5: Accessibility & SEO

3D content is **invisible to screen readers and crawlers** by default. Mitigations:

- **Semantic fallback**: render an HTML `<section>` with the same content (product description, alt text) — visually hidden but readable by assistive tech.
- **`@react-three/a11y`**: wraps meshes with focusable, screen-reader-announced regions. Adds keyboard nav (Tab/Enter/Space).
- **Reduced motion**: respect `prefers-reduced-motion`; disable auto-rotate, parallax, and decorative animation.
- **Contrast & cursor**: ensure UI overlays meet WCAG 2.2 AA contrast.
- **SEO**: ship pre-rendered hero image (`<meta property="og:image">`), structured data (JSON-LD `Product` schema), descriptive `<title>` and `<meta name="description">`.

Full guide: [`docs/A11Y_AND_SEO.md`](docs/A11Y_AND_SEO.md).

---

## Level 4: Reference

### Tool Catalog

| Category | Tool | When to Use |
|---|---|---|
| **Renderer** | Three.js | Foundation; raw control |
| **Renderer** | three/webgpu | Modern GPU API, faster, where supported |
| **React glue** | @react-three/fiber | React-driven scenes |
| **Helpers** | @react-three/drei | OrbitControls, Environment, useGLTF, Html, etc. |
| **Physics** | @react-three/rapier | Fast Rust-WASM physics |
| **Physics (alt)** | @react-three/cannon | JS-only, simpler scenes |
| **XR** | @react-three/xr | WebXR VR/AR sessions |
| **Postprocessing** | @react-three/postprocessing | Bloom, DOF, SSR, vignette |
| **Animation** | gsap, framer-motion-3d | Timeline-based animation |
| **Animation** | @react-spring/three | Spring physics for transitions |
| **Gestures** | @use-gesture/react | Drag, pinch, scroll |
| **Accessibility** | @react-three/a11y | Focusable 3D regions |
| **No-code** | Spline | Designer-friendly |
| **Game engine** | Unity WebGL, PlayCanvas, Babylon.js | Heavier projects |
| **Authoring** | Blender | Free, full pipeline |
| **Authoring (alt)** | Maya, 3ds Max, Cinema 4D | Studio workflows |
| **Compression** | gltf-transform | CLI for draco/meshopt/ktx2 |
| **Compression (alt)** | gltfpack (meshopt) | Standalone meshopt |
| **Inspector** | gltf.report, sandbox.gltf.report | Validate & inspect glb/gltf |
| **Profiler** | r3f-perf, spectorjs | In-app FPS + GPU debugging |

### Common Tasks → Recipes

See **[`docs/RECIPES.md`](docs/RECIPES.md)** for ready-to-paste examples:
- Product configurator (color/material/parts swap)
- Scrollytelling hero (camera flies through scenes)
- Virtual tour (room navigation with hotspots)
- 3D map (markers + camera fly-to)
- Hover tooltips with `<Html>` overlays
- Reflective floor (mirror, contact shadows)
- Particle system (fireflies, snow, smoke)
- Custom shader (gradient, dissolve, hologram)
- Character with idle/walk/run animation blending
- Web AR (place model in real world via phone camera)

### Project Templates

Use ready-made starters under [`resources/templates/`](resources/templates/):
- `product-viewer/` — orbit + material swap + a11y
- `scrolly-hero/` — scroll-driven camera path
- `xr-room/` — VR-ready scene with controllers

### Scripts

| Script | Purpose |
|---|---|
| [`scripts/optimize-glb.sh`](scripts/optimize-glb.sh) | Compress GLB (draco + meshopt + ktx2 textures) |
| [`scripts/scaffold-r3f.sh`](scripts/scaffold-r3f.sh) | One-command R3F + drei project setup |
| [`scripts/perf-budget.sh`](scripts/perf-budget.sh) | Lighthouse + bundle-size check against budgets |

### Troubleshooting

#### Black screen / nothing renders
- Check the browser console for WebGL context errors
- Verify camera position isn't inside the mesh
- Add an `<ambientLight />` — `meshStandardMaterial` is invisible without lighting

#### Model loads but appears tiny / huge
- Blender unit scale mismatch. In R3F: `<primitive object={scene} scale={0.01} />` or fix in Blender (Apply → Scale).

#### Janky performance on mobile
- Check `dpr` cap, disable shadows, reduce poly count, switch textures to KTX2/WebP at 1024² max
- Run [`scripts/perf-budget.sh`](scripts/perf-budget.sh) to see what's blowing the budget

#### Click/hover doesn't fire
- Mesh needs `userData` or visible material — fully transparent meshes don't raycast
- Wrapping `<Html>` overlays can swallow events; set `pointer-events: none` on decorative HTML

#### Imported GLB looks different from Blender
- Blender uses Cycles/Eevee; web uses real-time PBR. Bake lighting or accept the look.
- Check that environment map (`<Environment />`) is present — most "realistic" PBR needs IBL.

#### "Cannot read property 'nodes' of undefined" with useGLTF
- Make sure the `.glb` is in `public/` and the path starts with `/` (e.g. `/models/x.glb`)

### Related Skills

- `frontend-design-pro` — overall frontend design system & visual direction
- `motion-ui` / `motion-advanced` — 2D motion that pairs with 3D
- `ui-styling` — Tailwind/CSS layer above the canvas
- `accessibility` — broader a11y patterns
- `seo` — discoverability for image-heavy pages
- `e2e-testing` — Playwright visual regression for 3D scenes

### Resources

- [Three.js docs](https://threejs.org/docs/)
- [Three.js examples](https://threejs.org/examples/) — copy-paste gold
- [R3F docs](https://r3f.docs.pmnd.rs/)
- [drei storybook](https://drei.docs.pmnd.rs/)
- [glTF spec](https://github.com/KhronosGroup/glTF)
- [gltf-transform CLI](https://gltf-transform.dev/)
- [The Book of Shaders](https://thebookofshaders.com/) — GLSL learning
- [Bruno Simon's Three.js Journey](https://threejs-journey.com/) — premier course
- [Poimandres collective](https://github.com/pmndrs) — maintainers of R3F/drei/rapier/xr

---

**Created**: 2026-05-27
**Stack**: Three.js · R3F · drei · Blender · Spline · WebGPU
**Difficulty**: Intermediate → Advanced
