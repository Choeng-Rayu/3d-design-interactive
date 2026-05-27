import { Canvas } from '@react-three/fiber'
import {
  XR,
  createXRStore,
  XROrigin,
  PointerEvents,
} from '@react-three/xr'
import { useState } from 'react'
import { Environment } from '@react-three/drei'

/**
 * XR Room Template
 *
 * A WebXR-ready room you can enter in VR (Quest, Vision Pro) or AR (Android).
 * Features:
 *   - Enter VR / Enter AR buttons
 *   - Hand-tracked + controller pointer events
 *   - Interactive cubes that respond to grab/select
 *   - Standing reference space (floor at y=0)
 *
 * Required: HTTPS (WebXR mandates secure context).
 *   Local dev: vite --https  or  ngrok http 5173
 */

const store = createXRStore({
  hand: { rayPointer: true, grabPointer: true },
  controller: { rayPointer: true },
})

function GrabbableCube({ position, color }: { position: [number, number, number]; color: string }) {
  const [grabbed, setGrabbed] = useState(false)
  return (
    <mesh
      position={position}
      scale={grabbed ? 1.2 : 1}
      onPointerDown={() => setGrabbed(true)}
      onPointerUp={() => setGrabbed(false)}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color={grabbed ? '#ffffff' : color} />
    </mesh>
  )
}

function Room() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 1]} intensity={1} />
      <Environment preset="apartment" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Interactive cubes at hand height */}
      <GrabbableCube position={[-0.4, 1.2, -0.6]} color="#ff5577" />
      <GrabbableCube position={[0, 1.2, -0.6]} color="#3388ff" />
      <GrabbableCube position={[0.4, 1.2, -0.6]} color="#22cc88" />
    </>
  )
}

export function XRRoom() {
  return (
    <>
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, display: 'flex', gap: 8 }}>
        <button onClick={() => store.enterVR()} style={btn}>Enter VR</button>
        <button onClick={() => store.enterAR()} style={btn}>Enter AR</button>
      </div>

      <Canvas camera={{ position: [0, 1.6, 1] }} shadows>
        <PointerEvents />
        <XR store={store}>
          <XROrigin position={[0, 0, 0]} />
          <Room />
        </XR>
      </Canvas>
    </>
  )
}

const btn: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: 14,
  background: 'white',
  color: '#0a0a0a',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600,
}
