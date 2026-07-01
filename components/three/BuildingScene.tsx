'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

/** Procedural soft cloud texture — radial alpha gradient, no external asset. */
function makeCloudTexture(): THREE.Texture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.45, 'rgba(255,252,246,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function SoftClouds() {
  const tex = useMemo(makeCloudTexture, []);
  const puffs = useMemo(
    () => [
      { p: [2.5, -2.4, -5] as [number, number, number], s: 9 },
      { p: [-3.5, 2.4, -6] as [number, number, number], s: 7.5 },
      { p: [4.5, 2.8, -7] as [number, number, number], s: 6.5 },
      { p: [-5, -1.6, -5.5] as [number, number, number], s: 7 },
      { p: [0, -3, -4] as [number, number, number], s: 8 },
    ],
    []
  );
  return (
    <group>
      {puffs.map((c, i) => (
        <mesh key={i} position={c.p}>
          <planeGeometry args={[c.s, c.s * 0.6]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={0.7} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

const MM = 0.01;

function aluminium() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#caa46d'),
    metalness: 0.85,
    roughness: 0.36,
    envMapIntensity: 1.25,
  });
}

/** Vertical louver fins cladding one rectangular face. */
function FinnedFace({
  width,
  height,
  finWidthMm = 46,
  gapMm = 22,
  depth = 0.13,
  material,
}: {
  width: number;
  height: number;
  finWidthMm?: number;
  gapMm?: number;
  depth?: number;
  material: THREE.Material;
}) {
  const fins = useMemo(() => {
    const fw = finWidthMm * MM;
    const gap = gapMm * MM;
    const pitch = fw + gap;
    const n = Math.max(1, Math.floor(width / pitch));
    const used = n * pitch - gap;
    const start = -used / 2 + fw / 2;
    return Array.from({ length: n }, (_, i) => ({ x: start + i * pitch, w: fw }));
  }, [width, height, finWidthMm, gapMm]);

  return (
    <group>
      {/* recessed dark backing */}
      <mesh position={[0, 0, -depth * 0.5]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#7a6248" roughness={0.85} metalness={0} />
      </mesh>
      {fins.map((f, i) => (
        <mesh key={i} position={[f.x, 0, depth * 0.5]} material={material} castShadow>
          <boxGeometry args={[f.w, height, depth]} />
        </mesh>
      ))}
    </group>
  );
}

function Glass({ w, h, d }: { w: number; h: number; d: number }) {
  return (
    <mesh>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color="#9fb3bd" metalness={0.55} roughness={0.14} envMapIntensity={1.7} />
    </mesh>
  );
}

function Building() {
  const mat = useMemo(aluminium, []);

  // Storey heights
  const groundH = 1.5;
  const upperH = 1.7;
  const W = 4.2;
  const D = 3.0;
  const upperW = 4.2;
  const upperD = 3.0;
  const setbackW = 2.8;
  const setbackD = 2.0;
  const setbackH = 1.1;

  const yGround = groundH / 2;
  const yUpper = groundH + upperH / 2;
  const ySet = groundH + upperH + setbackH / 2;

  return (
    <group position={[0, -1.4, 0]}>
      {/* Ground floor — glazed */}
      <group position={[0, yGround, 0]}>
        <Glass w={W * 0.98} h={groundH * 0.92} d={D * 0.98} />
        {/* slim columns */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * W * 0.46, 0, D * 0.5]} material={mat}>
            <boxGeometry args={[0.12, groundH, 0.12]} />
          </mesh>
        ))}
      </group>

      {/* slab between ground and upper */}
      <mesh position={[0, groundH, 0]} castShadow>
        <boxGeometry args={[W + 0.25, 0.12, D + 0.25]} />
        <meshStandardMaterial color="#ddd0bb" roughness={0.85} metalness={0} />
      </mesh>

      {/* Upper mass — finned façade */}
      <group position={[0, yUpper, 0]}>
        {/* core */}
        <mesh>
          <boxGeometry args={[upperW * 0.9, upperH, upperD * 0.9]} />
          <meshStandardMaterial color="#8a7259" roughness={0.85} />
        </mesh>
        {/* front + back finned faces */}
        <group position={[0, 0, upperD / 2]}>
          <FinnedFace width={upperW} height={upperH} material={mat} />
        </group>
        <group position={[0, 0, -upperD / 2]} rotation={[0, Math.PI, 0]}>
          <FinnedFace width={upperW} height={upperH} material={mat} />
        </group>
        {/* left + right finned faces */}
        <group position={[upperW / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <FinnedFace width={upperD} height={upperH} material={mat} />
        </group>
        <group position={[-upperW / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <FinnedFace width={upperD} height={upperH} material={mat} />
        </group>
      </group>

      {/* slab */}
      <mesh position={[0, groundH + upperH, 0]} castShadow>
        <boxGeometry args={[W + 0.1, 0.12, D + 0.1]} />
        <meshStandardMaterial color="#ddd0bb" roughness={0.85} />
      </mesh>

      {/* Setback penthouse — glazed with fin screen on front */}
      <group position={[0, ySet, -0.3]}>
        <Glass w={setbackW} h={setbackH * 0.9} d={setbackD} />
        <group position={[0, 0, setbackD / 2 + 0.02]}>
          <FinnedFace width={setbackW} height={setbackH} finWidthMm={45} gapMm={40} material={mat} />
        </group>
      </group>

      {/* roof parapet */}
      <mesh position={[0, groundH + upperH + setbackH, -0.3]}>
        <boxGeometry args={[setbackW + 0.1, 0.08, setbackD + 0.1]} />
        <meshStandardMaterial color="#ddd0bb" roughness={0.85} />
      </mesh>

      {/* roof terrace planters (greenery) */}
      {[-1, 0, 1].map((s) => (
        <mesh key={s} position={[s * 1.0, groundH + upperH + 0.18, D * 0.42]}>
          <boxGeometry args={[0.7, 0.32, 0.35]} />
          <meshStandardMaterial color="#586b39" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Rotator({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.1 + state.pointer.x * 0.3;
    ref.current.position.y = Math.sin(t * 0.5) * 0.05;
    ref.current.rotation.x = -0.02 + state.pointer.y * 0.04;
  });
  return <group ref={ref}>{children}</group>;
}

export default function BuildingScene() {
  return (
    <>
      {/* Warm light sky */}
      <color attach="background" args={['#dfe7ec']} />
      <fog attach="fog" args={['#dbe3e9', 14, 30]} />

      <hemisphereLight args={['#eaf0f4', '#c9b79a', 0.7]} />
      <directionalLight
        position={[6, 9, 4]}
        intensity={2.4}
        color="#fff3df"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-7, 3, -4]} intensity={0.5} color="#bcd2e6" />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={3} form="rect" position={[0, 6, 4]} scale={[18, 8, 1]} color="#fff6e8" />
        <Lightformer intensity={1.6} form="rect" position={[8, 2, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[12, 10, 1]} color="#cfe0ee" />
        <Lightformer intensity={1.2} form="rect" position={[-8, 2, -2]} rotation={[0, Math.PI / 2, 0]} scale={[12, 10, 1]} color="#e9d8be" />
      </Environment>

      {/* Offset to the right so the headline stays clear on the left */}
      <group position={[2.6, 0.2, 0]} scale={0.92}>
        <Rotator>
          <Building />
        </Rotator>
      </group>

      <ContactShadows position={[2.6, -2.9, 0]} opacity={0.3} scale={16} blur={2.8} far={6} color="#5a4631" />

      <SoftClouds />
    </>
  );
}
