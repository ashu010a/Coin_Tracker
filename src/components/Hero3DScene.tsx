import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import Bitcoin3D from './Bitcoin3D';

const Hero3DScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
          
          {/* Lighting setup */}
          <ambientLight intensity={0.5} />
          
          <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00d9ff" />
          <pointLight position={[10, -10, -5]} intensity={0.5} color="#7c3aed" />
          
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
            color="#00d9ff"
          />

          {/* 3D Bitcoin */}
          <Bitcoin3D />

          {/* Environment for reflections */}
          <Environment preset="night" />

          {/* Interactive controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Hero3DScene;
