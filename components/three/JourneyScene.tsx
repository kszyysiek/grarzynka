'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';
import { buildFin, FACE_WIDTH, PROFILES, MM_SCALE as S } from './profiles3d';

/**
 * Scroll-driven dusk journey around a luxury house built with the system:
 * fence → LED entrance → pool & bar → colourful interior wall.
 * Units: 1 = 100 mm. Camera rides a Catmull-Rom path driven by scroll.
 */

type ModuleKey = keyof typeof PROFILES;

function makeAlu(color: string) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    metalness: 0.92,
    roughness: 0.3,
    clearcoat: 0.55,
    clearcoatRoughness: 0.22,
    envMapIntensity: 1.4,
  });
}

/** A straight run of vertical fins along local X, face toward +Z. */
function FinRun({
  length,
  pattern,
  gapMm,
  finLen,
  material,
  materials,
}: {
  length: number;
  pattern: ModuleKey[];
  gapMm: number;
  finLen: number;
  material?: THREE.Material;
  materials?: THREE.Material[]; // cycles per fin — for the colourful wall
}) {
  const group = useMemo(() => {
    const g = new THREE.Group();
    const gap = gapMm * S;
    let cursor = -length / 2;
    let i = 0;
    const fallback = material ?? makeAlu('#ac8a5f');
    while (cursor < length / 2) {
      const key = pattern[i % pattern.length];
      const w = FACE_WIDTH[key] * S;
      const mat = materials ? materials[i % materials.length] : fallback;
      const fin = buildFin(key, finLen, mat);
      fin.position.x = cursor + w / 2;
      g.add(fin);
      cursor += w + gap;
      i++;
    }
    return g;
  }, [length, pattern, gapMm, finLen, material, materials]);

  return <primitive object={group} />;
}

