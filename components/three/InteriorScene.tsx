'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const MM = 0.01;

// Room dimensions (world units)
const ROOM_W = 13;
const ROOM_H = 4.2;
const ROOM_D = 16;

export interface InteriorView {
  pos: [number, number, number];
  target: [number, number, number];
}

export const INTERIOR_VIEWS: InteriorView[] = [
  { pos: [0, 0.2, 5.5], target: [0, 0.1, -6] },     // Empfang — looking down the hall
  { pos: [-4.5, 0.1, -1], target: [5, 0.2, -3] },   // Galeriewand — feature wall
  { pos: [3.8, 0.0, 2], target: [-4, 0.3, -5] },    // Lounge — corner
];

function finMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c6a06a'),
    metalness: 0.78,
    roughness: 0.4,
    envMapIntensity: 1.1,
  });
}

/** Vertical fins covering a wall of given width/height in the XY local plane. */
function FinWall({
  width,
  height,
  finWidthMm = 90,
  gapMm = 40,
  depth = 0.16,
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
  }, [width, finWidthMm, gapMm]);

  return (
    <group>
      <mesh position={[0, 0, -depth]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#2c2118" roughness={0.95} metalness={0} />
      </mesh>
      {fins.map((f, i) => (
        <mesh key={i} position={[f.x, 0, 0]} material={material}>
          <boxGeometry args={[f.w, height, depth]} />
        </mesh>
      ))}
    </group>
  );
}

function Room() {
  const mat = useMemo(finMaterial, []);

  return (
    <group>
      {/* Marble floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -ROOM_H / 2, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#e7ded0" metalness={0.18} roughness={0.18} envMapIntensity={0.8} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_H / 2, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#efe7da" roughness={1} metalness={0} />
      </mesh>

      {/* Ceiling linear fins (run along depth) */}
      <group position={[0, ROOM_H / 2 - 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <FinWall width={ROOM_W * 0.8} height={ROOM_D * 0.9} finWidthMm={70} gapMm={120} depth={0.1} material={mat} />
      </group>

      {/* Back wall — feature finned wall */}
      <group position={[0, 0, -ROOM_D / 2]}>
        <FinWall width={ROOM_W} height={ROOM_H} finWidthMm={90} gapMm={45} material={mat} />
      </group>

      {/* Left wall — finned */}
      <group position={[-ROOM_W / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <FinWall width={ROOM_D} height={ROOM_H} finWidthMm={90} gapMm={55} material={mat} />
      </group>

      {/* Right wall — plaster with art niches */}
      <group position={[ROOM_W / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh>
          <planeGeometry args={[ROOM_D, ROOM_H]} />
          <meshStandardMaterial color="#e9e0d2" roughness={1} metalness={0} />
        </mesh>
        {/* framed artworks */}
        {[-4, 0, 4].map((z) => (
          <mesh key={z} position={[z, 0.2, 0.05]}>
            <planeGeometry args={[1.6, 2.1]} />
            <meshStandardMaterial color={z === 0 ? '#7d8a5e' : '#9c6a52'} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Reception counter */}
      <mesh position={[0, -ROOM_H / 2 + 0.55, -3]} castShadow>
        <boxGeometry args={[3.4, 1.1, 0.9]} />
        <meshStandardMaterial color="#3a2c1f" roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, -ROOM_H / 2 + 1.12, -3]}>
        <boxGeometry args={[3.7, 0.06, 1.1]} />
        <meshStandardMaterial color="#d9cdb6" roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Lounge seats */}
      {[[-3.4, 2.4], [3.4, 2.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, -ROOM_H / 2 + 0.35, z]} castShadow>
          <boxGeometry args={[1.3, 0.7, 1.3]} />
          <meshStandardMaterial color="#cdbfa6" roughness={0.85} />
        </mesh>
      ))}

      {/* Round coffee table */}
      <mesh position={[0, -ROOM_H / 2 + 0.3, 2.5]}>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 28]} />
        <meshStandardMaterial color="#b9b1a0" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} color="#f3ead9" />
      <hemisphereLight args={['#fff4e2', '#7a6a52', 0.55]} />
      {/* Warm pools washing the back finned wall */}
      {[-4.2, 0, 4.2].map((x) => (
        <pointLight
          key={`b${x}`}
          position={[x, ROOM_H / 2 - 0.5, -ROOM_D / 2 + 1.6]}
          intensity={9}
          distance={9}
          decay={2}
          color="#ffd9a2"
        />
      ))}
      {/* Warm pools washing the left finned wall */}
      {[-4, 1, 5].map((z) => (
        <pointLight
          key={`l${z}`}
          position={[-ROOM_W / 2 + 1.6, ROOM_H / 2 - 0.5, z]}
          intensity={8}
          distance={9}
          decay={2}
          color="#ffe0b0"
        />
      ))}
      {/* Central fill + counter glow */}
      <pointLight position={[0, ROOM_H / 2 - 0.6, 1.5]} intensity={10} distance={16} decay={2} color="#fff0d8" />
      <pointLight position={[0, -ROOM_H / 2 + 1.5, -3]} intensity={4} distance={7} decay={2} color="#ffe7c0" />
    </>
  );
}

function CameraRig({ viewIndex }: { viewIndex: number }) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const transition = useRef(0); // frames remaining of forced transition
  const desiredPos = useRef(new THREE.Vector3(...INTERIOR_VIEWS[0].pos));
  const desiredTarget = useRef(new THREE.Vector3(...INTERIOR_VIEWS[0].target));

  useEffect(() => {
    const v = INTERIOR_VIEWS[viewIndex] ?? INTERIOR_VIEWS[0];
    desiredPos.current.set(...v.pos);
    desiredTarget.current.set(...v.target);
    transition.current = 90; // ~1.5s of guided motion
  }, [viewIndex]);

  useFrame((_, delta) => {
    if (transition.current > 0) {
      const a = 1 - Math.pow(0.0001, delta);
      camera.position.lerp(desiredPos.current, a);
      if (controls.current) {
        controls.current.target.lerp(desiredTarget.current, a);
        controls.current.update();
      }
      transition.current -= 1;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom
      minDistance={2}
      maxDistance={11}
      minPolarAngle={Math.PI * 0.28}
      maxPolarAngle={Math.PI * 0.62}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.5}
      target={INTERIOR_VIEWS[0].target}
    />
  );
}

export default function InteriorScene({ viewIndex = 0 }: { viewIndex?: number }) {
  return (
    <>
      <color attach="background" args={['#1c1813']} />
      <fog attach="fog" args={['#241c14', 16, 34]} />
      <Lighting />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={1.4} form="rect" position={[0, 3, 6]} scale={[10, 4, 1]} color="#ffe6c4" />
        <Lightformer intensity={0.8} form="rect" position={[0, 3, -6]} scale={[10, 4, 1]} color="#e8d2ae" />
      </Environment>
      <Room />
      <CameraRig viewIndex={viewIndex} />
    </>
  );
}
