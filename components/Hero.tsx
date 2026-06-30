'use client';

import { motion } from 'framer-motion';
import { BRAND } from '@/data/brand';
import FacadeView from '@/components/three/FacadeView';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col justify-end overflow-hidden"
      style={{ minHeight: '100svh', background: 'var(--color-base)' }}
    >
      {/* Immersive 3D façade — full bleed */}
      <div className="absolute inset-0" aria-hidden="true">
        <FacadeView
          variant="hero"
          eager
          pattern={[90, 30, 15]}
          gap={30}
          night={false}
          surface="anodisiert"
        />
      </div>

      {/* Cinematic gradient grading for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, rgba(12,10,9,0.92) 0%, rgba(12,10,9,0.55) 32%, rgba(12,10,9,0.05) 55%, rgba(12,10,9,0.0) 70%, rgba(12,10,9,0.4) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '45%',
          background:
            'linear-gradient(to bottom, rgba(12,10,9,0) 0%, rgba(12,10,9,0.75) 70%, rgba(12,10,9,1) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-wide relative z-10 pb-24 pointer-events-none">
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
          style={{ textShadow: '0 2px 40px rgba(0,0,0,0.6)' }}
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
          className="mt-6 max-w-xl"
          style={{
            fontSize: '1.05rem',
            color: 'var(--color-text-dim)',
            lineHeight: 1.75,
            fontWeight: 300,
            textShadow: '0 1px 20px rgba(0,0,0,0.7)',
          }}
        >
          Ein Fassadensystem für Architektur,<br />
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
          <a href="#system" className="btn-ghost">
            System entdecken
          </a>
        </motion.div>
      </div>

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
          style={{ width: '1px', height: '40px', background: 'var(--color-accent)', opacity: 0.5 }}
        />
      </motion.div>
    </section>
  );
}
