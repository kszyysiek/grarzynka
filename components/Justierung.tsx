'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const TRAVEL_MM = 4;

export default function Justierung() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [pos, setPos] = useState(0); // 0..1
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      setPos(t);
    },
    []
  );

  const dispMm = (pos * TRAVEL_MM).toFixed(1).replace('.', ',');

  return (
    <section
      id="justierung"
      className="section-pad"
      style={{ background: 'var(--color-surface)' }}
      ref={ref}
    >
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="chapter-num mb-3">III. — Justierung</p>
            <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
            <h2 className="display-lg text-ivory">
              Vier Millimeter,{' '}
              <em style={{ color: 'var(--color-accent)' }}>die alles ausgleichen.</em>
            </h2>
            <p
              className="mt-6"
              style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}
            >
              Kein Bau ist perfekt. Eine Fassade von KANELO wirkt dennoch so.
            </p>
            <p
              className="mt-4"
              style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}
            >
              Der integrierte Justierweg von <strong style={{ color: 'var(--color-text)', fontWeight: 400 }}>4 mm</strong> gleicht
              Untergrundtoleranzen präzise aus. Die Position wird über einen Sägezahnmechanismus
              gehalten — sicher und wiederholbar, ohne Werkzeug.
            </p>
            <div
              className="mt-8 p-5"
              style={{ border: '1px solid var(--color-hairline)', background: 'rgba(212,180,131,0.04)' }}
            >
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-text-dim)',
                  lineHeight: 1.7,
                  letterSpacing: '0.04em',
                }}
              >
                Justierweg · <span style={{ color: 'var(--color-accent)' }}>4 mm</span><br />
                Positionssicherung · Sägezahnmechanismus<br />
                Zusatzbefestigung · Optionale Verschraubung
              </p>
            </div>
          </motion.div>

          {/* Right: interactive demo */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {/* Fin cross-section diagram — drawing-board stage */}
            <div
              className="relative mb-10 frame-ticks"
              style={{ height: '280px', border: '1px solid var(--color-hairline)', background: '#221c15', overflow: 'hidden' }}
            >
              {/* Wall / carrier */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: '40%',
                  background: 'linear-gradient(to left, #171310, #100d0a)',
                  borderLeft: '1px solid rgba(212,180,131,0.3)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '40%',
                  transform: 'translate(0, -50%)',
                  fontSize: '0.6rem',
                  color: 'rgba(239,230,215,0.5)',
                  letterSpacing: '0.14em',
                  writingMode: 'vertical-rl',
                }}
              >
                TRÄGER
              </div>

              {/* The fin — shifts horizontally by pos * 40px */}
              <motion.div
                animate={{ x: pos * 40 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '12%',
                  transform: 'translateY(-50%)',
                  width: '100px',
                  height: '160px',
                  background: 'linear-gradient(to right, #96784e, #d0ab74, #96784e)',
                  borderTop: '1px solid rgba(240,213,164,0.6)',
                  borderBottom: '1px solid rgba(240,213,164,0.25)',
                  boxShadow: '6px 0 16px rgba(0,0,0,0.35)',
                }}
              >
                {/* Connector stub */}
                <div
                  style={{
                    position: 'absolute',
                    right: '-32px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '24px',
                    background: '#a9895b',
                    borderTop: '1px solid rgba(240,213,164,0.5)',
                  }}
                />
              </motion.div>

              {/* Scale ruler */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '12%',
                  width: '80px',
                  height: '16px',
                }}
              >
                <div style={{ width: '100%', height: '1px', background: 'rgba(240,213,164,0.45)' }} />
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <div
                    key={t}
                    style={{
                      position: 'absolute',
                      left: `${t * 100}%`,
                      top: 0,
                      width: '1px',
                      height: t === 0 || t === 1 ? '8px' : '5px',
                      background: 'rgba(240,213,164,0.55)',
                    }}
                  />
                ))}
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '0.58rem',
                    color: 'rgba(239,230,215,0.6)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  4 mm Justierweg
                </span>
              </div>

              {/* Position indicator */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  textAlign: 'right',
                }}
              >
                <span
                  className="font-serif"
                  style={{ fontSize: '1.8rem', fontWeight: 300, color: '#e8c68e', fontVariantNumeric: 'tabular-nums' }}
                >
                  {dispMm}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(239,230,215,0.55)', marginLeft: '0.25rem' }}>
                  mm
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="mb-3">
              <p className="eyebrow mb-4" style={{ fontSize: '0.62rem' }}>
                Justierung interaktiv — Lamelle verschieben
              </p>
              <div
                ref={trackRef}
                className="relative cursor-pointer select-none"
                style={{ height: '32px', display: 'flex', alignItems: 'center' }}
                role="slider"
                tabIndex={0}
                aria-label="Justierweg der Lamelle"
                aria-valuemin={0}
                aria-valuemax={4}
                aria-valuenow={Number((pos * TRAVEL_MM).toFixed(1))}
                aria-valuetext={`${dispMm} Millimeter`}
                onKeyDown={(e) => {
                  const step = 0.5 / TRAVEL_MM; // 0,5 mm per keypress
                  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    setPos((p) => Math.min(1, p + step));
                  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setPos((p) => Math.max(0, p - step));
                  } else if (e.key === 'Home') {
                    e.preventDefault();
                    setPos(0);
                  } else if (e.key === 'End') {
                    e.preventDefault();
                    setPos(1);
                  }
                }}
                onMouseDown={(e) => { setDragging(true); handleMove(e.clientX); }}
                onMouseMove={(e) => { if (dragging) handleMove(e.clientX); }}
                onMouseUp={() => setDragging(false)}
                onMouseLeave={() => setDragging(false)}
                onTouchStart={(e) => { setDragging(true); handleMove(e.touches[0].clientX); }}
                onTouchMove={(e) => { if (dragging) handleMove(e.touches[0].clientX); }}
                onTouchEnd={() => setDragging(false)}
              >
                {/* Track */}
                <div
                  style={{
                    width: '100%',
                    height: '1px',
                    background: 'var(--color-hairline-strong)',
                    position: 'relative',
                  }}
                >
                  {/* Fill */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${pos * 100}%`,
                      background: 'var(--color-accent)',
                    }}
                  />
                </div>
                {/* Thumb */}
                <motion.div
                  style={{
                    position: 'absolute',
                    left: `${pos * 100}%`,
                    transform: 'translate(-50%, 0)',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    border: '2px solid var(--color-base)',
                    cursor: 'grab',
                  }}
                  whileHover={{ scale: 1.2 }}
                />
              </div>
              <div
                className="flex justify-between mt-2"
                style={{ fontSize: '0.6rem', color: 'var(--color-text-dimmer)' }}
              >
                <span>0 mm</span>
                <span>4 mm</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