function Led({ w, h, x = 0, y = 0, z = 0, rotY = 0, color = '#ffd28f' }: { w: number; h: number; x?: number; y?: number; z?: number; rotY?: number; color?: string }) {
  return (
    <mesh position={[x, y, z]} rotation={[0, rotY, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial color={color} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Set pieces ────────────────────────────────────────────────── */

function Grounds() {
  return (
    <group>
      {/* lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#2b3323" roughness={1} />
      </mesh>
      {/* street strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 62]}>
        <planeGeometry args={[400, 18]} />
        <meshStandardMaterial color="#23242a" roughness={0.9} />
      </mesh>
      {/* entry path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[14, 0.04, 26]}>
        <planeGeometry args={[10, 44]} />
        <meshStandardMaterial color="#c9c1b0" roughness={0.8} />
      </mesh>
      {/* terrace slab around house */}
      <mesh position={[0, 0.35, -18]}>
        <boxGeometry args={[110, 0.7, 70]} />
        <meshStandardMaterial color="#cfc7b6" roughness={0.75} />
      </mesh>
    </group>
  );
}

function Fence({ material }: { material: THREE.Material }) {
  // fence field between low plinth and cap, gate opening at x 8..20
  return (
    <group position={[0, 0, 44]}>
      {/* plinth */}
      <mesh position={[-32, 0.5, 0]}>
        <boxGeometry args={[72, 1, 1.2]} />
        <meshStandardMaterial color="#8c8577" roughness={0.85} />
      </mesh>
      <mesh position={[42, 0.5, 0]}>
        <boxGeometry args={[44, 1, 1.2]} />
        <meshStandardMaterial color="#8c8577" roughness={0.85} />
      </mesh>
      {/* fin fields */}
      <group position={[-32, 7, 0]}>
        <FinRun length={70} pattern={['p30']} gapMm={38} finLen={12} material={material} />
      </group>
      <group position={[42, 7, 0]}>
        <FinRun length={42} pattern={['p30']} gapMm={38} finLen={12} material={material} />
      </group>
      {/* gate posts */}
      {[7, 21].map((x) => (
        <mesh key={x} position={[x, 6.5, 0]}>
          <boxGeometry args={[1.6, 13, 1.6]} />
          <meshStandardMaterial color="#2c261e" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function House({ material }: { material: THREE.Material }) {
  const glass = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#16242c', metalness: 0.9, roughness: 0.12, envMapIntensity: 1.6 }),
    []
  );
  return (
    <group position={[0, 0, -12]}>
      {/* ground floor volume */}
      <mesh position={[-8, 8, 0]}>
        <boxGeometry args={[76, 15, 34]} />
        <meshStandardMaterial color="#e6dfd0" roughness={0.85} />
      </mesh>
      {/* glass front band (left of entrance) */}
      <mesh position={[-22, 7, 17.2]}>
        <boxGeometry args={[40, 11, 0.5]} />
        <primitive object={glass} attach="material" />
      </mesh>
      {/* upper volume, fin-clad front */}
      <mesh position={[-2, 20.5, -4]}>
        <boxGeometry args={[56, 10, 26]} />
        <meshStandardMaterial color="#332c23" roughness={0.9} />
      </mesh>
      <group position={[-2, 20.5, 9.2]}>
        <FinRun length={54} pattern={['p30', 'p15']} gapMm={34} finLen={9.6} material={material} />
      </group>
      {/* roof caps */}
      <mesh position={[-8, 15.8, 0]}>
        <boxGeometry args={[78, 0.7, 36]} />
        <meshStandardMaterial color="#d9d1c0" roughness={0.8} />
      </mesh>
      <mesh position={[-2, 25.9, -4]}>
        <boxGeometry args={[58, 0.7, 28]} />
        <meshStandardMaterial color="#d9d1c0" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Entrance({ material }: { material: THREE.Material }) {
  // recessed portal at x=14, front plane z=5.2
  return (
    <group position={[14, 0, 5.2]}>
      {/* recess box */}
      <mesh position={[0, 7.5, -3.2]}>
        <boxGeometry args={[16, 15, 7]} />
        <meshStandardMaterial color="#1c1712" roughness={0.95} />
      </mesh>
      {/* fin piers left/right of the door */}
      <group position={[-6.4, 7.5, 0.3]}>
        <FinRun length={4.4} pattern={['p30']} gapMm={30} finLen={14.6} material={material} />
      </group>
      <group position={[6.4, 7.5, 0.3]}>
        <FinRun length={4.4} pattern={['p30']} gapMm={30} finLen={14.6} material={material} />
      </group>
      {/* LED lines inside the piers */}
      {[-8.1, -6.5, -4.9, 4.9, 6.5, 8.1].map((x) => (
        <Led key={x} w={0.14} h={14.2} x={x} y={7.5} z={0.15} />
      ))}
      {/* soffit LED line above door */}
      <Led w={7.6} h={0.16} x={0} y={13.6} z={-1.4} />
      {/* door slab */}
      <mesh position={[0, 6.8, -5.6]}>
        <boxGeometry args={[6.4, 13.6, 0.4]} />
        <meshStandardMaterial color="#241d16" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* warm pools */}
      <pointLight position={[0, 11, 3]} intensity={30} distance={26} decay={2} color="#ffd9a0" />
      <pointLight position={[0, 4, -2.5]} intensity={16} distance={16} decay={2} color="#ffcf8f" />
      <pointLight position={[0, 1, 6]} intensity={10} distance={14} decay={2} color="#ffe2b4" />
    </group>
  );
}

function PoolAndBar({ material }: { material: THREE.Material }) {
  const water = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1f5e6b',
        metalness: 0.55,
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 2.0,
      }),
    []
  );
  return (
    <group position={[0, 0, -62]}>
      {/* pool basin rim */}
      <mesh position={[-6, 0.45, 0]}>
        <boxGeometry args={[40, 0.9, 18]} />
        <meshStandardMaterial color="#bfb7a5" roughness={0.7} />
      </mesh>
      {/* water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.96, 0]}>
        <planeGeometry args={[37, 15]} />
        <primitive object={water} attach="material" />
      </mesh>
      {/* underwater glow */}
      <pointLight position={[-6, 1.6, 0]} intensity={22} distance={26} decay={2} color="#5fd2d8" />

      {/* bar volume, fin-clad face toward the pool */}
      <group position={[22, 0, -2]}>
        <mesh position={[0, 4.2, -1.6]}>
          <boxGeometry args={[15, 8.4, 6]} />
          <meshStandardMaterial color="#1d1812" roughness={0.9} />
        </mesh>
        <group position={[0, 4.6, 1.55]}>
          <FinRun length={14.4} pattern={['p15', 'p30']} gapMm={26} finLen={7.2} material={material} />
        </group>
        {/* counter top */}
        <mesh position={[0, 8.75, -0.4]}>
          <boxGeometry args={[16, 0.5, 8.4]} />
          <meshStandardMaterial color="#d8cfbc" roughness={0.4} metalness={0.1} />
        </mesh>
        {/* under-counter LED */}
        <Led w={15.6} h={0.18} x={0} y={8.35} z={1.75} />
        <pointLight position={[0, 6, 5]} intensity={12} distance={18} decay={2} color="#ffd6a0" />
        {/* stools */}
        {[-4.5, 0, 4.5].map((x) => (
          <group key={x} position={[x, 0, 5.4]}>
            <mesh position={[0, 2.6, 0]}>
              <cylinderGeometry args={[0.28, 0.28, 5.2, 14]} />
              <meshStandardMaterial color="#3a332a" metalness={0.7} roughness={0.35} />
            </mesh>
            <mesh position={[0, 5.4, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 0.5, 20]} />
              <meshStandardMaterial color="#c8bfae" roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Interior() {
  const mats = useMemo(
    () => [makeAlu('#c69c66'), makeAlu('#8fa6b4'), makeAlu('#b06f58'), makeAlu('#8b9a6d')],
    []
  );
  return (
    <group position={[0, 0, -116]}>
      {/* room shell */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 6]}>
        <planeGeometry args={[60, 44]} />
        <meshStandardMaterial color="#221b14" roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, 11, 6]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 44]} />
        <meshStandardMaterial color="#2a231b" roughness={1} />
      </mesh>
      <mesh position={[-24, 5.5, 6]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[44, 11]} />
        <meshStandardMaterial color="#33291f" roughness={1} />
      </mesh>
      <mesh position={[24, 5.5, 6]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[44, 11]} />
        <meshStandardMaterial color="#33291f" roughness={1} />
      </mesh>

      {/* colourful feature wall */}
      <mesh position={[0, 5.5, -1.2]}>
        <planeGeometry args={[46, 11]} />
        <meshStandardMaterial color="#171209" roughness={0.95} />
      </mesh>
      <group position={[0, 5.5, -0.6]}>
        <FinRun length={42} pattern={['p30', 'p15', 'p30']} gapMm={32} finLen={10.4} materials={mats} />
      </group>

      {/* side LED strip (the „Pasek" — vertical light line at the wall's edge) */}
      <Led w={0.26} h={10.4} x={-21.4} y={5.5} z={0.25} />
      <pointLight position={[-19, 6, 3.5]} intensity={30} distance={26} decay={2} color="#ffd9a4" />
      {/* warm key + colour wash */}
      <pointLight position={[0, 9.5, 9]} intensity={16} distance={30} decay={2} color="#ffe6c4" />
      <pointLight position={[15, 6, 5]} intensity={20} distance={28} decay={2} color="#b06fd8" />
      <pointLight position={[4, 3, 7]} intensity={9} distance={20} decay={2} color="#5fb8c9" />

    </group>
  );
}

/* ── Camera path ───────────────────────────────────────────────── */

const POS = [
  new THREE.Vector3(14, 5.5, 76),
  new THREE.Vector3(13.4, 5.6, 44),
  new THREE.Vector3(14.5, 6, 34),
  new THREE.Vector3(36, 7.5, -16),
  new THREE.Vector3(16, 5.4, -50),
  new THREE.Vector3(-4, 5.2, -80),
  new THREE.Vector3(0, 5.6, -99),
];

const TARGET = [
  new THREE.Vector3(8, 7.5, 0),
  new THREE.Vector3(14, 7, 4),
  new THREE.Vector3(14, 7.2, 4),
  new THREE.Vector3(2, 3.5, -56),
  new THREE.Vector3(16, 5, -63),
  new THREE.Vector3(0, 5.8, -112),
  new THREE.Vector3(0, 5.6, -116.5),
];

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const posCurve = useMemo(() => new THREE.CatmullRomCurve3(POS, false, 'centripetal'), []);
  const tgtCurve = useMemo(() => new THREE.CatmullRomCurve3(TARGET, false, 'centripetal'), []);
  const t = useRef(0);
  const v = useMemo(() => new THREE.Vector3(), []);
  const w = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const goal = THREE.MathUtils.clamp(progress.get(), 0, 1);
    t.current = THREE.MathUtils.damp(t.current, goal, 3.2, delta);
    posCurve.getPoint(t.current, v);
    tgtCurve.getPoint(t.current, w);
    state.camera.position.copy(v);
    state.camera.lookAt(w);
  });

  return null;
}

/* ── Scene root ────────────────────────────────────────────────── */

export default function JourneyScene({ progress }: { progress: MotionValue<number> }) {
  const alu = useMemo(() => makeAlu('#ac8a5f'), []);

  return (
    <>
      <color attach="background" args={['#151a24']} />
      <fog attach="fog" args={['#151a24', 30, 150]} />

      {/* dusk light */}
      <ambientLight intensity={0.14} color="#c8d2e2" />
      <hemisphereLight args={['#8fa3c0', '#2e2a22', 0.7]} />
      <directionalLight position={[-40, 22, 30]} intensity={1.4} color="#ffc98f" />
      <directionalLight position={[30, 14, -20]} intensity={0.4} color="#7f96b5" />

      <Environment resolution={128} frames={1}>
        <color attach="background" args={['#10141c']} />
        <Lightformer intensity={2.2} form="rect" position={[0, 10, 8]} rotation={[-Math.PI / 3, 0, 0]} scale={[40, 3, 1]} color="#ffe6c2" />
        <Lightformer intensity={1.1} form="rect" position={[-14, 4, 4]} rotation={[0, Math.PI / 2.6, 0]} scale={[4, 20, 1]} color="#9db4d4" />
        <Lightformer intensity={1.3} form="rect" position={[14, 3, 2]} rotation={[0, -Math.PI / 2.6, 0]} scale={[3, 18, 1]} color="#ffd9a6" />
      </Environment>

      <Grounds />
      <Fence material={alu} />
      <House material={alu} />
      <Entrance material={alu} />
      <PoolAndBar material={alu} />
      <Interior />

      <CameraRig progress={progress} />
    </>
  );
}
