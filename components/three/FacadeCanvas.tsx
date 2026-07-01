'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import FacadeScene, { type FacadeConfig, type Surface } from './FacadeScene';
import BuildingScene from './BuildingScene';
import InteriorScene from './InteriorScene';

export type SceneKind = 'facade' | 'building' | 'interior';

export interface Scene3DConfig extends Partial<FacadeConfig> {
  kind?: SceneKind;
  variant?: 'hero' | 'config';
  surface?: Surface;
  orbit?: boolean;
  viewIndex?: number;
  className?: string;
}

export default function FacadeCanvas({
  kind = 'facade',
  variant = 'config',
  className,
  orbit,
  viewIndex = 0,
  ...config
}: Scene3DConfig) {
  const night = !!config.night;

  const camera =
    kind === 'building'
      ? { fov: 30, near: 0.1, far: 120, position: [0, 1.8, 14] as [number, number, number] }
      : kind === 'interior'
      ? { fov: 64, near: 0.1, far: 80, position: [0, 0.2, 5.5] as [number, number, number] }
      : { fov: variant === 'hero' ? 38 : 34, near: 0.1, far: 100, position: [4, 0.5, 7] as [number, number, number] };

  return (
    <Canvas
      className={className}
      dpr={[1, 1.8]}
      shadows={kind === 'building'}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: kind === 'interior' ? 1.0 : night ? 1.05 : 1.15,
        powerPreference: 'high-performance',
      }}
      camera={camera}
    >
      <Suspense fallback={null}>
        {kind === 'building' && <BuildingScene />}
        {kind === 'interior' && <InteriorScene viewIndex={viewIndex} />}
        {kind === 'facade' && (
          <FacadeScene
            variant={variant}
            orbit={orbit}
            pattern={config.pattern ?? [90, 30, 15]}
            gap={config.gap ?? 30}
            night={night}
            surface={config.surface ?? 'anodisiert'}
          />
        )}

        {kind === 'facade' && orbit && (
          <OrbitControls
            makeDefault
            enablePan={false}
            minDistance={4}
            maxDistance={12}
            minPolarAngle={Math.PI * 0.32}
            maxPolarAngle={Math.PI * 0.6}
            enableDamping
            dampingFactor={0.08}
            autoRotate
            autoRotateSpeed={0.45}
          />
        )}

        <EffectComposer multisampling={0} enabled>
          <Bloom
            intensity={kind === 'interior' ? 0.5 : night ? 1.25 : 0.22}
            luminanceThreshold={kind === 'interior' ? 0.7 : night ? 0.35 : 0.9}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={kind === 'building' ? 0.55 : 0.7} />
          <SMAA />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
