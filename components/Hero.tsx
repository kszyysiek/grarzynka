'use client';

import { motion } from 'framer-motion';

const LINE = {
  hidden: { y: '112%' },
  visible: (d: number) => ({
    y: '0%',
    transition: { delay: d, duration: 1.05, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const STATS = [
  { value: '03', unit: '', label: 'Formate — 90 · 30 · 15 mm' },
  { value: '4', unit: 'mm', label: 'Integrierter Justierweg' },
  { value: '100', unit: '%', label: 'Entwickelt & gefertigt in Deutschland' },
];

const CREAM = '#efe6d7';
const CREAM_DIM = 'rgba(239,230,215,0.72)';
const CREAM_DIMMER = 'rgba(239,230,215,0.45)';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-end overflow-hidden"
      style={{ minHeight: '100svh', background: '#1a1c22' }}
    >
      {/* Photoreal render — full bleed */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/renders/penthouse-night.jpg"
        alt="KANELO Lamellenwand mit integrierter LED-Lichtfuge auf einer Penthouse-Terrasse bei Dämmerung"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '38% center' }}
        fetchPriority="high"
      />

      {/* Cinematic grading */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(100deg, rgba(16,15,17,0.82) 0%, rgba(16,15,17,0.45) 30%, rgba(16,15,17,0.05) 55%, rgba(16,15,17,0) 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '55%',
          background:
            'linear-gradient(to bottom, rgba(16,15,17,0) 0%, rgba(16,15,17,0.55) 60%, rgba(16,15,17,0.82) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: '20%',
          background: 'linear-gradient(to top, rgba(16,15,17,0) 0%, rgba(16,15,17,0.45) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-wide relative z-10 pointer-events-none" style={{ paddingBottom: '5.5rem' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.35, duration: 0.6 }}
          className="mb-7 flex items-center gap-4"
        >
          <span style={{ width: '3rem', height: '1px', background: '#c9a166', display: 'block' }} />
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: CREAM_DIM,
              fontWeight: 400,
            }}
          >
            Modulares Lamellensystem · Aluminiumguss
          </p>
        </motion.div>

        <h1 className="display-xl" style={{ maxWidth: '13ch', color: CREAM }}>
          <span className="block overflow-hidden">
            <motion.span className="block" variants={LINE} initial="hidden" animate="visible" custom={2.45}>
              Die Kunst
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span className="block" variants={LINE} initial="hidden" animate="visible" custom={2.58}>
              der{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  backgroundImage: 'linear-gradient(120deg, #e8c68e 0%, #b98f57 70%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Gliederung.
              </em>
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.9 }}
          className="mt-7 max-w-md"
          style={{ fontSize: '1.02rem', color: CREAM_DIM, lineHeight: 1.8, fontWeight: 300 }}
        >
          Ein Fassadensystem für Architektur,
          die nicht laut sein muss, um gesehen zu werden.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.25, duration: 0.8 }}
          className="mt-10 flex flex-wrap gap-4 pointer-events-auto"
        >
          <a
            href="#kontakt"
            className="btn-primary"
            style={{ background: '#c9a166', borderColor: '#c9a166', color: '#1a1712' }}
          >
            Muster anfragen <span className="btn-arrow">→</span>
          </a>
          <a
            href="#rundgang"
            className="btn-ghost"
            style={{ borderColor: 'rgba(239,230,215,0.35)', color: CREAM }}
          >
            Virtueller Rundgang
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.9 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 max-w-2xl"
          style={{ borderTop: '1px solid rgba(239,230,215,0.22)' }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="py-5 pr-8"
              style={{
                borderLeft: i > 0 ? '1px solid rgba(239,230,215,0.14)' : 'none',
                paddingLeft: i > 0 ? '1.75rem' : 0,
              }}
            >
              <div className="flex items-baseline gap-1">
                <span
                  className="font-serif"
                  style={{ fontSize: '2.4rem', fontWeight: 300, color: CREAM, lineHeight: 1 }}
                >
                  {s.value}
                </span>
                {s.unit && (
                  <span
                    className="font-serif"
                    style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#c9a166' }}
                  >
                    {s.unit}
                  </span>
                )}
              </div>
              <p
                style={{
                  marginTop: '0.5rem',
                  fontSize: '0.66rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: CREAM_DIMMER,
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.7, duration: 1 }}
        className="absolute bottom-8 right-8 flex-col items-center gap-3 z-10 hidden md:flex"
        aria-hidden="true"
      >
        <span
          style={{
            fontSize: '0.6rem',
            writingMode: 'vertical-rl',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: CREAM_DIMMER,
          }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ width: '1px', height: '40px', background: '#c9a166', opacity: 0.6 }}
        />
      </motion.div>
    </section>
  );
}
