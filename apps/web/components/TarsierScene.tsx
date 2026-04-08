'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Tarsier built from the actual brand logo.
 *
 * Architecture:
 * 1. Main body = flat plane with adaptive-icon.png texture (rounded quad)
 *    - Slight 3D tilt responding to cursor → feels dimensional
 *    - Float animation → feels alive
 * 2. Eye pupils = two small dark spheres overlaid on eye positions
 *    - Spring-follow the cursor → the signature interaction
 *    - White highlight dots on each pupil for that "alive" look
 * 3. Depth layers = subtle shadow plane behind the body
 *    - Creates the illusion of the tarsier sitting "in" the scene
 * 4. Rim lighting = colored lights that paint edges
 *    - Makes the flat texture feel volumetric
 *
 * The blue background of the PNG matches the hero section blue,
 * so the tarsier appears to float naturally in the scene.
 * The logo shape is PIXEL-PERFECT because it IS the logo.
 */

// ─── Eye Pupil: follows cursor with spring physics ────────────────
function EyePupil({
  basePosition,
  size = 0.065,
}: {
  basePosition: [number, number, number];
  size?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const highlightRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;

    // Max pupil travel: ~0.04 units in each direction
    const targetX = pointer.x * 0.04;
    const targetY = pointer.y * 0.03;

    // Spring-lerp for smooth following
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      basePosition[0] + targetX,
      0.08,
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      basePosition[1] + targetY,
      0.08,
    );

    // Highlight follows pupil
    if (highlightRef.current) {
      highlightRef.current.position.x = meshRef.current.position.x + 0.02;
      highlightRef.current.position.y = meshRef.current.position.y + 0.02;
    }
  });

  return (
    <>
      {/* Pupil */}
      <mesh ref={meshRef} position={basePosition}>
        <circleGeometry args={[size, 32]} />
        <meshBasicMaterial color="#2D79BF" />
      </mesh>
      {/* Highlight dot */}
      <mesh ref={highlightRef} position={[basePosition[0] + 0.02, basePosition[1] + 0.02, basePosition[2] + 0.001]}>
        <circleGeometry args={[size * 0.35, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </>
  );
}

// ─── Main tarsier body: logo texture on a plane ────────────────
function TarsierBody() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const texture = useLoader(THREE.TextureLoader, '/icon-3d.png');

  // Make texture crisp
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame(() => {
    if (!groupRef.current) return;

    // Subtle 3D tilt responding to cursor — max ±8° rotation
    // This is what makes the flat texture feel three-dimensional
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.14,
      0.04,
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.08,
      0.04,
    );
  });

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.08}
      floatIntensity={0.3}
    >
      <group ref={groupRef}>
        {/* Shadow layer — slightly behind, slightly larger, blurred dark */}
        <mesh position={[0.02, -0.03, -0.05]}>
          <planeGeometry args={[1.15, 1.15]} />
          <meshBasicMaterial
            color="#1A3F6E"
            opacity={0.15}
            transparent
          />
        </mesh>

        {/* Main tarsier texture plane — transparent to blend with hero bg */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Eye pupils — positioned over the logo's eye centers */}
        {/* Left eye: slightly left of center, slightly above center */}
        <EyePupil basePosition={[-0.115, 0.085, 0.01]} size={0.05} />
        {/* Right eye */}
        <EyePupil basePosition={[0.105, 0.085, 0.01]} size={0.05} />

        {/* Subtle depth ring — creates a "popping out" effect */}
        <mesh position={[0, 0, -0.02]}>
          <ringGeometry args={[0.55, 0.62, 64]} />
          <meshBasicMaterial
            color="#FFFFFF"
            opacity={0.04}
            transparent
          />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Scene: lighting designed to make a flat texture feel 3D ─────
function Scene() {
  return (
    <>
      {/* Key light — warm white from top-right */}
      <directionalLight position={[3, 4, 5]} intensity={0.4} color="#FFFFFF" />
      {/* Fill light — cool blue from left */}
      <directionalLight position={[-4, 2, 3]} intensity={0.2} color="#93C5FD" />
      {/* Rim light — bright accent from behind to paint edges */}
      <pointLight position={[0, 0, -3]} intensity={0.3} color="#60A5FA" />
      {/* Ambient — ensures nothing is pure black */}
      <ambientLight intensity={0.6} />

      <TarsierBody />
    </>
  );
}

// ─── Exported component ──────────────────────────────────────────
export default function TarsierScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 1.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'default',
        }}
        style={{ background: 'transparent' }}
        resize={{ scroll: false }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
