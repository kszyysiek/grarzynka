'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { MotionValue } from 'framer-motion';
import { buildFinGeometry, FACE_WIDTH, PROFILES, MM_SCALE as S } from './profiles3d';

/**
 * Scroll-driven journey through a villa clad with the system:
 * day exterior → dusk, profile LEDs switch on → entrance close-up → hall with
 * colour wall + SPI pixel lines → salon → pergola → pool, bar & planters →
 * pull-back over the garden fence.
 * Units: 1 ≈ 100 mm (schematic). Front facade at z = 0, garden toward −z.
 */

type ModuleKey = keyof typeof PROFILES;

const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);

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

function ledMat(hex: string, k: number) {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(hex).multiplyScalar(k),
    toneMapped: false,
    side: THREE.DoubleSide,
  });
}

/**
 * A straight run of vertical fins along local X, face toward +Z.
 * All fins sharing a material are merged into one mesh (one draw call).
 */
function FinRun({
  length,
  pattern,
  gapMm,
  finLen,
  material,
  materials,
  simple = false,
}: {
  length: number;
  pattern: ModuleKey[];
  gapMm: number;
  finLen: number;
  material?: THREE.Material;
  materials?: THREE.Material[]; // cycles per fin — for the colour wall
  simple?: boolean;
}) {
  const meshes = useMemo(() => {
    const mats = materials ?? [material!];
    const buckets: THREE.BufferGeometry[][] = mats.map(() => []);
    const base: Partial<Record<ModuleKey, THREE.BufferGeometry>> = {};
    const gap = gapMm * S;
    let cursor = -length / 2;
    let i = 0;
    while (cursor < length / 2) {
      const key = pattern[i % pattern.length];
      const w = FACE_WIDTH[key] * S;
      const geo = (base[key] ??= buildFinGeometry(key, finLen, simple)).clone();
      geo.translate(cursor + w / 2, 0, 0);
      buckets[i % mats.length].push(geo);
      cursor += w + gap;
      i++;
    }
    return buckets
      .map((parts, m) => (parts.length ? { geo: mergeGeometries(parts)!, mat: mats[m] } : null))
      .filter(Boolean) as { geo: THREE.BufferGeometry; mat: THREE.Material }[];
  }, [length, pattern, gapMm, finLen, material, materials, simple]);

  return (
    <>
      {meshes.map((m, i) => (
        <mesh key={i} geometry={m.geo} material={m.mat} />
      ))}
    </>
  );
}

function Led({
  w,
  h,
  x = 0,
  y = 0,
  z = 0,
  rotX = 0,
  rotY = 0,
  material,
}: {
  w: number;
  h: number;
  x?: number;
  y?: number;
  z?: number;
  rotX?: number;
  rotY?: number;
  material: THREE.Material;
}) {
  return (
    <mesh position={[x, y, z]} rotation={[rotX, rotY, 0]} material={material}>
      <planeGeometry args={[w, h]} />
    </mesh>
  );
}

function Box({
  p,
  s,
  color,
  rough = 0.85,
  metal = 0,
  material,
}: {
  p: [number, number, number];
  s: [number, number, number];
  color?: string;
  rough?: number;
  metal?: number;
  material?: THREE.Material;
}) {
  return (
    <mesh position={p} material={material}>
      <boxGeometry args={s} />
      {!material && <meshStandardMaterial color={color} roughness={rough} metalness={metal} />}
    </mesh>
  );
}

interface Mats {
  alu: THREE.Material;
  aluDark: THREE.Material;
  colours: THREE.Material[];
  ledOut: THREE.MeshBasicMaterial; // exterior profile LEDs — switch on at dusk
  ledIn: THREE.MeshBasicMaterial; // interior LEDs — always on
  glass: THREE.Material;
}

/* ── Site ──────────────────────────────────────────────────────── */

function Grounds() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#3a4a2c" roughness={1} />
      </mesh>
      {/* street */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 60]}>
        <planeGeometry args={[500, 18]} />
        <meshStandardMaterial color="#2b2c31" roughness={0.9} />
      </mesh>
      {/* stone plinth under house + terrace */}
      <Box p={[-5, 0.3, -30]} s={[96, 0.6, 66]} color="#cfc7b6" rough={0.75} />
      {/* pool deck */}
      <Box p={[-10, 0.25, -76]} s={[64, 0.5, 30]} color="#d6cebd" rough={0.7} />
    </group>
  );
}

