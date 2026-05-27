#!/usr/bin/env bash
# scaffold-r3f.sh — one-command React Three Fiber project scaffold
# Usage: ./scaffold-r3f.sh my-3d-app

set -euo pipefail

NAME="${1:?usage: $0 <project-name>}"

if [ -e "$NAME" ]; then
  echo "Directory $NAME already exists. Aborting." >&2
  exit 1
fi

echo "→ Creating Vite + React + TS project: $NAME"
pnpm create vite@latest "$NAME" -- --template react-ts
cd "$NAME"

echo "→ Installing R3F + drei + helpers"
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three r3f-perf

echo "→ Optional packages (uncomment in scaffold-r3f.sh if needed):"
echo "    pnpm add @react-three/rapier   # physics"
echo "    pnpm add @react-three/xr       # VR/AR"
echo "    pnpm add @react-three/postprocessing # bloom/DOF"
echo "    pnpm add @react-three/a11y     # accessibility"
echo "    pnpm add gsap @use-gesture/react # animation/gestures"

echo "→ Copying starter Scene component"
mkdir -p src/components
cat > src/components/Scene.tsx <<'TSX'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useRef, useState } from 'react'
import type { Mesh } from 'three'

function InteractiveBox() {
  const ref = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  useFrame((_, delta) => { ref.current.rotation.y += delta * 0.5 })

  return (
    <mesh
      ref={ref}
      scale={active ? 1.4 : 1}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
      onPointerOut={() => setHovered(false)}
      onClick={() => setActive((v) => !v)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#ff5577' : '#3388ff'} />
    </mesh>
  )
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [3, 2, 3], fov: 35 }} dpr={[1, 2]} shadows>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <InteractiveBox />
      <ContactShadows position={[0, -0.5, 0]} opacity={0.4} blur={2} />
      <Environment preset="city" />
      <OrbitControls enableDamping minDistance={2} maxDistance={10} />
    </Canvas>
  )
}
TSX

cat > src/App.tsx <<'TSX'
import Scene from './components/Scene'
import './App.css'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Scene />
    </div>
  )
}
TSX

# Reset CSS so canvas can fill viewport
cat > src/index.css <<'CSS'
*, *::before, *::after { box-sizing: border-box; }
html, body, #root { margin: 0; padding: 0; height: 100%; overflow: hidden; }
body { font-family: system-ui, sans-serif; background: #0a0a0a; color: #fff; }
CSS

echo
echo "✓ Done. Next:"
echo "    cd $NAME"
echo "    pnpm dev"
