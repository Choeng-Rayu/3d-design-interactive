# Accessibility & SEO for 3D Web

3D content is **invisible** to screen readers and crawlers by default. This guide makes it discoverable and inclusive.

## Accessibility (WCAG 2.2)

### 1. Semantic Fallback Layer

Always render an HTML alternative. Even if visually hidden.

```tsx
<section aria-label="3D product viewer">
  <Canvas>...</Canvas>
  <div className="sr-only">
    <h2>Acme Chair, viewed in 3D</h2>
    <p>Material: oak wood. Color: walnut. Dimensions: 80cm x 60cm x 100cm.</p>
    <ul>
      <li>Use mouse drag or arrow keys to rotate</li>
      <li>Scroll or pinch to zoom</li>
      <li>Press Enter on a hotspot to view details</li>
    </ul>
  </div>
</section>
```

CSS for `sr-only`:
```css
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
```

### 2. `@react-three/a11y`

Wraps interactive meshes with focusable, screen-reader-announced regions. Adds keyboard navigation (Tab/Enter/Space).

```tsx
import { A11y, useA11y } from '@react-three/a11y'

function AccessibleHotspot() {
  const a11y = useA11y()
  return (
    <mesh scale={a11y.focus ? 1.2 : 1}>
      <sphereGeometry args={[0.2]} />
      <meshBasicMaterial color={a11y.focus ? '#0af' : '#888'} />
    </mesh>
  )
}

<Canvas>
  <A11y role="button" description="View product details" actionCall={() => openDetails()}>
    <AccessibleHotspot />
  </A11y>
</Canvas>
```

Checklist:
- Every clickable mesh wrapped in `<A11y>`
- `role` set ("button", "link", "image")
- `description` is descriptive (not "click here")
- Keyboard activates `actionCall`
- Focus ring is visually distinct (size, color, outline)

### 3. Reduced Motion

Many users have vestibular disorders. Auto-rotation, parallax, particle effects can trigger discomfort.

```tsx
import { useReducedMotion } from 'framer-motion'  // or custom hook

function Scene() {
  const reduce = useReducedMotion()
  return (
    <>
      <OrbitControls autoRotate={!reduce} />
      {!reduce && <ParticleField />}
    </>
  )
}
```

Custom hook:
```ts
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduce(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduce
}
```

### 4. Keyboard Navigation

`OrbitControls` doesn't include keyboard out of the box. Add it:

```tsx
const orbitRef = useRef<OrbitControlsImpl>(null!)
useEffect(() => {
  const handle = (e: KeyboardEvent) => {
    if (!orbitRef.current) return
    const speed = 0.1
    if (e.key === 'ArrowLeft') orbitRef.current.rotate(-speed, 0)
    if (e.key === 'ArrowRight') orbitRef.current.rotate(speed, 0)
    if (e.key === 'ArrowUp') orbitRef.current.rotate(0, -speed)
    if (e.key === 'ArrowDown') orbitRef.current.rotate(0, speed)
  }
  window.addEventListener('keydown', handle)
  return () => window.removeEventListener('keydown', handle)
}, [])
<OrbitControls ref={orbitRef} />
```

### 5. Color Contrast

UI overlays (HTML on top of canvas) must meet WCAG 2.2 AA contrast (4.5:1 for text). Don't rely on the canvas — it changes color as the camera moves.

Always render overlays with their own opaque background:
```tsx
<Html>
  <div style={{ background: 'rgba(0,0,0,0.85)', color: 'white', padding: 8 }}>
    {label}
  </div>
</Html>
```

### 6. Reduced GPU / Battery

Pause rendering when offscreen:

```tsx
import { useFrame, useThree, advance } from '@react-three/fiber'

<Canvas frameloop={isVisible ? 'always' : 'never'}>
```

Use `IntersectionObserver` to set `isVisible`. Saves significant battery on long pages.

---

## SEO

### 1. Server-Side Pre-Render

Crawlers don't execute WebGL. Ship a **representative still image** as the LCP element.

In Next.js App Router:
```tsx
// app/page.tsx
export const metadata = {
  title: 'Acme Chair — 3D Viewer',
  description: 'Inspect the Acme Chair from every angle in our interactive 3D viewer.',
  openGraph: {
    images: ['/og/acme-chair-3d-preview.jpg'],  // pre-rendered hero image
  },
}

export default function Page() {
  return (
    <>
      <h1>Acme Chair</h1>  {/* SEO-critical text */}
      <p className="product-description">{/* full text */}</p>
      <Canvas3DViewer />   {/* loaded client-side */}
    </>
  )
}
```

### 2. Structured Data (JSON-LD)

For products especially. Google indexes this and shows rich results.

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Acme Chair',
  image: 'https://cdn.example.com/og/acme-chair.jpg',
  description: 'Oak wood chair with walnut finish.',
  brand: { '@type': 'Brand', name: 'Acme' },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: '299.00',
    availability: 'https://schema.org/InStock',
  },
}) }} />
```

For 3D-specific: schema.org has `3DModel` and `Product.model3d` properties (limited adoption but valid).

### 3. Image Sitemap

Pre-rendered 3D viewpoints in your sitemap help Google Image Search:
```xml
<image:image>
  <image:loc>https://example.com/og/acme-chair-front.jpg</image:loc>
  <image:caption>Acme Chair, front view</image:caption>
</image:image>
```

### 4. Page-Speed Trade-Offs

3D scenes are heavy. Don't sacrifice LCP for impressive WebGL.

- LCP element should be **HTML/img**, not the canvas
- Lazy-load canvas after LCP fires (defer 1-2 seconds)
- Show a static fallback image during canvas load

```tsx
const [showCanvas, setShowCanvas] = useState(false)
useEffect(() => {
  const handle = setTimeout(() => setShowCanvas(true), 1000)
  return () => clearTimeout(handle)
}, [])

return showCanvas ? <Canvas>...</Canvas> : <img src="/hero-static.jpg" alt="..." />
```

### 5. Crawler Detection (Optional)

Serve fully static page to bots, interactive to humans:

```ts
const isBot = /bot|crawl|spider/i.test(userAgent)
return isBot ? <StaticPage /> : <InteractivePage />
```

Prefer pre-rendering for everyone — bot detection drifts and hurts perceived perf.

---

## Testing Checklist

- [ ] Screen reader (VoiceOver / NVDA) announces 3D scene description
- [ ] Tab key cycles through interactive 3D elements
- [ ] Enter/Space activates focused element
- [ ] `prefers-reduced-motion` disables auto-animation
- [ ] Page works with WebGL disabled (fallback rendered)
- [ ] Lighthouse SEO score ≥ 95
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] OG image previews correctly on Twitter/Slack/iMessage
- [ ] Google Rich Results Test passes
- [ ] No layout shift when canvas mounts (reserve space)
