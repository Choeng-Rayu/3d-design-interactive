---
name: "3D Design Interactive"
description: "Design and build immersive 3D interactive web experiences using Three.js, React Three Fiber, drei, Spline, Blender, and WebGPU. Use when creating product configurators, virtual tours, 3D portfolios, scrollytelling, immersive landing pages, WebXR/VR scenes, or any browser-based 3D environment requiring user interaction (orbit/drag/click/hover/scroll), physics, animations, lighting, performance optimization (LOD, instancing, Draco compression), or accessibility (a11y, SEO) for 3D content."
author: "Choeng Rayu"
version: "1.0.0"
date: "2026-05-27"
---

# 3D Design Interactive

## Overview

**3D Design Interactive** is a comprehensive skill for designing and building production-grade 3D interactive web experiences that respond to user input — orbit, click, drag, hover, scroll, gestures, voice, and XR controllers. This skill covers the **full pipeline**: modeling → optimization → integration → interaction → performance → accessibility → ship.

**Core stack**: Three.js (renderer), React Three Fiber (declarative React glue), drei (helpers), Blender (authoring), Spline (no-code), Rapier/Cannon (physics), GSAP/Framer Motion 3D (animation), WebGPU (next-gen rendering).

---

## What This Skill Does

1. **Tool selection** — picks the right framework for the project (Three.js vs R3F vs Spline vs Unity WebGL)
2. **Asset pipeline** — guides Blender → glTF/GLB export → Draco/Meshopt compression → web-ready delivery
3. **Interaction design** — implements orbit controls, raycasting (click/hover), drag, scroll-driven animation, physics, XR
4. **Performance** — applies LOD, instancing, frustum culling, texture compression (KTX2/Basis), shader optimization, adaptive DPR
5. **Accessibility & SEO** — adds `@react-three/a11y`, ARIA, keyboard nav, reduced-motion fallbacks, structured data
6. **Verification** — provides screenshot harness, FPS budgets, bundle budgets, Lighthouse checks

---

## How to Install This Skill in an AI Agent

> **Universal Compatibility**: This skill works with **any agentic AI** that supports skill ingestion — including Claude Code, Codex, Cursor, OpenClaw, Kimi CLI, Gemini CLI, and custom agent frameworks. The installation steps below use **Claude Code** as the primary example, but the same principles apply everywhere.

### Agent-Specific Skill Directories

| AI Agent | Default Skills Path |
|---|---|
| **Claude Code** | `~/.claude/skills/` |
| **Codex** | `~/.codex/skills/` |
| **Cursor** | `.cursor/rules/` or `~/.cursor/skills/` |
| **OpenClaw** | `~/.openclaw/skills/` |
| **Kimi CLI** | `~/.kimi/skills/` |
| **Gemini CLI** | `~/.gemini/skills/` |
| **Kilo** | `~/.kilo/skills/` or project `.kilo/skills/` |
| **OpenCode** | `~/.opencodes/skills/` or project `.opencodes/skills/` |
| **Antigravity** | `~/.antigravity/skills/` or project `.antigravity/skills/` |
| **Custom / Self-hosted** | Check your agent config for `skills_dir` or `rules_path` |

### Method 1: Direct Installation (Claude Code Example)

> Replace `~/.claude/skills/` with your agent's skills path from the table above.

1. **Create the skill directory**:
   ```bash
   mkdir -p ~/.claude/skills/3d-design-interactive
   ```

2. **Copy all files from this repository**:
   ```bash
   cp -r /path/to/3d-design-interactive/* ~/.claude/skills/3d-design-interactive/
   ```

3. **Verify the file structure**:
   ```bash
   ls ~/.claude/skills/3d-design-interactive/
   # Expected: SKILL.md  README.md  docs/  resources/  scripts/
   ```

4. **Restart your AI agent** to load the new skill.

### Method 2: Git Clone (Claude Code Example)

```bash
cd ~/.claude/skills
git clone https://github.com/your-username/3d-design-interactive.git
```

> For other agents, simply change the target directory:
> ```bash
> cd ~/.codex/skills      # Codex
> cd ~/.cursor/skills     # Cursor
> cd ~/.openclaw/skills   # OpenClaw
> cd ~/.kimi/skills       # Kimi CLI
> cd ~/.gemini/skills     # Gemini CLI
> cd ~/.kilo/skills       # Kilo
> cd ~/.opencodes/skills  # OpenCode
> cd ~/.antigravity/skills # Antigravity
> git clone <repo-url>
> ```

### Method 3: Manual File Creation (Universal)

If your agent does not have a dedicated skills directory, create the structure manually in any location your agent can read, then reference `SKILL.md` directly:

