'use client';

/**
 * Internal render studio: /studio?s=<scene>
 * Produces the still imagery used across the site. Not linked from the UI.
 */

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import * as THREE from 'three';
import StudioScene, { type StudioSceneName } from '@/components/three/StudioScene';

const SCENES: StudioSceneName[] = [
  'rhythmus-tag',
  'rhythmus-nacht',
  'detail',
  'wand-90',
  'fine-15',
  'ansicht-tag',
  'ansicht-nacht',
];

function Studio() {
  const params = useSearchParams();
  const s = (params.get('s') ?? 'rhythmus-tag') as StudioSceneName;
  const scene = SCENES.includes(s) ? s : 'rhythmus-tag';
  const night = scene === 'rhythmus-nacht' || scene === 'ansicht-nacht';

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0b0908' }}>
      <Canvas
        dpr={1}
        shadows={scene === 'wand-90'}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: night ? 1.02 : 1.12,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <StudioScene scene={scene} />
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={night ? 1.3 : 0.2}
              luminanceThreshold={night ? 0.32 : 0.9}
              luminanceSmoothing={0.42}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.24} darkness={night ? 0.72 : 0.5} />
            <SMAA />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <Studio />
    </Suspense>
  );
}
