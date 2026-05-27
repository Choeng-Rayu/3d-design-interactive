# Interaction Patterns

Five archetypes covering 95% of 3D web interactivity. Copy-paste ready.

## 1. Orbit / Inspect (Product Viewer)

Most common. Camera rotates around a target, user drags to look, scrolls to zoom.

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'

<Canvas camera={{ position: [3, 2, 3], fov: 35 }} dpr={[1, 2]}>
  <ambientLight intensity={0.4} />
  <directionalLight position={[5, 5, 5]} intensity={1} />
  <Product />
  <ContactShadows position={[0, -1, 0]} opacity={0.4} blur={2} />
  <Environment preset="studio" />
  <OrbitControls
    enableDamping
    dampingFactor={0.08}
    minDistance={2}
    maxDistance={8}
    minPolarAngle={Math.PI / 6}        // limit looking up
    maxPolarAngle={Math.PI - Math.PI / 6} // limit looking down
    autoRotate={!userInteracted}        // gentle spin until user touches
    autoRotateSpeed={0.5}
  />
</Canvas>
```

**UX tips**:
- Always `enableDamping` for smooth feel
- Constrain polar angle so the user can't see the bottom of the model
- Auto-rotate slowly until first interaction, then stop
- Show subtle drag hint icon for first 3 seconds

## 2. Click / Hover via Raycasting

R3F gives you DOM-like pointer events on any mesh. Under the hood it's raycasting.

```tsx
function Hotspot({ position, label }: { position: [number, number, number]; label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <group position={position}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
        onClick={(e) => { e.stopPropagation(); console.log('clicked', label) }}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color={hovered ? '#fff' : '#88f'} />
      </mesh>
      {hovered && (
        <Html distanceFactor={8} position={[0, 0.2, 0]}>
          <div className="hotspot-tooltip">{label}</div>
        </Html>
      )}
    </group>
  )
}
```

**Critical**:
- Always `e.stopPropagation()` — events bubble through every overlapping mesh
- Set cursor in pointer handlers, not in CSS — Canvas swallows hover state
- Use `<Html>` from drei for DOM overlays anchored to 3D positions

## 3. Drag (Direct Manipulation)

Move an object with the pointer. Combine `@use-gesture/react` with `useThree().raycaster` to project pointer into world coords.

```tsx
import { useDrag } from '@use-gesture/react'
import { useThree } from '@react-three/fiber'
import { Plane, Vector3 } from 'three'

function Draggable({ children }) {
  const { camera, raycaster, pointer } = useThree()
  const [pos, setPos] = useState<[number, number, number]>([0, 0, 0])

  const bind = useDrag(({ offset: [, ], event }) => {
    event.stopPropagation()
    raycaster.setFromCamera(pointer, camera)
    const dragPlane = new Plane(new Vector3(0, 1, 0), 0)
    const intersect = new Vector3()
    raycaster.ray.intersectPlane(dragPlane, intersect)
    setPos([intersect.x, 0, intersect.z])
  })

  return <group position={pos} {...(bind() as any)}>{children}</group>
}
```

For dragging on the ground plane (most common). For dragging in screen space, use `unproject()` instead.

## 4. Scroll-Driven Animation

Scrollytelling — the camera flies through the scene as the user scrolls the page.

```tsx
import { ScrollControls, useScroll, Scroll } from '@react-three/drei'

<Canvas>
  <ScrollControls pages={4} damping={0.2}>
    <Scene />
    <Scroll html>
      {/* Regular HTML overlays — scrolls in sync */}
      <h1 style={{ position: 'absolute', top: '0vh' }}>Chapter 1</h1>
      <h1 style={{ position: 'absolute', top: '100vh' }}>Chapter 2</h1>
    </Scroll>
  </ScrollControls>
</Canvas>

function Scene() {
  const scroll = useScroll()
  const ref = useRef<Group>(null!)
  useFrame(() => {
    // scroll.offset is 0..1 across all pages
    ref.current.rotation.y = scroll.offset * Math.PI * 2
    ref.current.position.z = scroll.range(0, 1 / 4) * -10
  })
  return <group ref={ref}>{/* meshes */}</group>
}
```

For complex camera paths use **Theatre.js** or **GSAP ScrollTrigger** + `useFrame`.

## 5. Physics

Real-world feel: gravity, collisions, hinges, springs. Use `@react-three/rapier` (Rust-WASM, very fast).

```tsx
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier'

<Physics gravity={[0, -9.81, 0]} debug={false}>
  {/* Falling balls */}
  {Array.from({ length: 20 }).map((_, i) => (
    <RigidBody key={i} colliders="ball" position={[Math.random() * 4 - 2, 5 + i, 0]} restitution={0.7}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </RigidBody>
  ))}

  {/* Ground */}
  <RigidBody type="fixed">
    <CuboidCollider args={[10, 0.5, 10]} position={[0, -0.5, 0]} />
    <mesh position={[0, -0.5, 0]} receiveShadow>
      <boxGeometry args={[20, 1, 20]} />
      <meshStandardMaterial color="#444" />
    </mesh>
  </RigidBody>
</Physics>
```

**Physics tips**:
- Use `colliders="ball" | "hull" | "trimesh" | "cuboid"` — auto-generates from mesh
- `trimesh` is most accurate but slowest. Use `hull` for dynamic bodies.
- Enable `debug` while authoring to see collider wireframes
- For huge counts (>500 objects), consider `<InstancedRigidBodies>` for batched simulation

---

## Combining Patterns

Real apps mix archetypes. Example: **product configurator** uses orbit + click-to-swap-material + drag-to-customize-position + scroll-to-reveal-details. Compose freely — R3F's React model means each interaction is a hook or component you can drop in independently.
