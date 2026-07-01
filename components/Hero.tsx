'use client';

import { motion } from 'framer-motion';
import FacadeView from '@/components/three/FacadeView';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-center overflow-hidden"
      style={{
        minHeight: '100svh',
        background: 'linear-gradient(180deg, #e2e9ef 0%, #ebe3d6 60%, #f2ece2 100%)',
      }}
    >
      {/* Rotating 3D building — full bleed */}
      <div className="absolute inset-0" aria-hidden="true">
        <FacadeView kind="building" eager />
      </div>

      {/* Soft grading for text legibility on the left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(100deg, rgba(242,236,226,0.92) 0%, rgba(242,236,226,0.6) 26%, rgba(242,236,226,0.08) 46%, rgba(242,236,226,0) 62%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-wide relative z-10 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3, duration: 0.8 }}
          className="eyebrow mb-6"
        >
          Modulares Lamellensystem · Aluminiumguss
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="display-xl text-ivory"
        >
          Die Kunst der{' '}
          <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>
            Gliederung.
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.9 }}
          className="mt-6 max-w-md"
          style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-dim)',
            lineHeight: 1.75,
            fontWeight: 300,
          }}
        >
          Ein Fassadensystem für Architektur,
          die nicht laut sein muss, um gesehen zu werden.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.8 }}
          className="mt-10 flex flex-wrap gap-4 pointer-events-auto"
        >
          <a href="#kontakt" className="btn-primary">
            Muster anfragen
          </a>
          <a href="#rundgang" className="btn-ghost">
            Virtueller Rundgang
          </a>
        </motion.div>
      </div>

      {/* Caption */}
      <p
        className="absolute bottom-6 left-0 right-0 text-center pointer-events-none"
        style={{ fontSize: '0.6rem', color: 'var(--color-text-dimmer)', fontStyle: 'italic', letterSpacing: '0.08em' }}
      >
        Gebäudestudie mit KANELO-Fassade — Visualisierung, schematisch · Zeiger bewegen
      </p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.4, duration: 1 }}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-3 z-10"
        aria-hidden="true"
      >
        <span
          className="eyebrow"
          style={{ fontSize: '0.6rem', writingMode: 'vertical-rl', letterSpacing: '0.2em' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ width: '1px', height: '40px', background: 'var(--color-accent)', opacity: 0.6 }}
        />
      </motion.div>
    </section>
  );
}
