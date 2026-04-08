'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Tarsier Logo — actual brand logo as a 3D-feeling element.
 *
 * NOT a sphere monster. Uses the real logo PNG with:
 * - Subtle 3D tilt on cursor movement (parallax depth)
 * - Soft glow ring behind it
 * - Floating particle dust
 * - Gentle bob animation
 *
 * The logo is the logo. We don't try to "3D model" it.
 */

function LogoPlane() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const texture = useLoader(THREE.TextureLoader, '/icon-3d.png');

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // Subtle parallax tilt — max ±6°
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y, pointer.x * 0.1, 0.03
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, -pointer.y * 0.06, 0.03
    );

    // Glow pulse
    if (glowRef.current) {
      const pulse = 0.92 + Math.sin(clock.getElapsedTime() * 1.5) * 0.08;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.03} floatIntensity={0.15}>
      <group ref={groupRef}>
        {/* Glow ring behind logo */}
        <mesh ref={glowRef} position={[0, 0, -0.08]}>
          <circleGeometry args={[0.72, 64]} />
          <meshBasicMaterial color="#2D79BF" opacity={0.08} transparent />
        </mesh>

        {/* Outer soft glow */}
        <mesh position={[0, 0, -0.12]}>
          <circleGeometry args={[0.9, 64]} />
          <meshBasicMaterial color="#2D79BF" opacity={0.04} transparent />
        </mesh>

        {/* Logo texture — the actual brand asset */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial map={texture} transparent opacity={0.95} />
        </mesh>

        {/* Subtle shadow beneath */}
        <mesh position={[0.02, -0.04, -0.06]}>
          <circleGeometry args={[0.5, 48]} />
          <meshBasicMaterial color="#1A3F6E" opacity={0.1} transparent />
        </mesh>
      </group>
    </Float>
  );
}

/* Dust particles — subtle sparkle effect */
function DustParticles({ count = 30 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  // Deterministic positions (no hydration issue)
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const seed = i * 127.1 + 311.7;
    const x = (Math.sin(seed) * 43758.5453 % 1) * 3 - 1.5;
    const y = (Math.sin(seed * 1.3) * 43758.5453 % 1) * 3 - 1.5;
    const z = (Math.sin(seed * 0.7) * 43758.5453 % 1) * 1.5 - 0.75;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color="#FFFFFF" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 3, 4]} intensity={0.3} color="#FFFFFF" />
      <pointLight position={[0, 0, 2]} intensity={0.2} color="#2D79BF" />
      <LogoPlane />
      <DustParticles />
    </>
  );
}

export default function TarsierScene() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-[1]">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 40 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
        style={{ background: 'transparent' }}
        resize={{ scroll: false }}
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
