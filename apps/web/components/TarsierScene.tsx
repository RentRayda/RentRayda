'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function TarsierEye({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const pupilRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!pupilRef.current) return;
    pupilRef.current.position.x = pointer.x * 0.06 * scale;
    pupilRef.current.position.y = pointer.y * 0.06 * scale;
  });

  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial color="#FFFEF5" roughness={0.1} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, 0.32]}>
        <sphereGeometry args={[0.28, 64, 64]} />
        <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh ref={pupilRef} position={[0, 0, 0.4]}>
        <sphereGeometry args={[0.18, 64, 64]} />
        <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.1} />
      </mesh>
      <mesh position={[0.08, 0.08, 0.48]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

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
        <mesh>
          <sphereGeometry args={[1.6, 64, 64]} />
          <MeshDistortMaterial color="#1D4ED8" roughness={0.25} metalness={0.6} distort={0.15} speed={1.2} />
        </mesh>
        <TarsierEye position={[-0.55, 0.2, 1.15]} scale={1.1} />
        <TarsierEye position={[0.55, 0.2, 1.15]} scale={1.1} />
        <mesh position={[0, -0.15, 1.5]}>
          <sphereGeometry args={[0.12, 32, 32]} />
          <meshStandardMaterial color="#0F3584" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.4, 1.4]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#0F3584" roughness={0.4} />
        </mesh>
        <TarsierEar position={[-1.5, 0.7, -0.2]} rotation={[0, -0.4, 0.3]} />
        <TarsierEar position={[1.5, 0.7, -0.2]} rotation={[0, 0.4, -0.3]} />
      </group>
    </Float>
  );
}

export default function TarsierScene() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'auto' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, 2, 4]} intensity={0.5} color="#60A5FA" />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#93C5FD" />
        <TarsierHead />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
