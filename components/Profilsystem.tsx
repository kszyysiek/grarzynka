'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Technical cross-section visualisations of the six system profiles,
 * redrawn to scale (mm units in the SVG viewBox) from the construction
 * drawings, state 07/2026. Schematic — not a manufacturing document.
 */

const STROKE = '#d4b483';
const FILL = 'rgba(201, 161, 102, 0.16)';
const T = 0.5; // outline stroke width in mm

/** Press-fit foot: stem + ball end (R 1,5). */
function Foot({ cx, top }: { cx: number; top: number }) {
  return (
    <g>
      <rect x={cx - 1} y={top} width={2} height={6.9} fill={FILL} stroke={STROKE} strokeWidth={T} />
      <circle cx={cx} cy={top + 6.9} r={1.5} fill={FILL} stroke={STROKE} strokeWidth={T} />
    </g>
  );
}

/** Horizontal sawtooth decoration (Sägezahn). */
function Sawtooth({ x, y, len, teeth, depth, flip }: { x: number; y: number; len: number; teeth: number; depth: number; flip?: boolean }) {
  const step = len / teeth;
  let d = `M ${x} ${y}`;
  for (let i = 0; i < teeth; i++) {
    const x0 = x + i * step;
    d += ` L ${x0 + step / 2} ${y + (flip ? -depth : depth)} L ${x0 + step} ${y}`;
  }
  return <path d={d} fill="none" stroke={STROKE} strokeWidth={T * 0.7} opacity={0.85} />;
}

/** Vertical sawtooth decoration for the rail slot. */
function SawtoothV({ x, y, len, teeth, depth, flip }: { x: number; y: number; len: number; teeth: number; depth: number; flip?: boolean }) {
  const step = len / teeth;
  let d = `M ${x} ${y}`;
  for (let i = 0; i < teeth; i++) {
    const y0 = y + i * step;
    d += ` L ${x + (flip ? -depth : depth)} ${y0 + step / 2} L ${x} ${y0 + step}`;
  }
  return <path d={d} fill="none" stroke={STROKE} strokeWidth={T * 0.7} opacity={0.85} />;
}

function R({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x} y={y} width={w} height={h} fill={FILL} stroke={STROKE} strokeWidth={T} />;
}

/* ── The six profiles ──────────────────────────────────────────── */

function LamelleRechteck() {
  return (
    <svg viewBox="-8 -6 46 54" className="profil-svg" role="img" aria-label="Querschnitt Lamellenprofil 30, geschlossenes Rechteck">
      <path
        d="M0 0 H30 V32.2 H0 Z M1.4 1.4 V30.8 H28.6 V1.4 Z"
        fillRule="evenodd"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={T}
      />
      <Foot cx={7.5} top={32.2} />
      <Foot cx={22.5} top={32.2} />
    </svg>
  );
}

function AbschlussProfil() {
  return (
    <svg viewBox="-8 -6 46 54" className="profil-svg" role="img" aria-label="Querschnitt Abschlussprofil, oben offenes U">
      <path
        d="M0 0 H1.4 V30.8 H28.6 V0 H30 V32.2 H0 Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={T}
      />
      <Foot cx={7.5} top={32.2} />
      <Foot cx={22.5} top={32.2} />
    </svg>
  );
}

function LedProfil() {
  return (
    <svg viewBox="-5 -6 76 54" className="profil-svg" role="img" aria-label="Querschnitt Lamellenprofil mit LED-Kanal und Sägezahn-Justierung">
      {/* left box */}
      <R x={0} y={0} w={1.4} h={32.2} />
      <R x={0} y={0} w={30} h={1.4} />
      <R x={28.6} y={0} w={1.4} h={12} />
      <R x={28.6} y={20.2} w={1.4} h={12} />
      <R x={0} y={30.8} w={30} h={1.4} />
      {/* sawtooth tongue (Justier-Sägezahn) */}
      <R x={16} y={12} w={14} h={1.4} />
      <R x={16} y={18.8} w={14} h={1.4} />
      <Sawtooth x={16.5} y={14.6} len={13} teeth={9} depth={1.1} />
      <Sawtooth x={16.5} y={17.6} len={13} teeth={9} depth={1.1} flip />
      {/* right wing */}
      <R x={30} y={0} w={35} h={1.4} />
      <R x={63.6} y={0} w={1.4} h={32.2} />
      <R x={40} y={30.8} w={25} h={1.4} />
      <Foot cx={10.7} top={32.2} />
      <Foot cx={40.7} top={32.2} />
    </svg>
  );
}

