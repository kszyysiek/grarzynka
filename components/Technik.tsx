'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SPEC_SECTIONS, DOWNLOADS } from '@/data/specs';

export default function Technik() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <section
      id="technik"
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
          className="mb-14"
        >
          <p className="chapter-num mb-3">XI. — Technik</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            Technische{' '}
            <em style={{ color: 'var(--color-accent)' }}>Daten.</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Spec table — 2 columns wide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {SPEC_SECTIONS.map((section, si) => (
              <div key={section.title} style={{ marginBottom: '2.5rem' }}>
                <p
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    marginBottom: '0.875rem',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontStyle: 'italic',
                  }}
                >
                  {section.title}
                </p>
                <table className="spec-table">
                  <tbody>
                    {section.rows.map((row, ri) => (
                      <motion.tr
                        key={row.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.05 * (si * 4 + ri) }}
                      >
                        <td>{row.label}</td>
                        <td>{row.value}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {/* Note */}
            <p
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-dimmer)',
                fontStyle: 'italic',
                borderTop: '1px solid var(--color-hairline)',
                paddingTop: '1rem',
                marginTop: '1rem',
                lineHeight: 1.7,
              }}
            >
              Alle Angaben beziehen sich auf das KANELO Systemkonzept im aktuellen
              Entwicklungsstand. Weiterführende technische Daten, Zulassungen und
              Prüfergebnisse werden nach Abschluss der Zertifizierungsverfahren
              veröffentlicht.
            </p>
          </motion.div>

          {/* Downloads sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p
              className="eyebrow mb-6"
              style={{ fontSize: '0.62rem', borderBottom: '1px solid var(--color-hairline)', paddingBottom: '0.75rem' }}
            >
              Downloads & Dokumente
            </p>
            <div className="flex flex-col gap-3">
              {DOWNLOADS.map((dl) => (
                <div
                  key={dl.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.875rem',
                    border: '1px solid var(--color-hairline)',
                    opacity: dl.available ? 1 : 0.5,
                    cursor: dl.available ? 'pointer' : 'default',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '28px',
                      height: '32px',
                      border: '1px solid var(--color-hairline)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '0.55rem', color: 'var(--color-accent)' }}>PDF</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text)', lineHeight: 1.4 }}>
                      {dl.label}
                    </p>
                    {!dl.available && (
                      <p style={{ fontSize: '0.6rem', color: 'var(--color-text-dimmer)', marginTop: '0.15rem' }}>
                        In Vorbereitung
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.25rem',
                border: '1px solid var(--color-hairline)',
                background: 'rgba(212,180,131,0.04)',
              }}
            >
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
                Technische Unterlagen auf Anfrage — für Architekten und Planer.
              </p>
              <a href="#kontakt" className="btn-ghost" style={{ fontSize: '0.65rem' }}>
                Unterlagen anfordern
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