function Tree({ x, z, s = 1 }: { x: number; z: number; s?: number }) {
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 8, 8]} />
        <meshStandardMaterial color="#4a3b2c" roughness={1} />
      </mesh>
      <mesh position={[0, 12, 0]}>
        <sphereGeometry args={[6, 14, 12]} />
        <meshStandardMaterial color="#2f4426" roughness={1} />
      </mesh>
    </group>
  );
}

function FenceRun({
  length,
  material,
  led,
  simple,
}: {
  length: number;
  material: THREE.Material;
  led: THREE.Material;
  simple?: boolean;
}) {
  // plinth + fin field + capping LED line; run along local X, face +Z
  return (
    <group>
      <Box p={[0, 0.6, 0]} s={[length, 1.2, 1.2]} color="#8c8577" />
      <group position={[0, 5.2, 0.3]}>
        <FinRun length={length - 0.4} pattern={['p30']} gapMm={38} finLen={8} material={material} simple={simple} />
      </group>
      <Led w={length - 0.4} h={0.12} y={1.3} z={0.65} rotX={-Math.PI / 2} material={led} />
    </group>
  );
}

function Fences({ mats }: { mats: Mats }) {
  return (
    <group>
      {/* garden side — seen in the final pull-back, face toward the viewer (−z) */}
      <group position={[0, 0, -104]} rotation={[0, Math.PI, 0]}>
        <FenceRun length={140} material={mats.alu} led={mats.ledOut} simple />
      </group>
      {/* side runs — the street side stays open onto the driveway */}
      {[-70, 70].map((x) => (
        <group key={x} position={[x, 0, -52]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <FenceRun length={104} material={mats.alu} led={mats.ledOut} simple />
        </group>
      ))}
    </group>
  );
}

/* ── Driveway with planting (street side, open — no fence) ────── */

function Driveway({ mats }: { mats: Mats }) {
  const shrubs = useMemo(() => {
    const out: { p: [number, number, number]; r: number; c: string }[] = [];
    let s = 41;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const greens = ['#3f5f30', '#4d6b38', '#355029', '#5b7a43'];
    const bed = (x0: number, x1: number, z0: number, z1: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const r = 0.9 + rnd() * 1.3;
        out.push({ p: [x0 + rnd() * (x1 - x0), r * 0.7, z0 + rnd() * (z1 - z0)], r, c: greens[Math.floor(rnd() * 4)] });
      }
    };
    bed(-38, 4, 2.5, 7, 26); // bed along the front facade
    bed(-40, -14, 20, 34, 18); // lawn island left
    bed(42, 56, 8, 30, 14); // right border
    return out;
  }, []);

  return (
    <group>
      {/* wide paved driveway + forecourt, street to entrance */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[17, 0.04, 26]}>
        <planeGeometry args={[34, 46]} />
        <meshStandardMaterial color="#cfc8b8" roughness={0.75} />
      </mesh>
      {/* paving joints */}
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[17, 0.06, 6 + i * 4]}>
          <planeGeometry args={[34, 0.08]} />
          <meshStandardMaterial color="#b3ab9b" roughness={0.9} />
        </mesh>
      ))}
      {/* low hedges framing the driveway */}
      {[-1.8, 35.8].map((x) => (
        <Box key={x} p={[x, 1.4, 28]} s={[2.4, 2.8, 40]} color="#3d5a2e" rough={1} />
      ))}
      {/* bollard lights in the profile system along the drive */}
      {[10, 20, 30, 40].flatMap((z) =>
        [1.2, 32.8].map((x) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <Box p={[0, 1.6, 0]} s={[0.6, 3.2, 0.6]} material={mats.alu} />
            <Led w={0.12} h={2.6} y={1.7} z={0.32} material={mats.ledOut} />
            <Led w={0.12} h={2.6} y={1.7} z={-0.32} material={mats.ledOut} />
          </group>
        ))
      )}
      {/* shrubs and ornamental trees */}
      {shrubs.map((b, i) => (
        <mesh key={i} position={b.p}>
          <sphereGeometry args={[b.r, 10, 8]} />
          <meshStandardMaterial color={b.c} roughness={1} />
        </mesh>
      ))}
      <Tree x={-26} z={28} s={0.75} />
      <Tree x={48} z={34} s={0.8} />
      <Tree x={-6} z={46} s={0.6} />
      <Tree x={40} z={50} s={0.6} />
    </group>
  );
}

