'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import FacadeView from '@/components/three/FacadeView';
import type { Surface } from '@/components/three/FacadeScene';

type Composition = 'largo' | 'mezzo' | 'fine' | 'rhythmus';
type Gap = 'schmal' | 'klassisch' | 'offen';
type Time = 'tag' | 'nacht';

const COMPOSITIONS: Record<Composition, number[]> = {
  largo: [90],
  mezzo: [30],
  fine: [15],
  rhythmus: [90, 30, 15],
};

const GAPS: Record<Gap, number> = {
  schmal: 12,
  klassisch: 30,
  offen: 55,
};

const COMP_LABELS: Record<Composition, string> = {
  largo: 'Largo (90)',
  mezzo: 'Mezzo (30)',
  fine: 'Fine (15)',
  rhythmus: 'Rhythmus (90·30·15)',
};

const GAP_LABELS: Record<Gap, string> = {
  schmal: 'Schmal',
  klassisch: 'Klassisch',
  offen: 'Offen',
};

const SURFACE_LABELS: Record<Surface, string> = {
  natur: 'Aluminium natur',
  anodisiert: 'Anodisiert · Champagner',
};

export default function Visualisierung() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' });

  const [comp, setComp] = useState<Composition>('rhythmus');
  const [gapKey, setGapKey] = useState<Gap>('klassisch');
  const [time, setTime] = useState<Time>('tag');
  const [surface, setSurface] = useState<Surface>('anodisiert');

  return (
    <section
      id="visualisierung"
      className="section-pad"
      style={{ background: 'var(--color-base)' }}
      ref={sectionRef}
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="chapter-num mb-3">VI. — Visualisierung</p>
            <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
            <h2 className="display-lg text-ivory">
              Erleben Sie das System{' '}
              <em style={{ color: 'var(--color-accent)' }}>im Rhythmus.</em>
            </h2>
          </div>
          <p
            className="max-w-sm"
            style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}
          >
            Komponieren Sie Format, Fuge und Oberfläche — und sehen Sie, wie sich die
            Fassade bei Tag und nach Einbruch der Dunkelheit verwandelt.
          </p>
        </motion.div>

        {/* 3D Canvas — full width, large */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            position: 'relative',
            height: 'clamp(360px, 52vw, 680px)',
            border: '1px solid var(--color-hairline)',
            overflow: 'hidden',
            background: '#0c0a09',
          }}
        >
          <FacadeView
            variant="config"
            pattern={COMPOSITIONS[comp]}
            gap={GAPS[gapKey]}
            night={time === 'nacht'}
            surface={surface}
          />

          {/* Caption overlay */}
          <p
            style={{
              position: 'absolute',
              bottom: '0.875rem',
              left: '1rem',
              fontSize: '0.6rem',
              color: 'rgba(239,233,221,0.35)',
              fontStyle: 'italic',
              pointerEvents: 'none',
            }}
          >
            Visualisierung — schematisch · Bewegen Sie den Zeiger für Perspektive
          </p>

          {/* Time toggle — floating top right */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              display: 'flex',
              gap: '0.25rem',
              background: 'rgba(12,10,9,0.55)',
              backdropFilter: 'blur(10px)',
              padding: '0.3rem',
              border: '1px solid var(--color-hairline)',
            }}
          >
            <button
              onClick={() => setTime('tag')}
              className={`segment-btn ${time === 'tag' ? 'active' : ''}`}
              style={{ border: 'none' }}
            >
              Tag
            </button>
            <button
              onClick={() => setTime('nacht')}
              className={`segment-btn ${time === 'nacht' ? 'active' : ''}`}
              style={{ border: 'none' }}
            >
              Nacht · LED
            </button>
          </div>
        </motion.div>

        {/* Controls below canvas */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Composition */}
          <div>
            <p className="eyebrow mb-3" style={{ fontSize: '0.62rem' }}>
              Komposition / Rhythmus
            </p>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(COMPOSITIONS) as Composition[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setComp(c)}
                  className={`segment-btn ${comp === c ? 'active' : ''}`}
                >
                  {COMP_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Gap */}
          <div>
            <p className="eyebrow mb-3" style={{ fontSize: '0.62rem' }}>
              Fugenbreite
            </p>
            <div className="flex gap-1">
              {(Object.keys(GAPS) as Gap[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGapKey(g)}
                  className={`segment-btn ${gapKey === g ? 'active' : ''}`}
                >
                  {GAP_LABELS[g]}
                </button>
              ))}
            </div>
          </div>

          {/* Surface */}
          <div>
            <p className="eyebrow mb-3" style={{ fontSize: '0.62rem' }}>
              Oberfläche
            </p>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(SURFACE_LABELS) as Surface[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSurface(s)}
                  className={`segment-btn ${surface === s ? 'active' : ''}`}
                >
                  {SURFACE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#kontakt" className="btn-primary">
            Muster anfragen
          </a>
          <a href="#kalkulator" className="btn-ghost">
            Mengen berechnen
          </a>
        </motion.div>
      </div>
    </section>
  );
}
