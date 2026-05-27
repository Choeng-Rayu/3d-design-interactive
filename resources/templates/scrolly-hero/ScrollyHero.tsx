import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, useScroll, Scroll, Environment } from '@react-three/drei'
import { useRef } from 'react'
import type { Group } from 'three'
import { MathUtils } from 'three'

/**
 * Scrollytelling Hero Template
 *
 * The camera flies through a 3-page narrative driven by page scroll.
 * HTML overlays scroll in sync via <Scroll html>.
 *
 * Pages:
 *   0.0 → 0.33  Intro: object enters from below
 *   0.33 → 0.66 Detail: camera circles around
 *   0.66 → 1.0  Outro: pulls back, CTA appears
 */

function HeroObject() {
  const ref = useRef<Group>(null!)
  const scroll = useScroll()

  useFrame((state, delta) => {
    const t = scroll.offset

    // Object lifts and rotates as user scrolls
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, t * 2 - 1, 0.1)
    ref.current.rotation.y += delta * 0.3 + scroll.delta * 5

    // Camera path: orbit around at midpoint, pull back at end
    const camRadius = MathUtils.lerp(4, 8, scroll.range(0.66, 0.34))
    const camAngle = scroll.range(0.33, 0.33) * Math.PI * 2
    state.camera.position.x = Math.sin(camAngle) * camRadius
    state.camera.position.z = Math.cos(camAngle) * camRadius
    state.camera.position.y = 1 + scroll.offset * 1.5
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={ref}>
      <mesh castShadow>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#ff5577" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  )
}

export function ScrollyHero() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 1, 5], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Environment preset="sunset" />

        <ScrollControls pages={3} damping={0.25}>
          <HeroObject />

          <Scroll html style={{ width: '100%', color: 'white', textAlign: 'center' }}>
            <section style={{ position: 'absolute', top: '40vh', width: '100%' }}>
              <h1 style={{ fontSize: 'clamp(2rem, 7vw, 5rem)', margin: 0 }}>Welcome</h1>
              <p>Scroll to begin the journey</p>
            </section>

            <section style={{ position: 'absolute', top: '140vh', width: '100%' }}>
              <h1 style={{ fontSize: 'clamp(2rem, 7vw, 5rem)', margin: 0 }}>Discover</h1>
              <p>Explore from every angle</p>
            </section>

            <section style={{ position: 'absolute', top: '240vh', width: '100%' }}>
              <h1 style={{ fontSize: 'clamp(2rem, 7vw, 5rem)', margin: 0 }}>Ready?</h1>
              <button style={{
                marginTop: 20, padding: '12px 32px', fontSize: 18,
                border: 'none', borderRadius: 999, cursor: 'pointer',
                background: 'white', color: '#0a0a0a',
              }}>
                Get started →
              </button>
            </section>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  )
}