/* ── House shell ───────────────────────────────────────────────── */

function House({ mats, door }: { mats: Mats; door: React.RefObject<THREE.Mesh> }) {
  const wall = '#e6dfd0';
  return (
    <group>
      {/* ground floor walls (hollow — the camera goes inside) */}
      <Box p={[-38, 7.3, -0.5]} s={[4, 13.4, 1]} color={wall} />
      <Box p={[8, 7.3, -0.5]} s={[4, 13.4, 1]} color={wall} />
      <Box p={[-15, 1.6, -0.5]} s={[42, 2, 1]} color={wall} />
      <Box p={[-15, 13.1, -0.5]} s={[42, 2.2, 1]} color={wall} />
      <Box p={[14, 13.6, -0.5]} s={[8, 1.2, 1]} color={wall} />
      <Box p={[24, 7.3, -0.5]} s={[12, 13.4, 1]} color={wall} />
      <Box p={[-39.5, 7.3, -20]} s={[1, 13.4, 40]} color={wall} />
      <Box p={[29.5, 7.3, -20]} s={[1, 13.4, 40]} color={wall} />
      {/* front window (x −36..6) — the lit salon shows through at night */}
      <mesh position={[-15, 7.3, -0.4]} material={mats.glass}>
        <planeGeometry args={[42, 9]} />
      </mesh>
      {/* sliding entrance door — slides into the wall pocket */}
      <mesh ref={door} position={[14, 6.8, -0.5]}>
        <boxGeometry args={[8, 13.2, 0.4]} />
        <meshStandardMaterial color="#241d16" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* slab between floors / ground-floor ceiling */}
      <Box p={[-5, 14.3, -20]} s={[71, 0.8, 41]} color="#d9d1c0" rough={0.8} />

      {/* upper volume, solid, fin-clad front & back */}
      <Box p={[-5, 20, -18]} s={[58, 10.6, 28]} color="#332c23" rough={0.9} />
      <Box p={[-5, 25.6, -18]} s={[60, 0.7, 30]} color="#d9d1c0" rough={0.8} />
      <group position={[-5, 20, -3.6]}>
        <FinRun length={57} pattern={['p30', 'p15']} gapMm={34} finLen={10.4} material={mats.alu} />
      </group>
      <group position={[-5, 20, -32.4]} rotation={[0, Math.PI, 0]}>
        <FinRun length={57} pattern={['p30', 'p15']} gapMm={34} finLen={10.4} material={mats.alu} simple />
      </group>
      {/* integrated LED profiles in the upper facade */}
      {[-30, -21, -12, -3, 6, 15].map((x) => (
        <group key={x}>
          <Led w={0.16} h={10.2} x={x} y={20} z={-3.5} material={mats.ledOut} />
          <Led w={0.16} h={10.2} x={x} y={20} z={-32.5} material={mats.ledOut} />
        </group>
      ))}
      <Led w={57} h={0.14} y={14.75} z={-3.7} material={mats.ledOut} />

      {/* clad ground-floor front, right of the entrance */}
      <group position={[24, 7.3, 0.45]}>
        <FinRun length={11.6} pattern={['p30', 'p30', 'p15']} gapMm={30} finLen={13.2} material={mats.alu} />
      </group>
      {[19.6, 24, 28.4].map((x) => (
        <Led key={x} w={0.14} h={13} x={x} y={7.3} z={0.5} material={mats.ledOut} />
      ))}

      {/* back: full-height glass with an opened slider (x 2..14) */}
      {[
        [-19, 42],
        [22, 16],
      ].map(([cx, w]) => (
        <mesh key={cx} position={[cx, 7.3, -39.6]} material={mats.glass}>
          <planeGeometry args={[w, 13.4]} />
        </mesh>
      ))}
      {[-39, -30, -21, -12, -3, 2, 14, 22, 29].map((x) => (
        <Box key={x} p={[x, 7.3, -39.6]} s={[0.35, 13.4, 0.5]} color="#2a241d" rough={0.4} metal={0.6} />
      ))}
      <Box p={[-5, 0.75, -39.6]} s={[69, 0.3, 0.6]} color="#2a241d" />
    </group>
  );
}

