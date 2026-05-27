# Recipes

Copy-paste solutions for the 10 most common 3D web tasks.

---

## 1. Product Configurator (Color/Material/Parts Swap)

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { useState } from 'react'
import { Color } from 'three'

const COLORS = ['#ff5577', '#3388ff', '#22cc88', '#222222']

function Chair({ bodyColor }: { bodyColor: string }) {
  const { nodes, materials } = useGLTF('/models/chair.glb') as any
  // Mutate the material color directly — fast, no re-render
  if (materials.body) materials.body.color = new Color(bodyColor)
  return <primitive object={nodes.Scene} />
}

export function Configurator() {
  const [color, setColor] = useState(COLORS[0])
  return (
    <div className="grid grid-cols-[1fr_300px]">
      <Canvas camera={{ position: [3, 2, 4] }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Chair bodyColor={color} />
        <ContactShadows position={[0, -0.8, 0]} opacity={0.5} blur={2} />
        <Environment preset="studio" />
        <OrbitControls enableDamping />
      </Canvas>
      <aside>
        <h3>Color</h3>
        {COLORS.map((c) => (
          <button key={c} onClick={() => setColor(c)} style={{ background: c }} />
        ))}
      </aside>
    </div>
  )
}
```

---

## 2. Scrollytelling Hero

```tsx
import { ScrollControls, useScroll, Scroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function CameraRig() {
  const scroll = useScroll()
  useFrame((state) => {
    const t = scroll.offset
    state.camera.position.set(
      Math.sin(t * Math.PI * 2) * 5,
      2 + t * 3,
      Math.cos(t * Math.PI * 2) * 5
    )
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

<Canvas>
  <ScrollControls pages={3} damping={0.25}>
    <CameraRig />
    <Scene />
    <Scroll html style={{ width: '100%' }}>
      <h1 style={{ position: 'absolute', top: '20vh' }}>Welcome</h1>
      <h1 style={{ position: 'absolute', top: '120vh' }}>Discover</h1>
      <h1 style={{ position: 'absolute', top: '220vh' }}>Buy now</h1>
    </Scroll>
  </ScrollControls>
</Canvas>
```

---

## 3. Virtual Tour with Hotspots

```tsx
import { Html, OrbitControls, Environment } from '@react-three/drei'

const ROOMS = [
  { id: 'living', position: [0, 1.5, 0], hdri: '/hdri/living.hdr' },
  { id: 'kitchen', position: [4, 1.5, 0], hdri: '/hdri/kitchen.hdr' },
]

function Hotspot({ targetRoom, position, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <ringGeometry args={[0.2, 0.3, 32]} />
      <meshBasicMaterial color={hovered ? '#fff' : '#888'} transparent opacity={0.8} />
    </mesh>
  )
}

export function VirtualTour() {
  const [currentRoom, setCurrentRoom] = useState(ROOMS[0])
  return (
    <Canvas camera={{ position: currentRoom.position }}>
      <Environment files={currentRoom.hdri} background />
      {currentRoom.id === 'living' && (
        <Hotspot targetRoom="kitchen" position={[3, 1.5, 0]} onClick={() => setCurrentRoom(ROOMS[1])} />
      )}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
```

---

## 4. 3D Map with Markers + Camera Fly-To

```tsx
import { gsap } from 'gsap'
import { useThree } from '@react-three/fiber'

function FlyToCamera({ target }: { target: [number, number, number] }) {
  const { camera } = useThree()
  useEffect(() => {
    gsap.to(camera.position, {
      x: target[0], y: target[1] + 2, z: target[2] + 3,
      duration: 1.2, ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(target[0], target[1], target[2]),
    })
  }, [target])
  return null
}
```

---

## 5. Hover Tooltips with `<Html>`

```tsx
import { Html } from '@react-three/drei'

<mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
  <boxGeometry />
  <meshStandardMaterial />
  {hovered && (
    <Html distanceFactor={6} position={[0, 1, 0]} style={{ pointerEvents: 'none' }}>
      <div className="tooltip">Hover info</div>
    </Html>
  )}
</mesh>
```

---

## 6. Reflective Floor + Contact Shadows

```tsx
import { MeshReflectorMaterial, ContactShadows } from '@react-three/drei'

<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
  <planeGeometry args={[20, 20]} />
  <MeshReflectorMaterial
    blur={[300, 100]}
    resolution={1024}
    mixBlur={1}
    mixStrength={50}
    roughness={1}
    depthScale={1.2}
    minDepthThreshold={0.4}
    color="#101010"
    metalness={0.5}
  />
</mesh>
<ContactShadows position={[0, -0.49, 0]} opacity={0.4} blur={2} />
```

---

## 7. Particle System (Fireflies)

```tsx
import { useRef } from 'react'
import { Points, PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

function Fireflies({ count = 100 }) {
  const ref = useRef<any>(null!)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10
      arr[i * 3 + 1] = Math.random() * 5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.05
  })

  return (
    <Points ref={ref} positions={positions}>
      <PointMaterial size={0.05} color="#ffaa00" transparent />
    </Points>
  )
}
```

---

## 8. Custom Shader Material (Hologram)

```tsx
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'

const HologramMaterial = shaderMaterial(
  { uTime: 0, uColor: new Color('#00ffff') },
  // vertex
  /* glsl */ `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  // fragment
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec3 vPos;
    void main() {
      float scan = sin(vPos.y * 30.0 + uTime * 5.0) * 0.5 + 0.5;
      gl_FragColor = vec4(uColor * scan, 0.9);
    }`
)
extend({ HologramMaterial })

function Hologram() {
  const ref = useRef<any>(null!)
  useFrame((s) => { ref.current.uTime = s.clock.elapsedTime })
  return (
    <mesh>
      <icosahedronGeometry args={[1, 2]} />
      {/* @ts-ignore */}
      <hologramMaterial ref={ref} transparent />
    </mesh>
  )
}
```

---

## 9. Animated Character (Idle / Walk Blend)

```tsx
import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef } from 'react'

function Character({ state }: { state: 'idle' | 'walk' | 'run' }) {
  const group = useRef<any>(null!)
  const { scene, animations } = useGLTF('/models/character.glb')
  const { actions, mixer } = useAnimations(animations, group)

  useEffect(() => {
    Object.values(actions).forEach((a) => a?.fadeOut(0.3))
    actions[state]?.reset().fadeIn(0.3).play()
  }, [state])

  return <group ref={group}><primitive object={scene} /></group>
}
```

---

## 10. Web AR (Place Model in Real World)

iOS uses Quick Look (USDZ), Android uses WebXR/Scene Viewer.

```tsx
function ARLink({ usdz, glb }: { usdz: string; glb: string }) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const href = isIOS
    ? usdz
    : `intent://arvr.google.com/scene-viewer/1.0?file=${glb}#Intent;scheme=https;package=com.google.ar.core;end;`
  return (
    <a rel="ar" href={href}>
      <img src="/preview.jpg" alt="View in AR" />
    </a>
  )
}
```

For full WebXR AR (interactive, in-browser), see `XR_GUIDE.md`.