```
3d-design-interactive/
├── SKILL.md              # Main skill definition (required)
├── README.md             # This file
├── docs/
│   ├── A11Y_AND_SEO.md
│   ├── FRAMEWORK_DECISION.md
│   ├── INTERACTION_PATTERNS.md
│   ├── PERFORMANCE.md
│   ├── RECIPES.md
│   └── XR_GUIDE.md
├── resources/
│   ├── examples/
│   └── templates/
└── scripts/
    ├── optimize-glb.sh
    ├── perf-budget.sh
    └── scaffold-r3f.sh
```

**For agent frameworks without auto-discovery**, paste the contents of `SKILL.md` into your agent's system prompt, context window, or rules file.

### Verification

After installation, confirm the skill is active:

```bash
# Claude Code
claude skills list | grep "3D Design Interactive"

# Or simply ask your agent:
# "List your available skills" or "Do you have the 3D Design Interactive skill loaded?"
```

If your agent does not have a skills list command, test by prompting:
> *"Build a React Three Fiber scene with an interactive cube that changes color on hover."*

The agent should respond using patterns from this skill (e.g., mentioning `meshStandardMaterial`, `onPointerOver`, `OrbitControls`, `dpr` optimization).

---

## How to Use This Skill

### Quick Start Pattern

When you need 3D interactive content, invoke the skill by describing your goal:

```
"Build a 3D product configurator with color/material swap"
"Create a scrollytelling landing page with 3D hero"
"Add a virtual tour with room navigation and hotspots"
"Make an immersive 3D portfolio with hover interactions"
```

The skill will automatically:
1. Recommend the right framework (R3F, Spline, Three.js, etc.)
2. Scaffold the project structure
3. Provide optimized asset pipeline commands
4. Implement interaction patterns
5. Set up performance budgets
6. Add accessibility fallbacks

### Pattern 1: Product Configurator

**Use case**: E-commerce product viewer with color, material, and part customization.

**Agent invocation**:
```
"Build a 3D product configurator using React Three Fiber with:
- GLB model loading from /models/product.glb
- Color picker that updates meshStandardMaterial.color
- Material toggle (matte / metallic / glossy)
- Part visibility toggles
- OrbitControls with damping
- Responsive canvas"
```

**What the skill provides**:
- `useGLTF` preloading pattern
- Material state management with `useState`
- Raycasting for part selection
- `Center` and `Bounds` from drei for framing
- Performance-optimized re-renders

**Reference**: See [`docs/RECIPES.md`](docs/RECIPES.md) → "Product configurator"

### Pattern 2: Scrollytelling Hero

**Use case**: Editorial landing page where 3D camera moves with page scroll.

**Agent invocation**:
```
"Create a scrollytelling hero section with:
- ScrollControls driving camera position
- Multiple HTML sections overlaid on 3D canvas
- Smooth camera fly-through keyframes
- Text that fades in sync with 3D reveals
- Mobile-friendly scroll behavior"
```

**What the skill provides**:
- `<ScrollControls>` + `useScroll()` setup
- GSAP ScrollTrigger integration
- Camera rig with `useFrame` interpolation
- HTML overlay positioning with `<Html>`

**Reference**: See [`docs/RECIPES.md`](docs/RECIPES.md) → "Scrollytelling hero"

### Pattern 3: Virtual Tour

**Use case**: Navigate through 3D spaces (rooms, galleries, buildings) with clickable hotspots.

**Agent invocation**:
```
"Build a virtual tour with:
- Multi-room GLB scene loading
- Hotspot markers (click to move camera)
- Smooth camera fly-to transitions
- Info panels on hotspot click
- Minimap or room selector UI
- Back/forward navigation history"
```

**What the skill provides**:
- Scene switching with `Suspense` and `preload`
- Camera animation with `@react-spring/three` or `useFrame`
- Raycast hotspot detection
- State machine for room navigation

**Reference**: See [`docs/RECIPES.md`](docs/RECIPES.md) → "Virtual tour"

### Pattern 4: Immersive Portfolio

**Use case**: Creative portfolio with 3D elements that react to hover and click.

**Agent invocation**:
```
"Create an immersive 3D portfolio with:
- Floating 3D cards representing projects
- Hover reveals project info with Html overlays
- Click expands to fullscreen detail view
- Particle background or ambient environment
- Smooth page transitions
- Reduced motion fallback"
```

**What the skill provides**:
- `<Float>` from drei for ambient motion
- `<Html>` tooltips with pointer-event handling
- Layout animation with `framer-motion-3d`
- Performance-budget enforcement