function Entrance({ mats }: { mats: Mats }) {
  return (
    <group position={[14, 0, 0]}>
      {/* fin piers left/right of the door */}
      {[-6.4, 6.4].map((x) => (
        <group key={x} position={[x, 7.3, 0.6]}>
          <FinRun length={4.4} pattern={['p30']} gapMm={30} finLen={14.6} material={mats.alu} />
        </group>
      ))}
      {[-8.1, -6.5, -4.9, 4.9, 6.5, 8.1].map((x) => (
        <Led key={x} w={0.14} h={14.2} x={x} y={7.3} z={0.7} material={mats.ledOut} />
      ))}
      {/* canopy with soffit LED */}
      <Box p={[0, 14.9, 3]} s={[18, 0.6, 7]} color="#2c261e" rough={0.5} metal={0.4} />
      <Led w={16} h={0.18} y={14.55} z={5.6} rotX={Math.PI / 2} material={mats.ledOut} />
    </group>
  );
}

/* ── Hall: colour wall + SPI pixel lines running a light scene ──── */

const SPI_STRIPS = [12.6, 15.8, 19, 22.2, 25.4, 28.6];
const SPI_PIXELS = 44;

function Hall({ mats, hallLight }: { mats: Mats; hallLight: React.RefObject<THREE.PointLight> }) {
  const pixels = useRef<THREE.InstancedMesh>(null);
  const col = useMemo(() => new THREE.Color(), []);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const ready = useRef(false); // pixel positions are written on the first frame only
  useFrame(({ clock }) => {
    const mesh = pixels.current;
    if (!mesh) return;
    const t = clock.elapsedTime;
    let i = 0;
    for (let s = 0; s < SPI_STRIPS.length; s++) {
      for (let p = 0; p < SPI_PIXELS; p++) {
        if (!ready.current) {
          m.makeTranslation(SPI_STRIPS[s], 1.2 + p * 0.27, -23.1);
          mesh.setMatrixAt(i, m);
        }
        // scene: a slow hue sweep with a bright wave travelling upward
        const hue = (t * 0.06 + s * 0.07 + p * 0.012) % 1;
        const wave = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(p * 0.32 - t * 2.4 + s * 0.9), 3);
        col.setHSL(hue, 0.85, 0.55).multiplyScalar(2.6 * wave);
        mesh.setColorAt(i, col);
        i++;
      }
    }
    ready.current = true;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    hallLight.current?.color.setHSL((t * 0.06 + 0.17) % 1, 0.7, 0.6);
  });

  return (
    <group>
      {/* partition with the feature wall (x 12..30, face at z −24) */}
      <Box p={[21, 7.3, -24.6]} s={[18, 13.4, 1]} color="#15110c" rough={0.95} />
      {SPI_STRIPS.slice(0, -1).map((x, i) => (
        <group key={x} position={[x + 1.6, 7, -23.2]}>
          <FinRun
            length={2.7}
            pattern={['p30']}
            gapMm={30}
            finLen={12}
            materials={[...mats.colours.slice(i % 3), ...mats.colours.slice(0, i % 3)]}
          />
        </group>
      ))}
      <instancedMesh ref={pixels} args={[undefined, undefined, SPI_STRIPS.length * SPI_PIXELS]}>
        <planeGeometry args={[0.16, 0.2]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {/* hall ceiling LED line */}
      <Led w={0.2} h={22} x={14} y={13.85} z={-12} rotX={Math.PI / 2} material={mats.ledIn} />
      <pointLight ref={hallLight} position={[20, 8, -14]} intensity={40} distance={22} decay={2} />
    </group>
  );
}

/* ── Salon ─────────────────────────────────────────────────────── */

