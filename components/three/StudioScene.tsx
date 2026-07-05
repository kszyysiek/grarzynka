'use client';

import { useMemo } from 'react';
import { Environment, Lightformer, OrthographicCamera, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { buildFin, FACE_WIDTH, PROFILES, MM_SCALE as S } from './profiles3d';

export type StudioSceneName =
  | 'rhythmus-tag'
  | 'rhythmus-nacht'
  | 'detail'
  | 'wand-90'
  | 'fine-15'
  | 'ansicht-tag'
  | 'ansicht-nacht';

type ModuleKey = keyof typeof PROFILES;

interface WallSpec {
  pattern: ModuleKey[];
  gapMm: number;
  span: number; // world units to fill
  finLen: number;
  night?: boolean;
  surface?: 'natur' | 'anodisiert';
  shadows?: boolean;
  /** Freestanding product shot: no substrate wall, no rails. */
  bare?: boolean;
}

function useAluminium(surface: 'natur' | 'anodisiert') {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(surface === 'anodisiert' ? '#ac8a5f' : '#c2c0ba'),
        metalness: 0.92,
        roughness: 0.3,
        clearcoat: 0.55,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.6,
      }),
    [surface]
  );
}

/** A wall of fins assembled from the real extruded profiles. */
function Wall({ pattern, gapMm, span, finLen, night, surface = 'anodisiert', shadows, bare }: WallSpec) {
  const material = useAluminium(surface);

  const { group, ledStrips } = useMemo(() => {
    const group = new THREE.Group();
    const ledStrips: { x: number; w: number }[] = [];
    const gap = gapMm * S;

    // measure one pattern repeat
    let cursor = -span / 2;
    let pi = 0;
    while (cursor < span / 2) {
      const key = pattern[pi % pattern.length];
      const w = FACE_WIDTH[key] * S;
      const fin = buildFin(key, finLen, material, { shadows });
      fin.position.x = cursor + w / 2;
      group.add(fin);
      if (cursor + w + gap < span / 2) {
        ledStrips.push({ x: cursor + w + gap / 2, w: gap });
      }
      cursor += w + gap;
      pi++;
    }
    return { group, ledStrips };
  }, [pattern, gapMm, span, finLen, material, shadows]);

  return (
    <group>
      {/* Substrate wall */}
      {!bare && (
        <mesh position={[0, 0, -0.5]} receiveShadow={shadows}>
          <planeGeometry args={[span + 10, finLen + 10]} />
          <meshStandardMaterial color="#241c14" roughness={0.95} metalness={0} />
        </mesh>
      )}

      {/* Horizontal rails (Trägerschienen), concealed behind the feet */}
      {!bare &&
        [-finLen * 0.32, 0, finLen * 0.32].map((y) => (
          <mesh key={y} position={[0, y, -0.455]}>
            <boxGeometry args={[span + 2, 0.415, 0.08]} />
            <meshStandardMaterial color="#2e261e" roughness={0.7} metalness={0.3} />
          </mesh>
        ))}

      {/* LED light lines in the fugen */}
      {night &&
        ledStrips.map((s, i) => (
          <mesh key={i} position={[s.x, 0, -0.16]}>
            <planeGeometry args={[Math.max(s.w * 0.62, 0.06), finLen]} />
            <meshBasicMaterial color="#ffd28f" toneMapped={false} />
          </mesh>
        ))}

      <primitive object={group} />
    </group>
  );
}

/* ── Lighting rigs ─────────────────────────────────────────────── */