**Reference**: See [`docs/RECIPES.md`](docs/RECIPES.md)

### Pattern 5: WebXR/VR Experience

**Use case**: VR-ready scene for headsets or AR placement on mobile.

**Agent invocation**:
```
"Build a WebXR experience with:
- VR session support via @react-three/xr
- Hand tracking and controller input
- Interactive objects that respond to VR grabs
- AR hit-testing for model placement
- Teleportation or smooth locomotion"
```

**What the skill provides**:
- `<XR>` provider setup
- `useXR()` hook for session state
- Interactive components with `useInteraction`
- AR button and hit-test patterns

**Reference**: See [`docs/XR_GUIDE.md`](docs/XR_GUIDE.md)

---

## Core Concepts

### Framework Decision Tree

Choose the right tool for your project using [`docs/FRAMEWORK_DECISION.md`](docs/FRAMEWORK_DECISION.md):

| Goal | Best Tool | Why |
|---|---|---|
| Marketing landing page with hero 3D | **R3F + drei** | Fast, declarative, small bundle |
| No-code designer-led 3D | **Spline** | Visual editor, embed via iframe or `@splinetool/react-spline` |
| Game-like complex world | **Unity WebGL** or **PlayCanvas** | Mature engines, but heavier bundles |
| Detailed model authoring | **Blender** → glTF | Industry standard, free, full pipeline |
| Procedural / shader-heavy art | **Three.js + custom GLSL** | Maximum control via raw `ShaderMaterial` |
| Bleeding-edge perf | **WebGPU** (`three/webgpu`) | 2-5× faster than WebGL2 where supported |

### Asset Pipeline

```
Blender (model) → glTF Binary (.glb) → gltf-transform (compress) → web delivery
```

**Compression command**:
```bash
pnpm dlx @gltf-transform/cli optimize input.glb output.glb \
  --texture-compress webp --texture-resize 2048 \
  --simplify --simplify-ratio 0.75
```

### Interaction Archetypes

1. **Orbit / Inspect** — `OrbitControls` for product viewers
2. **Click / Hover** — R3F raycasting events (`onClick`, `onPointerOver`)
3. **Drag** — `@use-gesture/react` + `useThree`
4. **Scroll-Driven** — `<ScrollControls>` + `useScroll()`
5. **Physics** — `@react-three/rapier` for real-world feel
6. **XR** — `@react-three/xr` for VR/AR

---

## Performance Targets (Must Hit Before Ship)

- **60 FPS** on mid-tier mobile (iPhone 12, Pixel 6)
- **≤ 200 KB** gzipped JS for landing-page hero scene
- **LCP < 2.5s**, **INP < 200ms**
- **≤ 100 draw calls** in a typical frame

**Tactics**: Adaptive DPR, frustum culling, instancing, LOD, texture compression (KTX2/WebP), lazy loading, shadow optimization.

Full checklist: [`docs/PERFORMANCE.md`](docs/PERFORMANCE.md)

---

## Accessibility & SEO

3D content is **invisible to screen readers and crawlers** by default. This skill ensures:

- Semantic HTML fallback (visually hidden, readable by assistive tech)
- `@react-three/a11y` for focusable 3D regions and keyboard nav
- `prefers-reduced-motion` respect
- WCAG 2.2 AA contrast on UI overlays
- Pre-rendered OG images, JSON-LD structured data

Full guide: [`docs/A11Y_AND_SEO.md`](docs/A11Y_AND_SEO.md)

---

## Advanced Techniques

### Shader Programming

For custom visual effects (dissolve, hologram, gradient), write raw GLSL:

```glsl
// vertex.glsl
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// fragment.glsl
uniform float uTime;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(vUv, sin(uTime) * 0.5 + 0.5, 1.0);
}
```

Use `shaderMaterial` from drei or raw `ShaderMaterial` from Three.js.

### Post-Processing Stack

```tsx
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom intensity={0.5} />
  <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} />
</EffectComposer>
```

### Physics Integration

```tsx
import { Physics, RigidBody } from '@react-three/rapier'

<Physics gravity={[0, -9.81, 0]}>
  <RigidBody><mesh>{/* dynamic */}</mesh></RigidBody>
  <RigidBody type="fixed"><mesh>{/* static ground */}</mesh></RigidBody>
</Physics>
```

---

## Project Scaffolding

Use the included scripts for rapid setup:

```bash
# Scaffold a new R3F + TypeScript project
./scripts/scaffold-r3f.sh my-3d-app

# Optimize GLB assets for production
./scripts/optimize-glb.sh assets/*.glb

# Check performance budgets before deploy
./scripts/perf-budget.sh
```