function Lamelle90() {
  return (
    <svg viewBox="-4 -6 133 54" className="profil-svg" role="img" aria-label="Querschnitt gefaltetes Lamellenprofil, Modul 90, Gesamtbreite 125">
      <R x={0} y={0} w={1.4} h={32.2} />
      <R x={0} y={0} w={30} h={1.4} />
      <R x={28.6} y={0} w={1.4} h={32.2} />
      <R x={28.6} y={30.8} w={31.4} h={1.4} />
      <R x={58.6} y={0} w={1.4} h={32.2} />
      <R x={58.6} y={0} w={31.4} h={1.4} />
      <R x={88.6} y={0} w={1.4} h={32.2} />
      <R x={88.6} y={30.8} w={36.4} h={1.4} />
      <R x={123.6} y={23.8} w={1.4} h={7} />
      <Foot cx={10.7} top={32.2} />
      <Foot cx={100.7} top={32.2} />
    </svg>
  );
}

function KammProfil() {
  return (
    <svg viewBox="-4 -6 133 54" className="profil-svg" role="img" aria-label="Querschnitt Kammprofil mit vier Aufnahmen und LED-Steg">
      <R x={0} y={30.8} w={125} h={1.4} />
      <R x={0} y={0} w={1.4} h={30.8} />
      <R x={28.6} y={0} w={1.4} h={30.8} />
      <R x={60} y={0} w={1.4} h={30.8} />
      <R x={88.6} y={0} w={1.4} h={30.8} />
      {/* mid stubs + LED web */}
      <R x={38} y={22} w={1.4} h={8.8} />
      <R x={111} y={20.8} w={1.4} h={10} />
      <Foot cx={10.7} top={32.2} />
      <Foot cx={100.7} top={32.2} />
    </svg>
  );
}

function Traegerschiene() {
  return (
    <svg viewBox="-6 -8 54 38" className="profil-svg" role="img" aria-label="Querschnitt Trägerschiene mit Einhängehaken und Klemmkanal">
      {/* base plate */}
      <R x={0} y={17.5} w={41.5} h={2.5} />
      {/* left wall + hook */}
      <R x={0} y={5} w={2.5} h={12.5} />
      <path
        d="M1.25 6 A 5.4 5.4 0 1 1 9.4 9.6"
        fill="none"
        stroke={STROKE}
        strokeWidth={2.5}
        strokeLinecap="butt"
        opacity={0.9}
      />
      {/* right clamp channel (slot 3 mm, depth 10,5) */}
      <R x={35.4} y={7} w={1.5} h={10.5} />
      <R x={39.9} y={7} w={1.5} h={10.5} />
      <R x={33.4} y={7} w={2} h={1.5} />
      <SawtoothV x={36.9} y={8} len={8.5} teeth={6} depth={0.9} />
      <SawtoothV x={39.9} y={8} len={8.5} teeth={6} depth={0.9} flip />
    </svg>
  );
}

/* ── Section ───────────────────────────────────────────────────── */

