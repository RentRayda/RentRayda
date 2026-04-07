'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function TarsierEye({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const pupilRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!pupilRef.current) return;
    pupilRef.current.position.x = THREE.MathUtils.lerp(pupilRef.current.position.x, pointer.x * 0.06 * scale, 0.1);
    pupilRef.current.position.y = THREE.MathUtils.lerp(pupilRef.current.position.y, pointer.y * 0.06 * scale, 0.1);
  });

  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#FFFEF5" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.32]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#D97706" roughness={0.4} />
      </mesh>
      <mesh ref={pupilRef} position={[0, 0, 0.4]}>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.1} />
      </mesh>
      <mesh position={[0.08, 0.08, 0.48]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

function TarsierEar({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <sphereGeometry args={[0.5, 24, 24]} />
      <meshStandardMaterial color="#1D4ED8" roughness={0.5} />
      <mesh scale={[0.7, 0.7, 0.5]} position={[0, 0, 0.15]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.6} />
      </mesh>
    </mesh>
  );
}

function TarsierHead() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.5, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.2, 0.04);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={groupRef}>
        {/* Head */}
        <mesh>
          <sphereGeometry args={[1.6, 48, 48]} />
          <meshStandardMaterial color="#1D4ED8" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Eyes */}
        <TarsierEye position={[-0.55, 0.2, 1.15]} scale={1.1} />
        <TarsierEye position={[0.55, 0.2, 1.15]} scale={1.1} />
        {/* Nose */}
        <mesh position={[0, -0.15, 1.5]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#0F3584" roughness={0.4} />
        </mesh>
        {/* Mouth */}
        <mesh position={[0, -0.4, 1.4]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.15, 0.03, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#0F3584" roughness={0.5} />
        </mesh>
        {/* Ears */}
        <TarsierEar position={[-1.5, 0.7, -0.2]} rotation={[0, -0.4, 0.3]} />
        <TarsierEar position={[1.5, 0.7, -0.2]} rotation={[0, 0.4, -0.3]} />
      </group>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, 2, 4]} intensity={0.4} color="#60A5FA" />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#93C5FD" />
      <TarsierHead />
    </>
  );
}

export default function TarsierScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
        style={{ background: 'transparent' }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
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
