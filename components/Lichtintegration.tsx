'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import FacadeView from '@/components/three/FacadeView';

export default function Lichtintegration() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [isNight, setIsNight] = useState(true);

  return (
    <section
      id="licht"
      className="section-pad"
      style={{ background: 'var(--color-surface)' }}
      ref={ref}
    >
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
        >
          <div>
            <p className="chapter-num mb-3">VI. — Lichtintegration</p>
            <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
            <h2 className="display-lg text-ivory">
              Nach Dämmerung:{' '}
              <em style={{ color: 'var(--color-accent)' }}>die zweite Fassade.</em>
            </h2>
          </div>
          <p
            className="max-w-sm"
            style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}
          >
            Die Profilgeometrie nimmt LED-Bänder auf und verwandelt die Schattenfuge in
            eine Lichtfuge. Steuerbar in Warmweiß und Farbe.
          </p>
        </motion.div>

        {/* 3D day/night visualisation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative frame-ticks"
          style={{
            height: 'clamp(320px, 44vw, 560px)',
            overflow: 'hidden',
            border: '1px solid var(--color-hairline)',
            background: '#0c0a09',
          }}
        >
          <FacadeView
            variant="config"
            pattern={[90, 30, 15]}
            gap={30}
            night={isNight}
            surface="anodisiert"
          />

          {/* Toggle */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              display: 'flex',
              gap: '0.25rem',
              background: 'rgba(12,10,9,0.55)',
              backdropFilter: 'blur(10px)',
              padding: '0.3rem',
              border: '1px solid var(--color-hairline)',
            }}
          >
            <button
              onClick={() => setIsNight(false)}
              className={`segment-btn ${!isNight ? 'active' : ''}`}
              style={{ border: 'none' }}
            >
              Tag
            </button>
            <button
              onClick={() => setIsNight(true)}
              className={`segment-btn ${isNight ? 'active' : ''}`}
              style={{ border: 'none' }}
            >
              Nacht · LED
            </button>
          </div>

          {/* Caption */}
          <p
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1.25rem',
              fontSize: '0.62rem',
              color: 'rgba(239,233,221,0.4)',
              fontStyle: 'italic',
              pointerEvents: 'none',
            }}
          >
            Schattenfuge wird Lichtfuge — Visualisierung, schematisch
          </p>
        </motion.div>

        {/* Text below */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { title: 'Diskreter Kanal', body: 'Die Profilgeometrie verbirgt das LED-Band vollständig — keine sichtbare Technik.' },
            { title: 'Steuerbar', body: 'Warmweiße Farbtemperaturen und RGB-Farbe nach Wunsch — für jede Lichtstimmung.' },
            { title: 'Tag & Nacht', body: 'Tagsüber: ruhige Schattenfuge. Nach Einbruch der Dunkelheit: präzise Lichtlinie.' },
          ].map((item) => (
            <div
              key={item.title}
              style={{ borderTop: '1px solid var(--color-hairline)', paddingTop: '1.25rem' }}
            >
              <h3
                className="font-serif"
                style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--color-text)', marginBottom: '0.5rem' }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', lineHeight: 1.75 }}>
                {item.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