function Salon({ mats }: { mats: Mats }) {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.62, -20]}>
        <planeGeometry args={[69, 39]} />
        <meshStandardMaterial color="#5a4532" roughness={0.45} />
      </mesh>
      {/* rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, 0.66, -24]}>
        <planeGeometry args={[22, 18]} />
        <meshStandardMaterial color="#b9ab94" roughness={1} />
      </mesh>
      {/* sofa facing the media wall (−x) */}
      <Box p={[-14, 1.6, -24]} s={[6, 2, 18]} color="#d8cfc0" rough={1} />
      <Box p={[-11.5, 3.2, -24]} s={[1.6, 4, 18]} color="#d8cfc0" rough={1} />
      <Box p={[-19, 1.6, -32]} s={[10, 2, 5]} color="#d8cfc0" rough={1} />
      <Box p={[-24, 1.4, -23]} s={[6, 0.6, 8]} color="#2b241c" rough={0.3} metal={0.4} />
      {/* media wall in dark bronze p90 with LED line + fireplace slot */}
      <Box p={[-38.7, 7.3, -22]} s={[0.6, 13.4, 30]} color="#18130e" />
      <group position={[-38.3, 7.3, -22]} rotation={[0, Math.PI / 2, 0]}>
        <FinRun length={28} pattern={['p90']} gapMm={20} finLen={13} material={mats.aluDark} />
      </group>
      <Led w={0.2} h={13} x={-38.1} y={7.3} z={-36.4} rotY={Math.PI / 2} material={mats.ledIn} />
      <mesh position={[-38.05, 3.4, -22]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 1.4]} />
        <meshBasicMaterial color={new THREE.Color('#ff8a3a').multiplyScalar(2.2)} toneMapped={false} />
      </mesh>
      {/* dining */}
      <Box p={[16, 3.3, -29]} s={[12, 0.5, 5]} color="#3b2f24" rough={0.4} />
      {[-5, 5].map((dx) => (
        <Box key={dx} p={[16 + dx, 1.9, -29]} s={[0.5, 2.6, 4]} color="#2a241d" />
      ))}
      {[12, 16, 20].map((x) => (
        <mesh key={x} position={[x, 9.6, -29]}>
          <cylinderGeometry args={[0.7, 0.9, 0.9, 16]} />
          <meshBasicMaterial color={new THREE.Color('#ffd9a0').multiplyScalar(1.8)} toneMapped={false} />
        </mesh>
      ))}
      {/* linear ceiling LEDs */}
      {[-30, -18, -6].map((x) => (
        <Led key={x} w={0.22} h={34} x={x} y={13.85} z={-21} rotX={Math.PI / 2} material={mats.ledIn} />
      ))}
      {/* big indoor plant */}
      <Box p={[-34, 2, -35]} s={[3, 3, 3]} color="#2c261e" />
      <mesh position={[-34, 6, -35]}>
        <sphereGeometry args={[3, 12, 10]} />
        <meshStandardMaterial color="#3d5a30" roughness={1} />
      </mesh>
      <pointLight position={[-20, 11, -22]} intensity={60} distance={34} decay={2} color="#ffe2bd" />
      <pointLight position={[14, 11, -28]} intensity={40} distance={28} decay={2} color="#ffd9a6" />
    </group>
  );
}

/* ── Garden ────────────────────────────────────────────────────── */

function Pergola({ mats }: { mats: Mats }) {
  // bioclimatic louvred pergola (Tarasola) over the terrace, x −2..18, z −42..−56
  const louvers = Array.from({ length: 16 }, (_, i) => -42.8 - i * 0.82);
  return (
    <group>
      {[
        [-2, -42],
        [18, -42],
        [-2, -56],
        [18, -56],
      ].map(([x, z]) => (
        <Box key={`${x}${z}`} p={[x, 6, z]} s={[0.9, 12, 0.9]} color="#e9e6df" rough={0.5} metal={0.3} />
      ))}
      <Box p={[8, 11.7, -42]} s={[21, 1, 0.9]} color="#e9e6df" rough={0.5} metal={0.3} />
      <Box p={[8, 11.7, -56]} s={[21, 1, 0.9]} color="#e9e6df" rough={0.5} metal={0.3} />
      <Box p={[-2, 11.7, -49]} s={[0.9, 1, 14]} color="#e9e6df" rough={0.5} metal={0.3} />
      <Box p={[18, 11.7, -49]} s={[0.9, 1, 14]} color="#e9e6df" rough={0.5} metal={0.3} />
      {louvers.map((z) => (
        <mesh key={z} position={[8, 11.8, z]} rotation={[0.7, 0, 0]}>
          <boxGeometry args={[19.6, 0.1, 0.78]} />
          <meshStandardMaterial color="#efece6" roughness={0.45} metalness={0.3} />
        </mesh>
      ))}
      <Led w={19} h={0.14} x={8} y={11.15} z={-42.5} rotX={Math.PI / 2} material={mats.ledOut} />
      <Led w={19} h={0.14} x={8} y={11.15} z={-55.5} rotX={Math.PI / 2} material={mats.ledOut} />
      {/* loungers */}
      {[2, 13].map((x) => (
        <Box key={x} p={[x, 1.2, -50]} s={[4, 1, 7]} color="#d8cfc0" rough={1} />
      ))}
      <pointLight position={[8, 9, -49]} intensity={26} distance={20} decay={2} color="#ffdcae" />
    </group>
  );
}

