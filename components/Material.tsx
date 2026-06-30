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

          {/* Right: visual — abstract cross-section diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative"
            style={{ minHeight: '380px' }}
          >
            {/* Decorative profile representation */}
            <div
              style={{
                border: '1px solid var(--color-hairline)',
                background: 'var(--color-surface)',
                padding: '2.5rem',
                height: '100%',
                minHeight: '380px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Cross-section fins */}
              <div className="flex gap-3 h-full items-stretch" style={{ height: '280px' }}>
                {[90, 30, 15].map((w, i) => (
                  <div
                    key={w}
                    style={{
                      flex: w,
                      background:
                        'linear-gradient(to right, #252018, #403830, #2a2218)',
                      borderTop: '2px solid rgba(212,180,131,0.35)',
                      position: 'relative',
                    }}
                  >
                    {/* Connector geometry on right side */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '-8px',
                        transform: 'translateY(-50%)',
                        width: '8px',
                        height: '20px',
                        background: '#504840',
                        borderRadius: '0 2px 2px 0',
                      }}
                    />
                    {/* Width label */}
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '0.6rem',
                        color: 'var(--color-text-dimmer)',
                        whiteSpace: 'nowrap',
                        fontStyle: 'italic',
                        fontFamily: 'Cormorant Garamond, serif',
                      }}
                    >
                      {w} mm
                    </span>
                  </div>
                ))}
              </div>

              {/* Caption */}
              <p
                style={{
                  position: 'absolute',
                  bottom: '1.25rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  fontSize: '0.62rem',
                  color: 'var(--color-text-dimmer)',
                  fontStyle: 'italic',
                }}
              >
                Profilquerschnitt — schematisch. Hinterschnitte und Verbindungsgeometrie
                durch Gussverfahren realisierbar.
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
