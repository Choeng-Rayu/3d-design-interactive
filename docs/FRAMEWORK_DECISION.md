# Framework Decision Tree

Pick the right 3D web tool by answering these 6 questions in order.

## 1. Who's building?

- **Designers, no-coders** → **Spline** (visual editor, embed via iframe / `@splinetool/react-spline`)
- **Developers, React shop** → continue
- **Developers, vanilla JS / multiple frameworks** → **Three.js** directly

## 2. What's the project shape?

- **Marketing page, hero scene, portfolio, product viewer** → **R3F + drei** ✅ default
- **Game-like world, complex AI, networked multiplayer** → **PlayCanvas** or **Unity WebGL** (accept the bundle penalty)
- **Data viz, scientific** → **Three.js** + **deck.gl** or **D3** integration
- **CAD, BIM, large architectural models** → **xeokit-sdk** or **forge-viewer**

## 3. Asset complexity?

- **<50 unique meshes, <100MB total** → R3F handles it
- **Massive scene (city blocks, full buildings)** → consider streaming with **3D Tiles** + **Cesium**

## 4. Target devices?

- **Modern desktop only** → can ship WebGPU + heavier scenes
- **Mobile-first** → R3F + aggressive optimization (LOD, KTX2, instancing)
- **Low-end Android, 2G/3G** → reconsider 3D entirely; use rendered video or static images

## 5. SEO / accessibility critical?

- **Yes (e-commerce, public sector, healthcare)** → R3F + `@react-three/a11y` + pre-rendered fallback. Avoid Spline iframe (not crawlable).
- **No (internal tool, gated app)** → Spline iframe is fine

## 6. Budget for production?

- **Tight, <2 weeks** → Spline or R3F + drei boilerplate
- **Medium** → R3F custom + Blender authoring
- **Large, studio-grade** → Unity WebGL or custom Three.js + bespoke pipeline

---

## Quick recommendation matrix

| Project type | Tool | Reason |
|---|---|---|
| Hero animation on landing page | R3F + drei + GLB | Fast, lightweight, declarative |
| 3D product configurator (cars, shoes, furniture) | R3F + drei + Zustand | State management for swappable parts |
| Scrollytelling story | R3F + drei `<ScrollControls>` + GSAP | Timeline-driven camera |
| Virtual tour / real estate | R3F + drei `<Hotspots>` + 360° pano | Cube map background + nav points |
| Designer-led marketing experiment | Spline | Iterate without engineering bottleneck |
| WebXR / VR portfolio | R3F + `@react-three/xr` | Built-in session + controller support |
| Browser game | PlayCanvas or Three.js + ECS | Engine features, asset streaming |
| Bleeding-edge GPU compute | three/webgpu (TSL) | Compute shaders, modern API |

When in doubt: **R3F + drei**.