function Planter({
  w,
  d,
  h,
  mats,
  seed,
}: {
  w: number;
  d: number;
  h: number;
  mats: Mats;
  seed: number;
}) {
  const flowers = useMemo(() => {
    const out: { p: [number, number, number]; c: string; r: number }[] = [];
    const palette = ['#e58bb0', '#f4efe6', '#b88ad8', '#f2c14e', '#e86a5a'];
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let i = 0; i < Math.round(w * d * 1.6); i++) {
      out.push({
        p: [(rnd() - 0.5) * (w - 0.8), h + 0.4 + rnd() * 1.2, (rnd() - 0.5) * (d - 0.8)],
        c: rnd() < 0.5 ? '#3f6a33' : palette[Math.floor(rnd() * palette.length)],
        r: 0.22 + rnd() * 0.3,
      });
    }
    return out;
  }, [w, d, h, seed]);

  const sides: { pos: [number, number, number]; rot: number; len: number }[] = [
    { pos: [0, h / 2, d / 2 + 0.4], rot: 0, len: w },
    { pos: [0, h / 2, -d / 2 - 0.4], rot: Math.PI, len: w },
    { pos: [w / 2 + 0.4, h / 2, 0], rot: Math.PI / 2, len: d },
    { pos: [-w / 2 - 0.4, h / 2, 0], rot: -Math.PI / 2, len: d },
  ];

  return (
    <group>
      <Box p={[0, h / 2, 0]} s={[w, h, d]} color="#1d1812" />
      <Box p={[0, h + 0.05, 0]} s={[w - 0.3, 0.1, d - 0.3]} color="#2d2219" rough={1} />
      {sides.map((sd, i) => (
        <group key={i} position={sd.pos} rotation={[0, sd.rot, 0]}>
          <FinRun length={sd.len + 0.8} pattern={['p30']} gapMm={30} finLen={h - 0.2} material={mats.alu} />
          {/* integrated LED: base light line + corner line */}
          <Led w={sd.len + 0.8} h={0.12} y={-h / 2 + 0.3} z={0.06} material={mats.ledOut} />
          <Led w={0.12} h={h - 0.4} x={(sd.len + 0.8) / 2 - 0.1} z={0.06} material={mats.ledOut} />
        </group>
      ))}
      {flowers.map((f, i) => (
        <mesh key={i} position={f.p}>
          <sphereGeometry args={[f.r, 10, 8]} />
          <meshStandardMaterial color={f.c} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function PoolBarGarden({ mats }: { mats: Mats }) {
  const water = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1f6b78',
        metalness: 0.5,
        roughness: 0.1,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 2.0,
      }),
    []
  );
  return (
    <group>
      {/* pool x −33..5, z −67..−85 */}
      <Box p={[-14, 0.75, -76]} s={[38, 0.5, 18]} color="#bfb7a5" rough={0.7} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-14, 1.02, -76]} material={water}>
        <planeGeometry args={[35.6, 15.6]} />
      </mesh>
      {/* pool edge light line */}
      <Led w={35.6} h={0.12} x={-14} y={1.04} z={-68.2} rotX={-Math.PI / 2} material={mats.ledOut} />
      <pointLight position={[-14, 2, -76]} intensity={40} distance={30} decay={2} color="#5fd2d8" />

      {/* bar, clad face toward the pool (−x) */}
      <group position={[26, 0, -74]} rotation={[0, -Math.PI / 2, 0]}>
        <Box p={[0, 4.2, -1.6]} s={[15, 8.4, 6]} color="#1d1812" />
        <group position={[0, 4.6, 1.55]}>
          <FinRun length={14.4} pattern={['p15', 'p30']} gapMm={26} finLen={7.2} material={mats.alu} />
        </group>
        <Box p={[0, 8.75, -0.4]} s={[16, 0.5, 8.4]} color="#d8cfbc" rough={0.4} metal={0.1} />
        <Led w={15.6} h={0.18} y={8.35} z={1.75} material={mats.ledOut} />
        {[-4.5, 0, 4.5].map((x) => (
          <group key={x} position={[x, 0, 5.4]}>
            <Box p={[0, 2.6, 0]} s={[0.5, 5.2, 0.5]} color="#3a332a" rough={0.35} metal={0.7} />
            <mesh position={[0, 5.4, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 0.5, 20]} />
              <meshStandardMaterial color="#c8bfae" roughness={0.6} />
            </mesh>
          </group>
        ))}
        <pointLight position={[0, 7, 6]} intensity={22} distance={18} decay={2} color="#ffd6a0" />
      </group>

      {/* planters in the profiles, with integrated light */}
      <group position={[-34, 0.5, -61]}>
        <Planter w={5} d={5} h={4} mats={mats} seed={3} />
      </group>
      <group position={[-24, 0.5, -61]}>
        <Planter w={5} d={5} h={3} mats={mats} seed={11} />
      </group>
      <group position={[34, 0.5, -62]}>
        <Planter w={5} d={5} h={4} mats={mats} seed={7} />
      </group>
      <group position={[-22, 0.5, -91]}>
        <Planter w={14} d={3} h={3} mats={mats} seed={19} />
      </group>
      <group position={[-4, 0.5, -91]}>
        <Planter w={14} d={3} h={3} mats={mats} seed={23} />
      </group>
      <pointLight position={[-29, 6, -57]} intensity={18} distance={16} decay={2} color="#ffdcae" />

      <Tree x={-56} z={-90} s={1.1} />
      <Tree x={48} z={-92} />
      <Tree x={-58} z={20} s={0.9} />
      <Tree x={55} z={18} />
    </group>
  );
}

