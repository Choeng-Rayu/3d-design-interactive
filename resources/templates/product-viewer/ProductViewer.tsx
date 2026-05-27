import { Canvas, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
  Html,
  PerformanceMonitor,
} from '@react-three/drei'
import { A11y } from '@react-three/a11y'
import { useRef, useState, useEffect } from 'react'
import type { Mesh, Group } from 'three'
import { Color } from 'three'

/**
 * Product Viewer Template
 *
 * Features:
 *  - Orbit controls with damping + auto-rotate-until-interaction
 *  - Click hotspots with HTML tooltips
 *  - Color/material swap
 *  - Adaptive DPR (PerformanceMonitor)
 *  - Accessibility wrapper (@react-three/a11y)
 *  - Reduced-motion respect
 *  - Contact shadows + studio HDRI
 *
 * Drop a .glb at /public/models/product.glb to use it.
 */

const COLORS = ['#cc4444', '#3388ff', '#22cc88', '#222222'] as const

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

function Product({ bodyColor }: { bodyColor: string }) {
  const { scene, materials } = useGLTF('/models/product.glb') as any
  if (materials.body) {
    materials.body.color = new Color(bodyColor)
  }
  return <primitive object={scene} />
}

function Hotspot({ position, label }: { position: [number, number, number]; label: string }) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  return (
    <group position={position}>
      <A11y role="button" description={`Show details about ${label}`} actionCall={() => setOpen((o) => !o)}>
        <mesh
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
          onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        >
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshBasicMaterial color={hovered || open ? '#ffffff' : '#88aaff'} />
        </mesh>
      </A11y>
      {open && (
        <Html distanceFactor={8} position={[0.2, 0.2, 0]} style={{ pointerEvents: 'none' }}>
          <div className="hotspot-tooltip" style={{
            background: 'rgba(0,0,0,0.85)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 6,
            fontSize: 13,
            whiteSpace: 'nowrap',
          }}>{label}</div>
        </Html>
      )}
    </group>
  )
}

function Scene({ color }: { color: string }) {
  const ref = useRef<Group>(null!)
  const reduce = usePrefersReducedMotion()
  const [interacted, setInteracted] = useState(false)

  useFrame((_, delta) => {
    if (!reduce && !interacted && ref.current) {
      ref.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group ref={ref} onPointerDown={() => setInteracted(true)}>
      <Product bodyColor={color} />
      <Hotspot position={[0.4, 0.6, 0.2]} label="Premium oak finish" />
      <Hotspot position={[-0.3, 0.2, 0.3]} label="Cushioned seat" />
    </group>
  )
}

export function ProductViewer() {
  const [color, setColor] = useState<string>(COLORS[0])
  const [dpr, setDpr] = useState(1.5)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', height: '100vh' }}>
      <div className="canvas-wrap">
        <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)}>
          <Canvas camera={{ position: [3, 2, 3], fov: 35 }} dpr={dpr} shadows>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
            <Scene color={color} />
            <ContactShadows position={[0, -0.5, 0]} opacity={0.4} blur={2.5} far={4} />
            <Environment preset="studio" />
            <OrbitControls
              enableDamping
              dampingFactor={0.08}
              minDistance={2}
              maxDistance={8}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI - Math.PI / 6}
            />
          </Canvas>
        </PerformanceMonitor>
      </div>

      <aside style={{ padding: 24, background: '#0a0a0a', color: 'white', overflowY: 'auto' }}>
        <h2 style={{ marginTop: 0 }}>Customize</h2>
        <h3 style={{ fontSize: 14, opacity: 0.7 }}>Color</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          {COLORS.map((c) => (
            <button
              key={c}
              aria-label={`Color ${c}`}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: c,
                border: color === c ? '2px solid white' : '2px solid transparent',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* SEO/a11y hidden description */}
        <div className="sr-only" style={{ position: 'absolute', clip: 'rect(0,0,0,0)' }}>
          <h2>Product 3D viewer</h2>
          <p>Use mouse drag or arrow keys to rotate. Tab to focus hotspots, Enter to view details.</p>
        </div>
      </aside>
    </div>
  )
}

useGLTF.preload('/models/product.glb')
