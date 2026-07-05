'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FACTS = [
  { label: 'Werkstoff', value: 'Aluminiumguss' },
  { label: 'Verfahren', value: 'Guss — nicht Extrusion' },
  { label: 'Verbindung', value: 'Formschlüssige Pressverbindung' },
  { label: 'Fertigung', value: 'Deutschland' },
];

export default function Material() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="material"
      className="section-pad"
      style={{ background: 'var(--color-base)' }}
      ref={ref}
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="chapter-num mb-3">IV. — Material & Fertigung</p>
            <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
            <h2 className="display-lg text-ivory">
              Gegossen,{' '}
              <em style={{ color: 'var(--color-accent)' }}>nicht gezogen.</em>
            </h2>
            <p
              className="mt-6"
              style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}
            >
              Aluminiumguss bildet Hinterschnitte und tragende Geometrien exakt ab —
              die Grundlage einer Verbindung, die hält, weil sie passt.
            </p>
            <p
              className="mt-4"
              style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}
            >
              Strangpressprofile können diese Verbindungsgeometrie nicht realisieren.
              Der Entscheid für den Guss ist kein Kompromiss, sondern eine konsequente
              Materialentscheidung im Dienst der Funktion.
            </p>

            {/* Material facts */}
            <div className="mt-10">
              {FACTS.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 * (i + 1), duration: 0.5 }}
                  className="flex items-baseline gap-6 py-3"
                  style={{ borderBottom: '1px solid var(--color-hairline)' }}
                >
                  <span
                    style={{
                      minWidth: '120px',
                      fontSize: '0.72rem',
                      color: 'var(--color-text-dimmer)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {f.label}
                  </span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
                    {f.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: rendered profile study — real cross-sections from above */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative frame-ticks"
            style={{ minHeight: '380px' }}
          >
            <div
              style={{
                border: '1px solid var(--color-hairline)',
                background: '#171310',
                height: '100%',
                minHeight: '380px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/renders/gallery/detail.jpg"
                alt="Profilstudie: gegossene KANELO Lamellenprofile von oben — offene Querschnitte mit Verbindungsgeometrie"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Caption */}
              <p
                style={{
                  position: 'absolute',
                  bottom: '1.1rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  fontSize: '0.62rem',
                  color: 'rgba(239,230,215,0.55)',
                  fontStyle: 'italic',
                }}
              >
                Profilstudie — Querschnitte im Guss. Hinterschnitte und Verbindungsgeometrie,
                die eine Extrusion nicht leisten kann.
              </p>

              {/* Decorative hairline corner */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '24px',
                  height: '24px',
                  borderTop: '1px solid var(--color-accent)',
                  borderRight: '1px solid var(--color-accent)',
                  opacity: 0.4,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  width: '24px',
                  height: '24px',
                  borderBottom: '1px solid var(--color-accent)',
                  borderLeft: '1px solid var(--color-accent)',
                  opacity: 0.4,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