/* ── Camera path: keyframes pinned to scroll progress ──────────── */

const KEYS: { p: number; pos: [number, number, number]; tgt: [number, number, number] }[] = [
  { p: 0.0, pos: [82, 34, 112], tgt: [-4, 8, -14] }, // villa by day
  { p: 0.08, pos: [64, 26, 94], tgt: [-4, 8, -14] },
  { p: 0.22, pos: [16, 10, 68], tgt: [4, 10, -8] }, // dusk, profile LEDs on
  { p: 0.34, pos: [14, 8, 30], tgt: [14, 7, 0] }, // entrance close-up
  { p: 0.4, pos: [14, 6.6, 5], tgt: [14, 6.5, -10] }, // door slides open
  { p: 0.48, pos: [20, 7.2, -2.2], tgt: [21, 7, -24] }, // hall: colour wall + SPI
  { p: 0.54, pos: [12, 6.8, -8], tgt: [-4, 6, -26] },
  { p: 0.6, pos: [6, 11.5, -6], tgt: [-22, 2, -30] }, // salon
  { p: 0.66, pos: [6, 7, -30], tgt: [8, 5, -56] },
  { p: 0.72, pos: [8, 7, -36], tgt: [8, 9, -56] }, // out to the pergola
  { p: 0.8, pos: [-2, 6.5, -60], tgt: [24, 5, -74] }, // pool & bar
  { p: 0.86, pos: [-12, 9, -50], tgt: [-30, 3, -62] }, // planters
  { p: 0.93, pos: [-24, 24, -124], tgt: [-6, 6, -55] },
  { p: 1.0, pos: [-8, 38, -166], tgt: [-4, 8, -52] }, // pull-back, garden fence
];

function keyParam(p: number) {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i].p;
    const b = KEYS[i + 1].p;
    if (p <= b) return (i + (p - a) / (b - a)) / (KEYS.length - 1);
  }
  return 1;
}

/* ── Scene root ────────────────────────────────────────────────── */

const SKY_DAY = new THREE.Color('#9fb2c4');
const SKY_NIGHT = new THREE.Color('#121722');
const ENV_DAY = new THREE.Color('#8ea2b8');
const ENV_NIGHT = new THREE.Color('#0d1119');
const LED_WARM = new THREE.Color('#ffcf8a');

