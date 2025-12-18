"use client";

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Particles Component
function Particles({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  
  const particleCount = 150;
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2 + Math.random() * 8;
      
      temp.push({
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(t),
          r * Math.sin(phi) * Math.sin(t),
          r * Math.cos(phi)
        ),
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        angle: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    
    particles.forEach((particle, i) => {
      const t = time * particle.speed + particle.offset;
      
      // Calculate position with wave motion
      const x = particle.position.x + Math.sin(t + particle.angle) * 0.5 + mouse.current.x * viewport.width * 0.1;
      const y = particle.position.y + Math.cos(t * 0.7) * 0.5 + mouse.current.y * viewport.height * 0.1;
      const z = particle.position.z + Math.sin(t * 0.5) * 0.5;
      
      dummy.position.set(x, y, z);
      
      // Rotate based on cursor
      dummy.rotation.x = time * 0.5 + mouse.current.x * Math.PI;
      dummy.rotation.y = time * 0.3 + mouse.current.y * Math.PI;
      
      // Scale with pulse effect
      const scale = 0.05 + Math.sin(t * 2) * 0.02;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#1e3a8a"
        emissive="#1e40af"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </instancedMesh>
  );
}

// Geometric Shapes Component
function GeometricShapes({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire group based on cursor
    group.current.rotation.x = time * 0.1 + mouse.current.y * 0.5;
    group.current.rotation.y = time * 0.15 + mouse.current.x * 0.5;
    
    // Move group towards cursor
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      mouse.current.x * 2,
      0.05
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      mouse.current.y * 2,
      0.05
    );
  });

  return (
    <group ref={group}>
      {/* Wireframe Icosahedron */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#1e3a8a" wireframe />
      </mesh>
      
      {/* Torus Knot */}
      <mesh position={[3, 2, -2]} rotation={[0, 0, Math.PI / 4]}>
        <torusKnotGeometry args={[0.6, 0.2, 100, 16]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#1e40af"
          emissiveIntensity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Octahedron */}
      <mesh position={[-3, -2, -1]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#1e40af"
          emissiveIntensity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Tetrahedron */}
      <mesh position={[2, -3, 1]}>
        <tetrahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color="#1e3a8a" wireframe />
      </mesh>
      
      {/* Cone */}
      <mesh position={[-2, 3, 0]}>
        <coneGeometry args={[0.8, 1.5, 4]} />
        <meshStandardMaterial
          color="#1e3a8a"
          emissive="#1e40af"
          emissiveIntensity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}

// Main Scene Component
function Scene() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1e40af" />
      
      <Particles mouse={mouse} />
      <GeometricShapes mouse={mouse} />
    </>
  );
}

// Main Component
export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 opacity-30">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
