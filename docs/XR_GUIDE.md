# XR Guide (WebXR / VR / AR)

VR and AR in the browser via WebXR + `@react-three/xr`. Works on Quest, Vision Pro, Android (ARCore), iPhone (Quick Look fallback).

## Install

```bash
pnpm add @react-three/xr
```

## VR Scene (20 lines)

```tsx
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore, VRButton, Controllers, Hands } from '@react-three/xr'

const store = createXRStore()

export function App() {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} />
          <Controllers />
          <Hands />
          <mesh position={[0, 1.5, -2]}>
            <boxGeometry />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        </XR>
      </Canvas>
    </>
  )
}
```

That's a complete VR scene. Open on Quest browser, hit "Enter VR", and you're in.

## AR (mobile camera passthrough)

```tsx
<button onClick={() => store.enterAR()}>Enter AR</button>
<XR store={store}>
  {/* Scene appears anchored in real world */}
  <mesh position={[0, 0, -1]}>...</mesh>
</XR>
```

Required: HTTPS (WebXR mandates secure context). For local dev, use `vite --https` or ngrok.

## Hit Testing (place objects on real surfaces)

```tsx
import { ARHitTest } from '@react-three/xr'

<ARHitTest onResults={(results, getWorldMatrix) => {
  if (results.length > 0) {
    // pose contains position+orientation of the detected surface
  }
}}>
  <mesh><boxGeometry args={[0.2, 0.2, 0.2]} /></mesh>
</ARHitTest>
```

## Controller Input

```tsx
import { useXRInputSourceState } from '@react-three/xr'

function Trigger() {
  const right = useXRInputSourceState('controller', 'right')
  useFrame(() => {
    if (right?.gamepad?.['xr-standard-trigger']?.button) {
      // trigger pressed
    }
  })
}
```

## Hand Tracking

```tsx
import { Hands, useXR } from '@react-three/xr'

<Hands /> // renders skeletal hands

// Get hand pose:
function PinchDetector() {
  const xr = useXR()
  useFrame(() => {
    const hand = xr.session?.inputSources[0]?.hand
    if (!hand) return
    const thumb = hand.get('thumb-tip')
    const index = hand.get('index-finger-tip')
    // distance between → pinch detection
  })
}
```

## Tips

- **Test on real device** — devtools emulation is limited
- **Comfortable scale**: room-scale ~3m × 3m, seated ~1m
- **Floor at y=0** — WebXR places origin at standing eye height by default; configure with `referenceSpaceType: 'local-floor'`
- **Frame budget is 11ms** at 90Hz — much tighter than 16.7ms web budget
- **Disable shadows** in XR — shadows on mobile XR (Quest) tank perf
- **iOS limitation**: iPhone WebXR is not supported; use Quick Look (USDZ) fallback for AR
- **Provide non-XR fallback**: `<NotInXR>` from `@react-three/xr` for desktop preview

## Quick Look Fallback (iOS AR)

iOS doesn't support WebXR but supports USDZ via Quick Look:

```html
<a rel="ar" href="/models/chair.usdz">
  <img src="/chair-preview.jpg" alt="View chair in AR">
</a>
```

Convert glTF → USDZ via `usd_from_gltf` (Apple) or `gltf-pipeline`. Single-file deliverable.

## Resources

- [WebXR sample showcase](https://immersive-web.github.io/webxr-samples/)
- [@react-three/xr docs](https://github.com/pmndrs/xr)
- [Quest browser dev tools](https://developer.oculus.com/documentation/web/browser-remote-debugging/)
