# Performance Guide

Hard targets and the playbook to hit them.

## Budgets (Production)

| Metric | Target | Why |
|---|---|---|
| FPS desktop | 60 | Smooth feel |
| FPS mid-tier mobile | 60 | iPhone 12 / Pixel 6 baseline |
| FPS low-end mobile | 30 | Acceptable on cheap Android |
| Draw calls / frame | ≤ 100 | GPU submission overhead |
| Triangles on screen | ≤ 500k | Modern integrated GPUs |
| Hero JS bundle (gz) | ≤ 200 KB | Per global web/performance.md |
| App JS bundle (gz) | ≤ 400 KB | Heavier interactive scenes |
| First glb (gz) | ≤ 1.5 MB | Affects LCP |
| LCP | < 2.5s | Core Web Vitals |
| INP | < 200ms | Interaction responsiveness |
| GPU memory | ≤ 256 MB | Mobile GPU ceiling |

## Tactics in priority order

### 1. Adaptive Device Pixel Ratio (DPR)
Single biggest win on retina screens.

```tsx
<Canvas dpr={[1, 2]} /* min, max */>
```
Caps the canvas to 2× even on 3× iPhone screens. Drops fragment-shader load by ~55%.

For dynamic perf, use `usePerformance` from drei:

```tsx
import { PerformanceMonitor } from '@react-three/drei'

const [dpr, setDpr] = useState(1.5)
<PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)}>
  <Canvas dpr={dpr}>...</Canvas>
</PerformanceMonitor>
```

### 2. Texture Compression (KTX2 / Basis)
Textures dominate bundle size. PNG/JPEG decode to RGBA in GPU memory. KTX2 stays compressed on the GPU.

```bash
pnpm dlx @gltf-transform/cli optimize input.glb output.glb --texture-compress webp
# or for max compression:
pnpm dlx @gltf-transform/cli ktxtransform input.glb output.glb --mode etc1s
```

Loader:
```tsx
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
useLoader(GLTFLoader, '/model.glb', (loader) => {
  loader.setKTX2Loader(new KTX2Loader().setTranscoderPath('/basis/'))
})
```

Savings: 80-90% texture size, **identical perceived quality** for albedo/AO/roughness.

### 3. Geometry Compression (Draco / Meshopt)
Compress vertex data. Decoded by WASM.

```bash
pnpm dlx @gltf-transform/cli draco input.glb output.glb
# or meshopt (better random-access perf):
pnpm dlx @gltf-transform/cli meshopt input.glb output.glb
```

Savings: 50-90% geometry size.

### 4. Instancing
100+ identical meshes? One draw call instead of 100.

```tsx
import { Instances, Instance } from '@react-three/drei'

<Instances limit={1000}>
  <boxGeometry />
  <meshStandardMaterial />
  {positions.map((p, i) => (
    <Instance key={i} position={p} color={colors[i]} />
  ))}
</Instances>
```

Use for: trees, crowds, particles, repeated UI elements, scatter foliage.

### 5. Level of Detail (LOD)
Swap mesh quality based on camera distance.

```tsx
import { Detailed } from '@react-three/drei'

<Detailed distances={[0, 5, 15]}>
  <mesh geometry={highPoly} />     {/* 0-5m */}
  <mesh geometry={medPoly} />      {/* 5-15m */}
  <mesh geometry={lowPoly} />      {/* 15m+ */}
</Detailed>
```

Generate LODs in Blender via Decimate modifier (ratios: 1.0, 0.5, 0.2).

### 6. Frustum Culling
Three.js culls offscreen meshes by default. **Don't disable it** unless you know why. If models pop in/out incorrectly, fix the bounding sphere:

```ts
mesh.geometry.computeBoundingSphere()
```

### 7. Shadow Discipline
Shadows are expensive. Default rule:
- **0 shadows**: marketing pages, product viewers (use `<ContactShadows>` instead — fake but fast)
- **1 shadow-casting light**: hero scene, key direction
- **Multiple shadows**: only for editorial/showcase, accept lower FPS

If using shadows: cap `shadow.mapSize` to 1024 or 2048 (not 4096), tighten `shadow.camera` frustum.

```tsx
<directionalLight
  castShadow
  shadow-mapSize={[1024, 1024]}
  shadow-camera-near={1}
  shadow-camera-far={20}
  shadow-camera-left={-10}
  shadow-camera-right={10}
/>
```

### 8. Postprocessing Cost
Effects are full-screen passes. Each costs ~1-3ms on desktop, more on mobile.

- **Cheap**: vignette, color grading
- **Medium**: bloom, FXAA
- **Expensive**: SSR, SSAO, motion blur, depth of field
- **Mobile**: avoid postprocessing entirely if budget is tight

### 9. Lazy Loading
Don't ship the 3D bundle on initial page load if 3D is below the fold.

```tsx
const Scene = lazy(() => import('./Scene'))

<Suspense fallback={<StaticHeroImage />}>
  <Scene />
</Suspense>
```

Combine with `IntersectionObserver` to only mount when visible.

### 10. Profiling
- **r3f-perf**: in-app FPS, draw calls, triangle count, GPU/CPU split.
- **Chrome DevTools → Performance**: 30-second profile, look at `Frames` track.
- **Spector.js**: capture a single frame, inspect every WebGL command. Best for "why is this slow?" debugging.

```tsx
import { Perf } from 'r3f-perf'
<Canvas>
  <Perf position="top-left" />
  ...
</Canvas>
```

## Anti-patterns to avoid

- Loading uncompressed PNG textures larger than the screen — wastes everything
- Re-creating geometries/materials inside `useFrame` — leaks GPU memory
- `setState` inside `useFrame` — triggers React re-render every frame, kills perf. Use refs.
- One `<mesh>` per blade of grass — use instancing
- Shadow maps on every light
- 4K textures on a 200px-tall icon
- Unbounded particle systems

## Mobile Checklist

Before shipping to mobile traffic:
- [ ] Tested on real iPhone 12 / Pixel 6 — not just Chrome desktop devtools
- [ ] FPS ≥ 60 with thermal throttling (run app for 5 min)
- [ ] No shadow-casting lights (or only 1)
- [ ] Textures ≤ 1024² unless hero
- [ ] DPR capped at 2
- [ ] Single GLB ≤ 2 MB compressed
- [ ] Battery drain ≤ 1% per minute
- [ ] Works in landscape AND portrait
