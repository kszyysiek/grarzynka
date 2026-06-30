'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const FORMATS = [
  {
    name: 'Largo',
    mm: 90,
    label: '90 mm',
    desc: 'Ruhig, monumental. Für Fassaden, die durch Masse und Stille wirken.',
    relWidth: 6,
  },
  {
    name: 'Mezzo',
    mm: 30,
    label: '30 mm',
    desc: 'Ausgewogen. Die klassische Proportion für Wohnbau und Gewerbe.',
    relWidth: 2,
  },
  {
    name: 'Fine',
    mm: 15,
    label: '15 mm',
    desc: 'Filigran. Erzeugt eine textile Oberfläche mit hoher Dichte.',
    relWidth: 1,
  },
];

const RHYTHM_PATTERN = [6, 2, 1, 2, 6, 2, 1, 6, 1, 2, 6];
const GAP = 0.5;

export default function Formate() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [active, setActive] = useState<number | null>(null);

  const totalUnits =
    RHYTHM_PATTERN.reduce((s, u) => s + u, 0) +
    (RHYTHM_PATTERN.length - 1) * GAP;

  return (
    <section
      id="formate"
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
          className="mb-16"
        >
          <p className="chapter-num mb-3">II. — Formate</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            Drei Tiefen.{' '}
            <em style={{ color: 'var(--color-accent)' }}>Ein Rhythmus.</em>
          </h2>
          <p
            className="mt-5 max-w-xl"
            style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}
          >
            Drei präzise definierte Formate — 90, 30 und 15 Millimeter — frei
            kombinierbar wie Takte einer Partitur.
          </p>
        </motion.div>

        {/* Fin visualisation — three columns, proportional widths */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div
            className="flex gap-2 overflow-hidden"
            style={{ height: 'clamp(200px, 30vw, 340px)' }}
            aria-label="Proportionsvergleich der drei Formate"
          >
            {FORMATS.map((fmt, i) => (
              <motion.div
                key={fmt.name}
                style={{
                  flex: fmt.relWidth,
                  background:
                    active === i
                      ? 'linear-gradient(180deg, #4a4238 0%, #2a2520 40%, #1a1612 100%)'
                      : 'linear-gradient(180deg, #302820 0%, #1e1a16 40%, #100e0c 100%)',
                  borderTop: `1px solid ${active === i ? 'var(--color-accent)' : 'rgba(212,180,131,0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => setActive(active === i ? null : i)}
                whileHover={{ scaleY: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Highlight stripe */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '30%',
                    width: '20%',
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  }}
                />
                {/* Label at bottom */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    className="font-serif"
                    style={{
                      fontSize: '0.7rem',
                      color: active === i ? 'var(--color-accent)' : 'var(--color-text-dimmer)',
                      letterSpacing: '0.15em',
                      fontStyle: 'italic',
                    }}
                  >
                    {fmt.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Format cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--color-hairline)' }}>
          {FORMATS.map((fmt, i) => (
            <motion.div
              key={fmt.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
              className="p-8"
              style={{
                background: 'var(--color-surface)',
                cursor: 'pointer',
                borderTop: active === i ? `2px solid var(--color-accent)` : '2px solid transparent',
                transition: 'border-color 0.3s',
              }}
              onClick={() => setActive(active === i ? null : i)}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  className="font-serif"
                  style={{ fontSize: '2.2rem', fontWeight: 300, color: 'var(--color-accent)' }}
                >
                  {fmt.mm}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-dimmer)', letterSpacing: '0.1em' }}>
                  mm
                </span>
              </div>
              <p
                className="font-serif"
                style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--color-text)', marginBottom: '0.75rem' }}
              >
                {fmt.name}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', lineHeight: 1.7 }}>
                {fmt.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Rhythm visualisation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 pt-10"
          style={{ borderTop: '1px solid var(--color-hairline)' }}
        >
          <p className="eyebrow mb-6" style={{ fontSize: '0.65rem' }}>
            Rhythmus · 90 · 30 · 15 · Beispiel
          </p>
          <div
            className="flex overflow-hidden"
            style={{ height: '60px', gap: `${GAP / totalUnits * 100}%` }}
            aria-label="Rhythmus-Beispiel"
          >
            {RHYTHM_PATTERN.map((u, i) => (
              <div
                key={i}
                style={{
                  flex: u,
                  background: `linear-gradient(to bottom, #383028, #1e1a16)`,
                  borderTop: '1px solid rgba(212,180,131,0.25)',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.68rem', color: 'var(--color-text-dimmer)', fontStyle: 'italic' }}>
            Freie Komposition — schematisch, nicht maßstäblich
          </p>
        </motion.div>
      </div>
    </section>
  );
}
