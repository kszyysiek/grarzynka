'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export type Surface = 'natur' | 'anodisiert';

export interface FacadeConfig {
  pattern: number[]; // fin face widths in mm
  gap: number; // gap in mm
  night: boolean;
  surface: Surface;
}

interface FacadeSceneProps extends FacadeConfig {
  variant: 'hero' | 'config';
}

// 1 mm = 0.01 world units
const MM = 0.01;
const FIN_HEIGHT = 9;
const FIN_DEPTH = 0.55;

interface FinDef {
  x: number;
  w: number;
  gapAfter: number;
}

function buildFins(pattern: number[], gapMm: number, spanUnits: number): FinDef[] {
  const fins: FinDef[] = [];
  const gap = gapMm * MM;
  // Build outward from center until we fill the span both directions
  let x = 0;
  let pi = 0;
  const half = spanUnits / 2;

  // center first fin on 0
  const widths: number[] = [];
  // generate enough widths
  while (true) {
    const w = pattern[pi % pattern.length] * MM;
    widths.push(w);
    pi++;
    const provisional = widths.reduce((s, ww) => s + ww, 0) + (widths.length - 1) * gap;
    if (provisional > spanUnits + 4) break;
  }

  const totalW = widths.reduce((s, ww) => s + ww, 0) + (widths.length - 1) * gap;
  x = -totalW / 2;
  for (let i = 0; i < widths.length; i++) {
    const w = widths[i];
    fins.push({ x: x + w / 2, w, gapAfter: gap });
    x += w + gap;
  }
  return fins;
}

function useAluminiumMaterial(surface: Surface) {
  return useMemo(() => {
    const color =
      surface === 'anodisiert'
        ? new THREE.Color('#c8a878')
        : new THREE.Color('#c4c2bd');
    const mat = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.92,
      roughness: 0.38,
      envMapIntensity: 1.35,
    });
    return mat;
  }, [surface]);
}

function Fins({ pattern, gap, night, surface, variant }: FacadeSceneProps) {
  const span = variant === 'hero' ? 22 : 16;
  const fins = useMemo(() => buildFins(pattern, gap, span), [pattern, gap, span]);
  const material = useAluminiumMaterial(surface);

  const ledColor = useMemo(() => new THREE.Color('#ffcf85'), []);

  return (
    <group>
      {/* Dark recessed wall behind fins */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[span + 8, FIN_HEIGHT + 4]} />
        <meshStandardMaterial color="#0a0807" roughness={1} metalness={0} />
      </mesh>

      {/* LED light strips in the gaps (between fins) */}
      {night &&
        fins.map((f, i) => {
          if (i === fins.length - 1) return null;
          const next = fins[i + 1];
          const gx = (f.x + f.w / 2 + (next.x - next.w / 2)) / 2;
          return (
            <mesh key={`led-${i}`} position={[gx, 0, -0.18]}>
              <planeGeometry args={[gap * MM * 0.7, FIN_HEIGHT]} />
              <meshBasicMaterial color={ledColor} toneMapped={false} />
            </mesh>
          );
        })}

      {/* The fins */}
      {fins.map((f, i) => (
        <RoundedBox
          key={i}
          args={[f.w, FIN_HEIGHT, FIN_DEPTH]}
          radius={Math.min(f.w * 0.12, 0.025)}
          smoothness={4}
          position={[f.x, 0, 0]}
          material={material}
        />
      ))}
    </group>
  );
}

function Rig({ variant }: { variant: 'hero' | 'config' }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));

  // Base camera placement
  const base = useMemo(() => {
    if (variant === 'hero') {
      return { pos: new THREE.Vector3(5.4, 0.6, 6.2), look: new THREE.Vector3(-1.2, 0, 0) };
    }
    return { pos: new THREE.Vector3(3.4, 0.5, 7.0), look: new THREE.Vector3(-0.6, 0, 0) };
  }, [variant]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    // gentle auto drift + mouse parallax
    const driftX = Math.sin(t * 0.12) * (variant === 'hero' ? 0.5 : 0.2);
    const px = pointer.x * (variant === 'hero' ? 1.1 : 0.6);
    const py = pointer.y * (variant === 'hero' ? 0.5 : 0.3);

    const desired = new THREE.Vector3(
      base.pos.x + driftX + px,
      base.pos.y + py,
      base.pos.z
    );
    camera.position.lerp(desired, 1 - Math.pow(0.001, delta));
    target.current.lerp(base.look, 1 - Math.pow(0.001, delta));
    camera.lookAt(target.current);
  });

  return null;
}

export default function FacadeScene(props: FacadeSceneProps) {
  const { night } = props;

  return (
    <>
      <color attach="background" args={[night ? '#040303' : '#0c0a09']} />
      <fog attach="fog" args={[night ? '#040303' : '#0c0a09', 9, 24]} />

      {/* Key + fill lighting */}
      <ambientLight intensity={night ? 0.14 : 0.55} />
      <directionalLight
        position={[6, 8, 6]}
        intensity={night ? 0.5 : 1.8}
        color={night ? '#caa873' : '#fff4e0'}
      />
      <directionalLight
        position={[-8, 2, 4]}
        intensity={night ? 0.3 : 0.7}
        color="#8fa6c4"
      />
      {/* Frontal fill so the camera-facing fin faces are not pure dark reflections */}
      <directionalLight
        position={[0, 1.5, 12]}
        intensity={night ? 0.25 : 1.15}
        color={night ? '#b79a72' : '#fbf2e2'}
      />

      {/* Procedural studio environment — gives the metal real reflections (no external HDRI) */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          intensity={night ? 0.5 : 2.6}
          form="rect"
          position={[0, 5, -2]}
          scale={[14, 6, 1]}
          color="#fff1da"
        />
        <Lightformer
          intensity={night ? 1.6 : 1.8}
          form="rect"
          position={[6, 0, 3]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[10, 8, 1]}
          color="#d4b483"
        />
        <Lightformer
          intensity={night ? 0.4 : 1.2}
          form="rect"
          position={[-6, 1, 2]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[10, 8, 1]}
          color="#8aa0c0"
        />
        {/* Large soft frontal source — key for legible day metal head-on */}
        <Lightformer
          intensity={night ? 0.2 : 1.6}
          form="rect"
          position={[0, 0, 10]}
          scale={[16, 10, 1]}
          color="#fff6e8"
        />
        <Lightformer
          intensity={night ? 0.3 : 1.0}
          form="ring"
          position={[0, -4, 4]}
          scale={[6, 6, 1]}
          color="#3a2f24"
        />
      </Environment>

      <Fins {...props} />
      <Rig variant={props.variant} />
    </>
  );
}
