import * as THREE from 'three';

/**
 * 3D fin builders extruded from the real profile cross-sections
 * (construction drawings, state 07/2026). Units: 1 world unit = 100 mm.
 */

const S = 0.01; // mm → world units

/** [x, y, w, h] in profile mm coordinates — x across the face, y from face toward the wall. */
type RectDef = [number, number, number, number];
interface BallDef { cx: number; cy: number }

interface ProfileDef {
  width: number; // face width incl. structure, mm
  rects: RectDef[];
  balls: BallDef[];
  feet: RectDef[];
}

export const PROFILES: Record<'p30' | 'p90' | 'led' | 'p15' | 'abschluss', ProfileDef> = {
  // Rechteckprofil 30 × 40,6
  p30: {
    width: 30,
    rects: [
      [0, 0, 30, 1.4],
      [0, 30.8, 30, 1.4],
      [0, 1.4, 1.4, 29.4],
      [28.6, 1.4, 1.4, 29.4],
    ],
    feet: [
      [6.5, 32.2, 2, 6.9],
      [21.5, 32.2, 2, 6.9],
    ],
    balls: [
      { cx: 7.5, cy: 39.1 },
      { cx: 22.5, cy: 39.1 },
    ],
  },
  // Gefaltetes Lamellenprofil 90 (125 gesamt)
  p90: {
    width: 125,
    rects: [
      [0, 0, 1.4, 32.2],
      [0, 0, 30, 1.4],
      [28.6, 0, 1.4, 32.2],
      [28.6, 30.8, 31.4, 1.4],
      [58.6, 0, 1.4, 32.2],
      [58.6, 0, 31.4, 1.4],
      [88.6, 0, 1.4, 32.2],
      [88.6, 30.8, 36.4, 1.4],
      [123.6, 23.8, 1.4, 7],
    ],
    feet: [
      [9.7, 32.2, 2, 6.9],
      [99.7, 32.2, 2, 6.9],
    ],
    balls: [
      { cx: 10.7, cy: 39.1 },
      { cx: 100.7, cy: 39.1 },
    ],
  },
  // LED-Profil 65
  led: {
    width: 65,
    rects: [
      [0, 0, 1.4, 32.2],
      [0, 0, 30, 1.4],
      [28.6, 0, 1.4, 12],
      [28.6, 20.2, 1.4, 12],
      [0, 30.8, 30, 1.4],
      [16, 12, 14, 1.4],
      [16, 18.8, 14, 1.4],
      [30, 0, 35, 1.4],
      [63.6, 0, 1.4, 32.2],
      [40, 30.8, 25, 1.4],
    ],
    feet: [
      [9.7, 32.2, 2, 6.9],
      [39.7, 32.2, 2, 6.9],
    ],
    balls: [
      { cx: 10.7, cy: 39.1 },
      { cx: 40.7, cy: 39.1 },
    ],
  },
  // Fine 15 (systemgleiche Ableitung)
  p15: {
    width: 15,
    rects: [
      [0, 0, 15, 1.4],
      [0, 30.8, 15, 1.4],
      [0, 1.4, 1.4, 29.4],
      [13.6, 1.4, 1.4, 29.4],
    ],
    feet: [[6.5, 32.2, 2, 6.9]],
    balls: [{ cx: 7.5, cy: 39.1 }],
  },
  // Abschluss-Kamm (offenes U)
  abschluss: {
    width: 30,
    rects: [
      [0, 0, 1.4, 32.2],
      [28.6, 0, 1.4, 32.2],
      [0, 30.8, 30, 1.4],
    ],
    feet: [
      [6.5, 32.2, 2, 6.9],
      [21.5, 32.2, 2, 6.9],
    ],
    balls: [
      { cx: 7.5, cy: 39.1 },
      { cx: 22.5, cy: 39.1 },
    ],
  },
};

/**
 * Build a vertical fin: profile cross-section in XZ, extruded along Y.
 * Face plane sits at z = 0, feet reach toward the wall (negative z).
 * The group origin is the horizontal centre of the profile.
 */
export function buildFin(
  key: keyof typeof PROFILES,
  length: number,
  material: THREE.Material,
  opts: { shadows?: boolean } = {}
): THREE.Group {
  const def = PROFILES[key];
  const g = new THREE.Group();
  const cx = (def.width * S) / 2;

  const add = (geo: THREE.BufferGeometry, px: number, pz: number) => {
    const m = new THREE.Mesh(geo, material);
    m.position.set(px - cx, 0, pz);
    if (opts.shadows) {
      m.castShadow = true;
      m.receiveShadow = true;
    }
    g.add(m);
  };

  for (const [x, y, w, h] of [...def.rects, ...def.feet]) {
    add(new THREE.BoxGeometry(w * S, length, h * S), (x + w / 2) * S, -(y + h / 2) * S);
  }
  for (const { cx: bx, cy } of def.balls) {
    add(new THREE.CylinderGeometry(1.5 * S, 1.5 * S, length, 20), bx * S, -cy * S);
  }
  return g;
}

export const FACE_WIDTH: Record<keyof typeof PROFILES, number> = {
  p30: 30,
  p90: 125,
  led: 65,
  p15: 15,
  abschluss: 30,
};

export { S as MM_SCALE };