const PROFILE = [
  {
    name: 'Lamellenprofil 30',
    dims: '30 × 40,6 mm · Wand 1,4 mm',
    role: 'Sichtprofil',
    desc: 'Das geschlossene Rechteckprofil — die Lamelle im Format Mezzo. Zwei Pressfüße mit Kugelende greifen formschlüssig in die Trägerebene.',
    svg: <LamelleRechteck />,
  },
  {
    name: 'Lamellenprofil 90',
    dims: '125 × 40,6 mm · Modul 90 mm',
    role: 'Sichtprofil',
    desc: 'Gefalteter Querschnitt für das Largo-Format: ein Profil bildet Lamelle und Fuge in einem Zug — maßhaltig über die gesamte Modulbreite.',
    svg: <Lamelle90 />,
  },
  {
    name: 'LED-Profil',
    dims: '65 × 40,6 mm · Kanal integriert',
    role: 'Funktionsprofil',
    desc: 'Sichtprofil mit integriertem Lichtkanal. Die Sägezahn-Verzahnung im Kern hält die Justierposition — spielfrei, ohne Werkzeug.',
    svg: <LedProfil />,
  },
  {
    name: 'Kammprofil',
    dims: '125 × 40,6 mm · 4 Aufnahmen',
    role: 'Trägerebene',
    desc: 'Verteilerprofil für freie Rhythmen: vier Aufnahmen im Modulraster, vorbereitet für LED-Bestückung in der Fuge.',
    svg: <KammProfil />,
  },
  {
    name: 'Abschlussprofil',
    dims: '30 × 40,6 mm · Wand 1,4 mm',
    role: 'Systemabschluss',
    desc: 'Der offene Abschluss-Kamm fasst Ränder, Laibungen und Systemenden — dieselbe Fußgeometrie, dieselbe Montagelogik.',
    svg: <AbschlussProfil />,
  },
  {
    name: 'Trägerschiene',
    dims: '41,5 × 20 mm · Wand 2,5 mm',
    role: 'Verdeckte Montage',
    desc: 'Die Wandschiene: Einhängehaken auf der einen, verzahnter Klemmkanal auf der anderen Seite. Nach der Montage unsichtbar.',
    svg: <Traegerschiene />,
  },
];

export default function Profilsystem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <section
      id="profile"
      className="section-pad"
      style={{ background: 'var(--color-base)' }}
      ref={ref}
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="chapter-num mb-3">V. — Profilsystem</p>
            <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
            <h2 className="display-lg text-ivory">
              Sechs Profile.{' '}
              <em style={{ color: 'var(--color-accent)' }}>Ein Formschluss.</em>
            </h2>
          </div>
          <p
            className="max-w-sm"
            style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}
          >
            Aus dem Guss entwickelte Querschnitte: Sichtprofile, Funktionsprofile und die
            verdeckte Trägerebene — aufeinander abgestimmt, füreinander gedacht.
          </p>
        </motion.div>

        {/* Profile cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--color-hairline)' }}>
          {PROFILE.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * (i + 1) }}
              className="profil-card"
            >
              {/* Drawing area */}
              <div className="profil-stage">
                <svg className="profil-grid" aria-hidden="true">
                  <defs>
                    <pattern id={`pg-${i}`} width="14" height="14" patternUnits="userSpaceOnUse">
                      <path d="M 14 0 L 0 0 0 14" fill="none" stroke="rgba(212,180,131,0.07)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#pg-${i})`} />
                </svg>
                {p.svg}
                <span className="profil-role">{p.role}</span>
              </div>

              {/* Caption */}
              <div style={{ padding: '1.4rem 1.5rem 1.7rem' }}>
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <h3
                    className="font-serif"
                    style={{ fontSize: '1.15rem', fontWeight: 400, color: 'var(--color-text)' }}
                  >
                    {p.name}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: '0.66rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    marginBottom: '0.7rem',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {p.dims}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', lineHeight: 1.7 }}>
                  {p.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <p
          style={{ marginTop: '0.9rem', fontSize: '0.62rem', color: 'var(--color-text-dimmer)', fontStyle: 'italic' }}
        >
          Querschnitte — schematische Darstellung nach Konstruktionsstand 07/2026. Maße in Millimetern, Änderungen vorbehalten.
        </p>
      </div>
    </section>
  );
}