### Available Templates

Located in [`resources/templates/`](resources/templates/):

- `product-viewer/` — orbit + material swap + a11y
- `scrolly-hero/` — scroll-driven camera path
- `xr-room/` — VR-ready scene with controllers

---

## Best Practices

### 1. Start with R3F + drei
Unless you have a specific reason to use raw Three.js, start with React Three Fiber. It provides:
- Declarative scene composition
- Automatic render loop management
- Built-in event handling
- Huge ecosystem of helpers

### 2. Optimize Assets Early
Compress models before they enter the codebase. Use `gltf-transform` as part of your build pipeline, not as an afterthought.

### 3. Profile on Real Devices
Desktop Chrome is not representative. Test on:
- Mid-tier Android (Pixel 6 class)
- iPhone 12 or older
- Tablets with thermal constraints

### 4. Progressive Enhancement
- Ship a static image or CSS fallback while 3D loads
- Respect `prefers-reduced-motion`
- Provide non-WebGL fallbacks for low-end devices

### 5. Event Handling Hygiene
- Always `e.stopPropagation()` in R3F event handlers
- Use `pointer-events: none` on decorative HTML overlays
- Debounce expensive raycasting operations

### 6. State Management
- Keep 3D state close to the canvas (React Context or Zustand)
- Avoid prop-drilling through the scene graph
- Use `useFrame` for animation, not `setInterval`

---

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| **Black screen** | No lights / WebGL error | Add `<ambientLight />`, check console |
| **Model too small/huge** | Unit scale mismatch | Apply scale in Blender or `<primitive scale={0.01} />` |
| **Janky on mobile** | Too many draw calls / high DPR | Cap `dpr={[1, 2]}`, reduce polys, KTX2 textures |
| **Clicks not firing** | Transparent mesh / HTML overlay | Ensure material is visible, set `pointer-events: none` on HTML |
| **GLB looks different** | No environment map / lighting bake | Add `<Environment preset="city" />`, bake in Blender |
| **`nodes` undefined** | Wrong GLB path | Ensure file is in `public/`, path starts with `/` |
| **Slow initial load** | Large unoptimized assets | Run `scripts/optimize-glb.sh`, lazy-load scenes |

---

## Tool Catalog

| Category | Tool | When to Use |
|---|---|---|
| **Renderer** | Three.js | Foundation; raw control |
| **Renderer** | three/webgpu | Modern GPU API, faster |
| **React glue** | @react-three/fiber | React-driven scenes |
| **Helpers** | @react-three/drei | OrbitControls, Environment, useGLTF, Html |
| **Physics** | @react-three/rapier | Fast Rust-WASM physics |
| **XR** | @react-three/xr | WebXR VR/AR sessions |
| **Postprocessing** | @react-three/postprocessing | Bloom, DOF, SSR |
| **Animation** | gsap, framer-motion-3d | Timeline-based animation |
| **Animation** | @react-spring/three | Spring physics |
| **Gestures** | @use-gesture/react | Drag, pinch, scroll |
| **Accessibility** | @react-three/a11y | Focusable 3D regions |
| **No-code** | Spline | Designer-friendly |
| **Authoring** | Blender | Free, full pipeline |
| **Compression** | gltf-transform | CLI for draco/meshopt/ktx2 |
| **Profiler** | r3f-perf, spectorjs | FPS + GPU debugging |

---

## Related Skills

- `frontend-design-pro` — overall frontend design system & visual direction
- `motion-ui` / `motion-advanced` — 2D motion that pairs with 3D
- `ui-styling` — Tailwind/CSS layer above the canvas
- `accessibility` — broader a11y patterns
- `seo` — discoverability for image-heavy pages
- `e2e-testing` — Playwright visual regression for 3D scenes

---

## Resources

- [Three.js docs](https://threejs.org/docs/)
- [Three.js examples](https://threejs.org/examples/)
- [R3F docs](https://r3f.docs.pmnd.rs/)
- [drei storybook](https://drei.docs.pmnd.rs/)
- [glTF spec](https://github.com/KhronosGroup/glTF)
- [gltf-transform CLI](https://gltf-transform.dev/)
- [The Book of Shaders](https://thebookofshaders.com/)
- [Bruno Simon's Three.js Journey](https://threejs-journey.com/)
- [Poimandres collective](https://github.com/pmndrs)

---

**Author**: Choeng Rayu  
**Version**: 1.0.0  
**Created**: 2026-05-27  
**Stack**: Three.js · R3F · drei · Blender · Spline · WebGPU  
**Difficulty**: Intermediate → Advanced