export default function JourneyScene({ progress }: { progress: MotionValue<number> }) {
  const mats = useMemo<Mats>(
    () => ({
      alu: makeAlu('#ac8a5f'),
      aluDark: makeAlu('#4a3c2c'),
      colours: ['#c69c66', '#6f8fb0', '#b06f58', '#7f9a6d', '#b58a9a', '#d9d4c7'].map(makeAlu),
      ledOut: ledMat('#ffcf8a', 0),
      ledIn: ledMat('#ffd9a4', 2.4),
      glass: new THREE.MeshStandardMaterial({
        color: '#9fb3bf',
        metalness: 0.1,
        roughness: 0.05,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    }),
    []
  );

  const posCurve = useMemo(
    () => new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.pos)), false, 'centripetal'),
    []
  );
  const tgtCurve = useMemo(
    () => new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k.tgt)), false, 'centripetal'),
    []
  );

  const t = useRef(0);
  const v = useMemo(() => new THREE.Vector3(), []);
  const w = useMemo(() => new THREE.Vector3(), []);
  const sun = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const envBg = useRef<THREE.Color>(null);
  // the lib types the ref as the effect class; at runtime it holds the instance
  const bloom = useRef<React.ElementRef<typeof Bloom>>(null);
  const door = useRef<THREE.Mesh>(null);
  const hallLight = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const goal = THREE.MathUtils.clamp(progress.get(), 0, 1);
    t.current = THREE.MathUtils.damp(t.current, goal, 3.2, delta);
    const p = t.current;

    // camera
    const u = keyParam(p);
    posCurve.getPoint(u, v);
    tgtCurve.getPoint(u, w);
    state.camera.position.copy(v);
    state.camera.lookAt(w);

    // day → night, profile LEDs switch on
    const n = smooth(0.06, 0.24, p);
    const scene = state.scene;
    if (scene.background instanceof THREE.Color) scene.background.lerpColors(SKY_DAY, SKY_NIGHT, n);
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerpColors(SKY_DAY, SKY_NIGHT, n);
      scene.fog.near = THREE.MathUtils.lerp(140, 80, n);
      scene.fog.far = THREE.MathUtils.lerp(460, 320, n);
    }
    envBg.current?.lerpColors(ENV_DAY, ENV_NIGHT, n);
    if (sun.current) sun.current.intensity = THREE.MathUtils.lerp(3.2, 0.18, n);
    if (hemi.current) hemi.current.intensity = THREE.MathUtils.lerp(1.1, 0.45, n);
    const on = smooth(0.12, 0.24, p);
    mats.ledOut.color.copy(LED_WARM).multiplyScalar(0.08 + on * 2.6);
    const fx = bloom.current as unknown as { intensity: number } | null;
    if (fx) fx.intensity = 0.15 + n * 0.95;

    // entrance door slides into its pocket
    if (door.current) door.current.position.x = 14 + 8 * smooth(0.33, 0.39, p);
  });

  return (
    <>
      <color attach="background" args={[SKY_DAY]} />
      <fog attach="fog" args={[SKY_DAY, 140, 460]} />

      <ambientLight intensity={0.12} color="#c8d2e2" />
      <hemisphereLight ref={hemi} args={['#b4c4d8', '#3a3326', 1.1]} />
      <directionalLight ref={sun} position={[60, 40, 50]} intensity={3.2} color="#ffe2bc" />
      <directionalLight position={[-30, 14, -20]} intensity={0.35} color="#7f96b5" />

      <Environment resolution={64} frames={Infinity}>
        <color ref={envBg} attach="background" args={[ENV_DAY]} />
        <Lightformer intensity={2.2} form="rect" position={[0, 10, 8]} rotation={[-Math.PI / 3, 0, 0]} scale={[40, 3, 1]} color="#ffe6c2" />
        <Lightformer intensity={1.1} form="rect" position={[-14, 4, 4]} rotation={[0, Math.PI / 2.6, 0]} scale={[4, 20, 1]} color="#9db4d4" />
        <Lightformer intensity={1.3} form="rect" position={[14, 3, 2]} rotation={[0, -Math.PI / 2.6, 0]} scale={[3, 18, 1]} color="#ffd9a6" />
      </Environment>

      <Grounds />
      <Fences mats={mats} />
      <Driveway mats={mats} />
      <House mats={mats} door={door} />
      <Entrance mats={mats} />
      <Hall mats={mats} hallLight={hallLight} />
      <Salon mats={mats} />
      <Pergola mats={mats} />
      <PoolBarGarden mats={mats} />

      <EffectComposer multisampling={0}>
        <Bloom ref={bloom} intensity={0.15} luminanceThreshold={0.9} luminanceSmoothing={0.3} mipmapBlur />
        <Vignette eskil={false} offset={0.22} darkness={0.6} />
        <SMAA />
      </EffectComposer>
    </>
  );
}
