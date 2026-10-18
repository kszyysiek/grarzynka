'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { PanoNode } from '@/data/pano';

/**
 * Street-View-style panorama: the camera sits at the centre of an inside-out
 * sphere textured with an equirectangular photo. Drag to look around; floor
 * arrows walk to the next room with a short push-in and cross-fade.
 */

const R = 50;

function dir(yaw: number, pitch: number, r: number): [number, number, number] {
  const y = THREE.MathUtils.degToRad(yaw);
  const p = THREE.MathUtils.degToRad(pitch);
  return [r * Math.cos(p) * Math.sin(y), r * Math.sin(p), -r * Math.cos(p) * Math.cos(y)];
}

function Sphere({ src, opacity }: { src: string; opacity: React.MutableRefObject<number> }) {
  const tex = useLoader(THREE.TextureLoader, src);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    if (mat.current) mat.current.opacity = opacity.current;
  });
  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[R, 96, 64]} />
      <meshBasicMaterial ref={mat} map={tex} side={THREE.DoubleSide} toneMapped={false} transparent />
    </mesh>
  );
}

export default function PanoScene({
  nodes,
  current,
  onWalk,
}: {
  nodes: Record<string, PanoNode>;
  current: string;
  onWalk: (id: string) => void;
}) {
  const node = nodes[current];
  const { camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  const opacity = useRef(1);
  const walking = useRef<{ to: string; t: number } | null>(null);
  const [touched, setTouched] = useState(false);

  // face the room's preferred direction on arrival
  useEffect(() => {
    const [x, y, z] = dir(node.startYaw ?? 0, 0, 0.1);
    cam.position.set(-x, -y, -z);
    cam.lookAt(0, 0, 0);
    cam.fov = 72;
    cam.updateProjectionMatrix();
  }, [node, cam]);

  useFrame((_, delta) => {
    const w = walking.current;
    if (w) {
      w.t = Math.min(1, w.t + delta / 0.7);
      cam.fov = THREE.MathUtils.lerp(72, 38, w.t * w.t);
      opacity.current = 1 - Math.max(0, (w.t - 0.45) / 0.55);
      cam.updateProjectionMatrix();
      if (w.t >= 1) {
        walking.current = null;
        onWalk(w.to);
      }
    } else if (opacity.current < 1) {
      opacity.current = Math.min(1, opacity.current + delta / 0.5);
    }
  });

  const walk = (to: string, yaw: number) => {
    if (walking.current) return;
    // turn toward the arrow first so the push-in goes the right way
    const [x, y, z] = dir(yaw, 0, 0.1);
    cam.position.set(-x, -y, -z);
    cam.lookAt(0, 0, 0);
    walking.current = { to, t: 0 };
  };

  const spots = useMemo(() => node.links, [node]);

  return (
    <>
      <Sphere key={node.src} src={node.src} opacity={opacity} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={-0.35}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.78}
        autoRotate={!touched}
        autoRotateSpeed={0.35}
        onStart={() => setTouched(true)}
        target={[0, 0, 0]}
      />
      {spots.map((l) => (
        <Html key={l.to + l.yaw} position={dir(l.yaw, l.pitch ?? -18, 12)} center zIndexRange={[20, 0]}>
          <button
            type="button"
            onClick={() => walk(l.to, l.yaw)}
            aria-label={`Weiter: ${nodes[l.to]?.title ?? l.to}`}
            className="pano-hotspot"
          >
            <span className="pano-hotspot-arrow" aria-hidden="true">
              ↑
            </span>
            <span className="pano-hotspot-label">{nodes[l.to]?.title ?? l.to}</span>
          </button>
        </Html>
      ))}
    </>
  );
}
