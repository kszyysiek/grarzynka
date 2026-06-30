'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BRAND } from '@/data/brand';

const PRINCIPLES = [
  {
    num: 'I.',
    title: 'Formschluss.',
    body: 'Die Verbindung trägt über ihre Geometrie — eine formschlüssige Pressverbindung mit definiertem Endanschlag. Spielfrei. Dauerhaft.',
  },
  {
    num: 'II.',
    title: 'Vier Millimeter Souveränität.',
    body: 'Der integrierte Justierweg gleicht die Realität des Bauens aus, ohne dass die Fassade davon erzählt.',
  },
  {
    num: 'III.',
    title: 'Stille Reserve.',
    body: 'Eine optionale Verschraubung — vorgesehen aus jahrelanger Praxis, sichtbar für niemanden.',
  },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function Philosophie() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  return (
    <section
      id="system"
      className="section-pad"
      style={{ background: 'var(--color-surface)' }}
      ref={ref}
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <p className="chapter-num mb-3">I. — System</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            Drei Prinzipien.<br />
            <em style={{ color: 'var(--color-accent)' }}>Ein System.</em>
          </h2>
        </motion.div>

        {/* Principles grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.num}
              variants={FADE_UP}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ duration: 0.7, delay: 0.15 * (i + 1) }}
              className="relative py-10 md:py-0"
              style={{
                borderTop: '1px solid var(--color-hairline)',
                borderLeft: i > 0 ? '1px solid var(--color-hairline)' : 'none',
                paddingLeft: i > 0 ? '2.5rem' : '0',
                paddingRight: '2.5rem',
              }}
            >
              <span
                className="font-serif text-accent"
                style={{ fontSize: '0.9rem', fontStyle: 'italic', letterSpacing: '0.1em' }}
              >
                {p.num}
              </span>
              <h3
                className="display-md mt-4 mb-5"
                style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: 'var(--color-text)' }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}>
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom text */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 pt-10"
          style={{ borderTop: '1px solid var(--color-hairline)' }}
        >
          <p
            className="max-w-2xl"
            style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}
          >
            {BRAND} ist das Ergebnis konsequenten Denkens in Materialität und Geometrie.
            Aluminiumguss ermöglicht Hinterschnitte und tragende Verbindungsgeometrien, die eine
            Strangpressprofilierung nicht leisten kann — und schafft damit die Grundlage für
            eine Fassadenverbindung, die hält, weil sie passt.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

