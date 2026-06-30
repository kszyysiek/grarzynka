'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const APPLICATIONS = [
  {
    num: '01',
    title: 'Außenfassade',
    sub: 'Hinterlüftete Fassade',
    desc: 'Das primäre Anwendungsfeld. Vertikale Aluminiumlamellen auf verdeckter Unterkonstruktion — hinterlüftet, wartungsfreundlich, dauerhaft.',
    detail: 'Kompatibel mit gängigen Fassadenunterkonstruktionen. Systemlösung für Neubau und Sanierung.',
  },
  {
    num: '02',
    title: 'Innenwand',
    sub: 'Wandverkleidung Innen',
    desc: 'Konsequente Formensprache von außen nach innen. Dasselbe System, dieselbe Detailqualität — für Foyers, Showrooms, Wohn- und Hotelräume.',
    detail: 'Leichte Trockenmontage. Demontierbar und flexibel in der Komposition.',
  },
  {
    num: '03',
    title: 'Decke',
    sub: 'Deckenpaneel',
    desc: 'Vertikale Lamellen horizontal umgedacht. Als Deckenverkleidung eingesetzt schaffen sie linearen Rhythmus und ermöglichen integrierte Beleuchtung.',
    detail: 'Besonders wirkungsvoll in Kombination mit LED-Integration. Für Korridore, Lobbys und Repräsentationsräume.',
  },
  {
    num: '04',
    title: 'Objektbau',
    sub: 'Systemlösung',
    desc: 'Für Projekte, in denen Außen und Innen eine gemeinsame Sprache sprechen müssen. KANELO bietet ein übergreifendes System mit einheitlichem Erscheinungsbild.',
    detail: 'Einheitliche Hersteller- und Systemverantwortung. Aus einer Hand.',
  },
];

export default function Anwendung() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  return (
    <section
      id="anwendung"
      className="section-pad"
      style={{ background: 'var(--color-surface)' }}
      ref={ref}
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="chapter-num mb-3">X. — Anwendung</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            Von außen bis{' '}
            <em style={{ color: 'var(--color-accent)' }}>innen.</em>
          </h2>
          <p
            className="mt-5 max-w-xl"
            style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}
          >
            KANELO ist als übergreifendes System konzipiert — mit einheitlicher
            Systemsprache über alle Anwendungsbereiche hinweg.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: 'var(--color-hairline)' }}>
          {APPLICATIONS.map((app, i) => (
            <motion.div
              key={app.num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
              style={{ background: 'var(--color-base)', padding: '2.5rem', position: 'relative' }}
            >
              <span
                className="font-serif"
                style={{
                  fontSize: '3rem',
                  fontWeight: 300,
                  color: 'rgba(212,180,131,0.12)',
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {app.num}
              </span>
              <p
                className="eyebrow mb-3"
                style={{ fontSize: '0.62rem', color: 'var(--color-accent)' }}
              >
                {app.sub}
              </p>
              <h3
                className="font-serif"
                style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--color-text)', marginBottom: '0.875rem' }}
              >
                {app.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                {app.desc}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dimmer)', lineHeight: 1.75 }}>
                {app.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
