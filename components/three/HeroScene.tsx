'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// ============================================================================
// Assembly Ring - Main 3D element
// A torus with inner rings that slowly rotates + responds to mouse/scroll
// ============================================================================

interface AssemblyRingProps {
  scrollProgress: number
  mousePosition: { x: number; y: number }
}

function AssemblyRing({ scrollProgress, mousePosition }: AssemblyRingProps) {
  const groupRef = useRef<THREE.Group>(null)
  const outerRef = useRef<THREE.Mesh>(null)
  const innerRingsRef = useRef<THREE.Group>(null)

  // Tweak: base rotation speeds (radians per second)
  const BASE_ROTATION_SPEED = 0.15
  const SCROLL_ROTATION_MULTIPLIER = 0.8 // Extra rotation when scrolling

  // Tweak: mouse parallax intensity
  const MOUSE_PARALLAX_X = 0.15
  const MOUSE_PARALLAX_Y = 0.1

  useFrame((state, delta) => {
    if (!groupRef.current) return

    // Base rotation + scroll-boosted rotation
    const rotationSpeed = BASE_ROTATION_SPEED + scrollProgress * SCROLL_ROTATION_MULTIPLIER
    groupRef.current.rotation.y += delta * rotationSpeed
    groupRef.current.rotation.x += delta * rotationSpeed * 0.3

    // Mouse parallax (smooth lerp)
    const targetX = mousePosition.y * MOUSE_PARALLAX_Y
    const targetY = mousePosition.x * MOUSE_PARALLAX_X
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.02
    groupRef.current.position.x += (targetY * 0.5 - groupRef.current.position.x) * 0.03

    // Inner rings counter-rotation for depth
    if (innerRingsRef.current) {
      innerRingsRef.current.rotation.z -= delta * 0.25
    }
  })

  // Create inner ring geometries
  const innerRings = useMemo(() => {
    return [
      { radius: 1.2, tube: 0.02, rotation: [0, 0, 0] },
      { radius: 1.0, tube: 0.015, rotation: [Math.PI / 4, 0, 0] },
      { radius: 0.8, tube: 0.012, rotation: [0, Math.PI / 3, Math.PI / 6] },
      { radius: 0.6, tube: 0.01, rotation: [Math.PI / 5, Math.PI / 4, 0] },
    ] as const
  }, [])

  // Accent color from design system (accent-400: #38bdf8)
  const accentColor = new THREE.Color('#38bdf8')
  const dimColor = new THREE.Color('#1e3a5f')

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer torus - main ring */}
      <mesh ref={outerRef}>
        <torusGeometry args={[1.8, 0.08, 32, 100]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Inner rings */}
      <group ref={innerRingsRef}>
        {innerRings.map((ring, i) => (
          <mesh
            key={i}
            rotation={ring.rotation as unknown as THREE.Euler}
          >
            <torusGeometry args={[ring.radius, ring.tube, 24, 80]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? accentColor : dimColor}
              emissive={i % 2 === 0 ? accentColor : dimColor}
              emissiveIntensity={0.2}
              metalness={0.8}
              roughness={0.3}
              transparent
              opacity={0.6 - i * 0.1}
            />
          </mesh>
        ))}
      </group>

      {/* Center glow sphere */}
      <mesh>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}

// ============================================================================
// Scene Setup - Lighting + Camera
// ============================================================================

function SceneSetup() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -5, 5]} intensity={0.5} color="#38bdf8" />
      <pointLight position={[5, -10, -5]} intensity={0.3} color="#627d98" />
    </>
  )
}

// ============================================================================
// Camera Controller - Adjust based on viewport
// ============================================================================

function CameraController() {
  const { camera, size } = useThree()

  useFrame(() => {
    // Adjust camera distance based on aspect ratio for responsive sizing
    const aspect = size.width / size.height
    const baseZ = 5
    const targetZ = aspect < 1 ? baseZ + 2 : baseZ // Pull back on portrait
    camera.position.z += (targetZ - camera.position.z) * 0.05
  })

  return null
}

// ============================================================================
// Main HeroScene Component
// ============================================================================

interface HeroSceneProps {
  scrollProgress?: number
  mousePosition?: { x: number; y: number }
  className?: string
}

export default function HeroScene({
  scrollProgress = 0,
  mousePosition = { x: 0, y: 0 },
  className,
}: HeroSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <SceneSetup />
        <CameraController />
        <Float
          speed={1.5}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <AssemblyRing
            scrollProgress={scrollProgress}
            mousePosition={mousePosition}
          />
        </Float>
      </Canvas>
    </div>
  )
}

