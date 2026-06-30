'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function Lichtintegration() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [isNight, setIsNight] = useState(false);

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
          className="mb-14"
        >
          <p className="chapter-num mb-3">V. — Lichtintegration</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            Nach Dämmerung:{' '}
            <em style={{ color: 'var(--color-accent)' }}>die zweite Fassade.</em>
          </h2>
          <p
            className="mt-5 max-w-xl"
            style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}
          >
            Die Profilgeometrie nimmt LED-Bänder auf und verwandelt die Schattenfuge in
            eine Lichtfuge. Steuerbar in Warmweiß und Farbe.
          </p>
        </motion.div>

        {/* Day/night visualisation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
          style={{ height: 'clamp(260px, 35vw, 480px)', overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => setIsNight(!isNight)}
          role="button"
          aria-label={isNight ? 'Zur Tagesansicht wechseln' : 'Zur Nachtansicht wechseln'}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsNight(!isNight); }}
        >
          {/* Background — transitions night/day */}
          <motion.div
            animate={{ background: isNight ? '#020201' : '#0c0a09' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0 }}
          />

          {/* Fins */}
          <FinDisplay isNight={isNight} />

          {/* Toggle label */}
          <div
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(8px)',
              padding: '0.5rem 0.875rem',
              border: '1px solid var(--color-hairline)',
            }}
          >
            <motion.div
              animate={{ background: isNight ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)' }}
              style={{ width: '6px', height: '6px', borderRadius: '50%' }}
            />
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', letterSpacing: '0.12em' }}>
              {isNight ? 'Nacht · LED' : 'Tag · Klicken zum Wechseln'}
            </span>
          </div>

          {/* Caption */}
          <p
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1.25rem',
              fontSize: '0.62rem',
              color: 'rgba(239,233,221,0.35)',
              fontStyle: 'italic',
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

function FinDisplay({ isNight }: { isNight: boolean }) {
  const FIN_PATTERN = [90, 30, 15, 30, 90, 30, 15, 90, 30, 15, 30, 90];
  const GAP = 16;
  const SCALE = 1.4;

  const fins = FIN_PATTERN.map((w) => w * SCALE);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        gap: `${GAP}px`,
        padding: '0 2rem',
        alignItems: 'stretch',
        overflow: 'hidden',
      }}
    >
      {fins.map((fw, i) => (
        <div key={i} style={{ display: 'flex', gap: 0, flexShrink: 0 }}>
          {/* Gap glow (before each fin except first) */}
          {i > 0 && (
            <motion.div
              animate={{
                background: isNight
                  ? 'radial-gradient(ellipse at center, rgba(240,200,120,0.95) 0%, rgba(212,170,90,0.7) 30%, rgba(180,140,60,0.2) 70%, transparent 100%)'
                  : 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.85), rgba(0,0,0,0.7))',
              }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
              style={{ width: `${GAP}px`, height: '100%', flexShrink: 0 }}
            />
          )}
          {/* Fin */}
          <motion.div
            animate={{
              background: isNight
                ? `linear-gradient(to right, #0e0c0a, #1e1a16, #161210)`
                : `linear-gradient(to right, #505048 0%, #a09888 25%, #c8c0b0 50%, #a09888 75%, #585048 100%)`,
            }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            style={{
              width: `${fw}px`,
              height: '100%',
              flexShrink: 0,
              borderTop: `1px solid ${isNight ? 'rgba(212,180,131,0.08)' : 'rgba(255,255,255,0.15)'}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle highlight streak */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '25%',
                width: '15%',
                background: isNight
                  ? 'transparent'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
              }}
            />
          </motion.div>
        </div>
      ))}
    </div>
  );
}
