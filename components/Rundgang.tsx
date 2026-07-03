'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import FacadeView from '@/components/three/FacadeView';

const VIEWS = [
  { label: 'Empfang', desc: 'Blick durch die Halle' },
  { label: 'Galeriewand', desc: 'Lamellen-Feature­wand' },
  { label: 'Lounge', desc: 'Aufenthaltsbereich' },
];

export default function Rundgang() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const [view, setView] = useState(0);

  return (
    <section
      id="rundgang"
      className="section-pad"
      style={{ background: 'var(--color-surface)' }}
      ref={ref}
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
            <p className="chapter-num mb-3">VIII. — Virtueller Rundgang</p>
            <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
            <h2 className="display-lg text-ivory">
              Treten Sie{' '}
              <em style={{ color: 'var(--color-accent)' }}>ein.</em>
            </h2>
          </div>
          <p
            className="max-w-sm"
            style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}
          >
            Ein begehbarer Eindruck: Empfang, Galeriewand und Lounge — vollständig
            mit KANELO-Lamellen an Wand und Decke gestaltet. Ziehen Sie, um sich
            umzusehen.
          </p>
        </motion.div>

        {/* 3D interior */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="frame-ticks"
          style={{
            position: 'relative',
            height: 'clamp(420px, 58vw, 720px)',
            border: '1px solid var(--color-hairline)',
            overflow: 'hidden',
            background: '#1c1813',
          }}
        >
          <FacadeView kind="interior" viewIndex={view} />

          {/* View presets — floating bottom-left */}
          <div
            style={{
              position: 'absolute',
              left: '1rem',
              bottom: '1rem',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            {VIEWS.map((v, i) => (
              <button
                key={v.label}
                onClick={() => setView(i)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.1rem',
                  padding: '0.55rem 0.95rem',
                  background: view === i ? 'rgba(255,246,232,0.95)' : 'rgba(28,24,19,0.55)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${view === i ? '#caa46d' : 'rgba(255,246,232,0.2)'}`,
                  color: view === i ? '#2c2620' : 'rgba(255,246,232,0.85)',
                  cursor: 'pointer',
                  transition: 'all 0.35s ease',
                  minWidth: '92px',
                }}
              >
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {String(i + 1).padStart(2, '0')} · {v.label}
                </span>
                <span style={{ fontSize: '0.58rem', opacity: 0.7 }}>{v.desc}</span>
              </button>
            ))}
          </div>

          {/* Hint */}
          <p
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1.25rem',
              fontSize: '0.6rem',
              color: 'rgba(255,246,232,0.6)',
              fontStyle: 'italic',
              pointerEvents: 'none',
            }}
          >
            Ziehen zum Umsehen · Scrollen zum Zoomen
          </p>
        </motion.div>

        <p
          style={{ marginTop: '0.85rem', fontSize: '0.62rem', color: 'var(--color-text-dimmer)', fontStyle: 'italic' }}
        >
          Innenraum-Studie — Visualisierung, schematisch. Reale Projektaufnahmen folgen.
        </p>
      </div>
    </section>
  );
}