function InteriorRig({ night, flat }: { night?: boolean; flat?: boolean }) {
  return (
    <>
      <ambientLight intensity={night ? (flat ? 0.05 : 0.09) : 0.4} color="#f6eddc" />
      <hemisphereLight args={['#fff2df', '#584a38', night ? 0.18 : 0.55]} />
      <directionalLight position={[10, 14, 12]} intensity={night ? 0.25 : 1.6} color="#fff2dd" />
      <directionalLight position={[-12, 4, 8]} intensity={night ? 0.15 : 0.6} color="#9fb2c8" />
      {night && !flat &&
        [-8, 2, 10].map((x) => (
          <pointLight key={x} position={[x, 10, 5]} intensity={18} distance={30} decay={2} color="#ffd9a0" />
        ))}
      {/* High-contrast studio reflections — thin bright strips against darkness make the metal read */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#0d0b09']} />
        <Lightformer intensity={night ? 1.2 : 3.2} form="rect" position={[0, 9, 5]} rotation={[-Math.PI / 3, 0, 0]} scale={[30, 2.2, 1]} color="#fff6e6" />
        <Lightformer intensity={night ? 0.8 : 2.4} form="rect" position={[10, 2, 7]} rotation={[0, -Math.PI / 2.8, 0]} scale={[2.4, 18, 1]} color="#ffffff" />
        <Lightformer intensity={night ? 1.5 : 1.8} form="rect" position={[-11, 1, 6]} rotation={[0, Math.PI / 2.8, 0]} scale={[3, 16, 1]} color="#e8c896" />
        <Lightformer intensity={night ? 0.15 : 0.9} form="rect" position={[0, -1, 13]} scale={[26, 10, 1]} color="#dfe7ef" />
      </Environment>
    </>
  );
}

function ExteriorRig() {
  return (
    <>
      <ambientLight intensity={0.4} color="#eef2f6" />
      <hemisphereLight args={['#dfeaf4', '#b8a488', 0.75]} />
      {/* low raking sun from the left */}
      <directionalLight
        position={[-26, 9, 14]}
        intensity={3.1}
        color="#ffe7bd"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[18, 4, 10]} intensity={0.4} color="#b9cde2" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.6} form="rect" position={[0, 10, 8]} scale={[30, 10, 1]} color="#eaf2fb" />
        <Lightformer intensity={1.8} form="rect" position={[-14, 3, 6]} rotation={[0, Math.PI / 2.8, 0]} scale={[18, 12, 1]} color="#ffe9c4" />
      </Environment>
    </>
  );
}

/* ── Scene assembly ────────────────────────────────────────────── */

export default function StudioScene({ scene }: { scene: StudioSceneName }) {
  const night = scene === 'rhythmus-nacht' || scene === 'ansicht-nacht';
  const ortho = scene === 'ansicht-tag' || scene === 'ansicht-nacht';

  return (
    <>
      <color attach="background" args={[night ? '#0b0908' : scene === 'wand-90' ? '#c9d4de' : '#171310']} />

      {scene === 'wand-90' ? <ExteriorRig /> : <InteriorRig night={night} flat={ortho} />}

      {/* Walls per scene */}
      {(scene === 'rhythmus-tag' || scene === 'rhythmus-nacht') && (
        <Wall pattern={['p90', 'p30', 'p15', 'p30']} gapMm={30} span={40} finLen={26} night={night} />
      )}

      {(scene === 'ansicht-tag' || scene === 'ansicht-nacht') && (
        <Wall pattern={['p90', 'p30', 'p15', 'p30']} gapMm={30} span={40} finLen={24} night={night} />
      )}

      {scene === 'wand-90' && (
        <group rotation={[0, 0.06, 0]}>
          <Wall pattern={['p90']} gapMm={30} span={44} finLen={26} shadows />
        </group>
      )}

      {scene === 'fine-15' && (
        <Wall pattern={['p15']} gapMm={12} span={30} finLen={24} />
      )}

      {scene === 'detail' && (
        <group rotation={[0, -0.32, 0]}>
          {/* Freestanding profile group — the product itself, cross-sections readable from above */}
          <Wall bare pattern={['p30', 'p15', 'led']} gapMm={30} span={3.6} finLen={3.2} />
          {/* rim light to draw the metal edges */}
          <directionalLight position={[-7, 6, -9]} intensity={2.2} color="#fff3de" />
          {/* dark gloss floor for grounding */}
          <mesh position={[0, -1.6, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[26, 16]} />
            <meshStandardMaterial color="#120e0b" roughness={0.32} metalness={0.35} />
          </mesh>
          <ContactShadows position={[0, -1.56, 0.3]} opacity={0.6} scale={14} blur={2.2} far={4} color="#000000" />
        </group>
      )}

      {/* Cameras */}
      {ortho ? (
        <OrthographicCamera makeDefault position={[0, 0, 60]} zoom={44} near={0.1} far={200} />
      ) : scene === 'detail' ? (
        <PerspectiveCamera
          makeDefault
          position={[3.9, 3.4, 5.0]}
          fov={27}
          near={0.1}
          far={100}
          onUpdate={(c) => c.lookAt(-0.15, -0.15, 0)}
        />
      ) : scene === 'wand-90' ? (
        <PerspectiveCamera
          makeDefault
          position={[15, 2.5, 21]}
          fov={38}
          near={0.1}
          far={200}
          onUpdate={(c) => c.lookAt(-6, 0, 0)}
        />
      ) : (
        <PerspectiveCamera
          makeDefault
          position={[11, 1.8, 17]}
          fov={37}
          near={0.1}
          far={200}
          onUpdate={(c) => c.lookAt(-5, 0, 0)}
        />
      )}
    </>
  );
}
