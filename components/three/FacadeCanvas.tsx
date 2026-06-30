'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import { Suspense } from 'react';
import * as THREE from 'three';
import FacadeScene, { type FacadeConfig } from './FacadeScene';

interface FacadeCanvasProps extends FacadeConfig {
  variant: 'hero' | 'config';
  className?: string;
}

export default function FacadeCanvas({ variant, className, ...config }: FacadeCanvasProps) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.8]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: config.night ? 1.05 : 1.18,
        powerPreference: 'high-performance',
      }}
      camera={{ fov: variant === 'hero' ? 38 : 34, near: 0.1, far: 100, position: [4, 0.5, 7] }}
    >
      <Suspense fallback={null}>
        <FacadeScene variant={variant} {...config} />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={config.night ? 1.25 : 0.25}
            luminanceThreshold={config.night ? 0.35 : 0.85}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.22} darkness={0.85} />
          <SMAA />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
