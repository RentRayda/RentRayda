'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Tarsier-inspired organic blob that follows mouse
function TarsierBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    // Smooth follow mouse
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.y * 0.3,
      0.05
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      pointer.x * 0.4,
      0.05
    );
    // Gentle breathing scale
    const t = state.clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 0.8) * 0.03;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <Sphere args={[1.8, 128, 128]}>
          <MeshDistortMaterial
            color="#2563EB"
            roughness={0.15}
            metalness={0.8}
            distort={0.35}
            speed={1.5}
            envMapIntensity={1.2}
          />
        </Sphere>
      </mesh>
    </Float>
  );
}

// Large tarsier eye - the signature feature
function TarsierEye({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const eyeRef = useRef<THREE.Group>(null);
  const pupilRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!pupilRef.current) return;
    // Pupil follows mouse
    pupilRef.current.position.x = pointer.x * 0.06 * scale;
    pupilRef.current.position.y = pointer.y * 0.06 * scale;
  });

  return (
    <group ref={eyeRef} position={position} scale={scale}>
      {/* Eye white */}
      <mesh>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial color="#FFFEF5" roughness={0.1} metalness={0.05} />
      </mesh>
      {/* Iris */}
      <mesh position={[0, 0, 0.32]}>
        <sphereGeometry args={[0.28, 64, 64]} />
        <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Pupil - follows mouse */}
      <mesh ref={pupilRef} position={[0, 0, 0.4]}>
        <sphereGeometry args={[0.18, 64, 64]} />
        <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.1} />
      </mesh>
      {/* Eye shine */}
      <mesh position={[0.08, 0.08, 0.48]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Tarsier ears
function TarsierEar({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#1D4ED8" roughness={0.4} metalness={0.3} />
      <mesh scale={[0.7, 0.7, 0.5]} position={[0, 0, 0.15]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#3B82F6" roughness={0.5} metalness={0.2} />
      </mesh>
    </mesh>
  );
}

// Full tarsier head composition
function TarsierHead() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.5,
      0.04
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.2,
      0.04
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={groupRef}>
        {/* Head body */}
        <mesh>
          <sphereGeometry args={[1.6, 128, 128]} />
          <MeshDistortMaterial
            color="#1D4ED8"
            roughness={0.25}
            metalness={0.6}
            distort={0.15}
            speed={1.2}
          />
        </mesh>

        {/* Eyes - large, signature tarsier */}
        <TarsierEye position={[-0.55, 0.2, 1.15]} scale={1.1} />
        <TarsierEye position={[0.55, 0.2, 1.15]} scale={1.1} />

        {/* Nose */}
        <mesh position={[0, -0.15, 1.5]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#0F3584" roughness={0.3} />
        </mesh>

        {/* Mouth - subtle smile */}
        <mesh position={[0, -0.4, 1.4]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#0F3584" roughness={0.4} />
        </mesh>

        {/* Ears - large rounded */}
        <TarsierEar position={[-1.5, 0.7, -0.2]} rotation={[0, -0.4, 0.3]} />
        <TarsierEar position={[1.5, 0.7, -0.2]} rotation={[0, 0.4, -0.3]} />
      </group>
    </Float>
  );
}

// Floating particles around the tarsier
function Particles() {
  const count = 50;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#60A5FA"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function TarsierScene() {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 0,
      pointerEvents: 'auto',
    }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#FFFFFF" />
        <directionalLight position={[-3, 2, 4]} intensity={0.5} color="#60A5FA" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#93C5FD" />

        <TarsierHead />
        <Particles />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
