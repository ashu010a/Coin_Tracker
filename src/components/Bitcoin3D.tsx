import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Float } from '@react-three/drei';
import * as THREE from 'three';

const Bitcoin3D = () => {
  const coinRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.01;
      coinRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <group ref={coinRef}>
        {/* Main coin body */}
        <mesh castShadow>
          <cylinderGeometry args={[2, 2, 0.3, 64]} />
          <meshStandardMaterial
            color="#f7931a"
            metalness={0.9}
            roughness={0.1}
            emissive="#f7931a"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Coin edge detail */}
        <mesh position={[0, 0, 0]} castShadow>
          <torusGeometry args={[2, 0.15, 16, 64]} />
          <meshStandardMaterial
            color="#ffb347"
            metalness={0.95}
            roughness={0.05}
            emissive="#ffb347"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Bitcoin symbol - front side */}
        <Center position={[0, 0, 0.2]}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.8}
            height={0.1}
            curveSegments={12}
          >
            ₿
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.8}
              roughness={0.2}
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </Text3D>
        </Center>

        {/* Bitcoin symbol - back side */}
        <Center position={[0, 0, -0.2]} rotation={[0, Math.PI, 0]}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.8}
            height={0.1}
            curveSegments={12}
          >
            ₿
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.8}
              roughness={0.2}
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </Text3D>
        </Center>

        {/* Glow ring effect */}
        <mesh>
          <torusGeometry args={[2.3, 0.05, 16, 64]} />
          <meshBasicMaterial color="#00d9ff" transparent opacity={0.6} />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.3, 0.05, 16, 64]} />
          <meshBasicMaterial color="#00d9ff" transparent opacity={0.4} />
        </mesh>

        {/* Inner circle details */}
        <mesh position={[0, 0, 0.16]}>
          <circleGeometry args={[1.8, 64]} />
          <meshStandardMaterial
            color="#f7931a"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        <mesh position={[0, 0, -0.16]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[1.8, 64]} />
          <meshStandardMaterial
            color="#f7931a"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </group>
    </Float>
  );
};

export default Bitcoin3D;
