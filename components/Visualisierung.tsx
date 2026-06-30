'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

type Composition = 'largo' | 'mezzo' | 'fine' | 'rhythmus';
type Gap = 'schmal' | 'klassisch' | 'offen';
type Time = 'tag' | 'nacht';

const COMPOSITIONS: Record<Composition, number[]> = {
  largo: [90],
  mezzo: [30],
  fine: [15],
  rhythmus: [90, 30, 15],
};

const GAPS: Record<Gap, number> = {
  schmal: 10,
  klassisch: 30,
  offen: 55,
};

const COMP_LABELS: Record<Composition, string> = {
  largo: 'Largo (90)',
  mezzo: 'Mezzo (30)',
  fine: 'Fine (15)',
  rhythmus: 'Rhythmus (90·30·15)',
};

const GAP_LABELS: Record<Gap, string> = {
  schmal: 'Schmal',
  klassisch: 'Klassisch',
  offen: 'Offen',
};

export default function Visualisierung() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' });

  const [comp, setComp] = useState<Composition>('rhythmus');
  const [gapKey, setGapKey] = useState<Gap>('klassisch');
  const [time, setTime] = useState<Time>('tag');
  const nightT = useRef(0); // 0=day, 1=night — animated
  const animRef = useRef<number>(0);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const t = nightT.current; // 0=day, 1=night

    // Background
    const bgL = lerp(0x0c, 0x02, t);
    const bgColor = `rgb(${bgL},${Math.round(bgL * 0.83)},${Math.round(bgL * 0.7)})`;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, W, H);

    // Scale factor — show ~10-14 fins across width
    const finWidths = COMPOSITIONS[comp];
    const gapMm = GAPS[gapKey];
    const pitchMm = finWidths.reduce((s, w) => s + w, 0) + gapMm * finWidths.length;
    const targetPitchPx = W / 11;
    const scale = targetPitchPx / pitchMm;

    // Build repeating pattern
    const scaledPattern = finWidths.map((w) => w * scale);
    const scaledGap = gapMm * scale;
    const patternWidth = scaledPattern.reduce((s, w) => s + w, 0) + scaledGap * scaledPattern.length;

    let x = 0;
    let pi = 0; // pattern index within one repeat

    while (x < W + 100) {
      const fw = scaledPattern[pi % scaledPattern.length];

      // === Draw fin ===
      if (x + fw > 0) {
        // Aluminium gradient — day: silver/warm; night: very dark
        const dayL0 = 0.25, dayL1 = 0.7, dayL2 = 0.45;
        const nightL0 = 0.07, nightL1 = 0.14, nightL2 = 0.09;

        const gf = ctx.createLinearGradient(x, 0, x + fw, 0);
        gf.addColorStop(0, rgbAlum(lerp(dayL0, nightL0, t)));
        gf.addColorStop(0.2, rgbAlum(lerp(dayL1, nightL1, t)));
        gf.addColorStop(0.55, rgbAlum(lerp(dayL2 + 0.1, nightL2, t)));
        gf.addColorStop(0.8, rgbAlum(lerp(dayL1 - 0.1, nightL1 * 0.8, t)));
        gf.addColorStop(1, rgbAlum(lerp(dayL0, nightL0 * 0.7, t)));
        ctx.fillStyle = gf;
        ctx.fillRect(x, 0, fw, H);

        // Top-edge highlight
        ctx.fillStyle = `rgba(255,255,255,${lerp(0.08, 0.02, t)})`;
        ctx.fillRect(x, 0, fw, 1);

        // Subtle left-shadow
        const shad = ctx.createLinearGradient(x, 0, x + Math.min(fw * 0.12, 8), 0);
        shad.addColorStop(0, `rgba(0,0,0,${lerp(0.25, 0.4, t)})`);
        shad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shad;
        ctx.fillRect(x, 0, Math.min(fw * 0.12, 8), H);
      }

      x += fw;

      // === Draw gap ===
      if (scaledGap > 0.5) {
        if (t > 0.01) {
          // LED glow
          const intensity = t;
          const cx = x + scaledGap / 2;

          // Core light line
          const coreW = Math.max(scaledGap * 0.4, 2);
          const cg = ctx.createLinearGradient(x, 0, x + scaledGap, 0);
          cg.addColorStop(0, `rgba(0,0,0,0)`);
          cg.addColorStop(0.3, `rgba(240,200,110,${0.85 * intensity})`);
          cg.addColorStop(0.5, `rgba(255,220,140,${intensity})`);
          cg.addColorStop(0.7, `rgba(240,200,110,${0.85 * intensity})`);
          cg.addColorStop(1, `rgba(0,0,0,0)`);
          ctx.fillStyle = cg;
          ctx.fillRect(x, 0, scaledGap, H);

          // Bloom on fins
          const bloom = scaledGap * 2.5;
          const bg = ctx.createRadialGradient(cx, H * 0.5, 0, cx, H * 0.5, bloom);
          bg.addColorStop(0, `rgba(220,170,80,${0.18 * intensity})`);
          bg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = bg;
          ctx.fillRect(x - bloom, 0, scaledGap + bloom * 2, H);
        } else {
          // Day shadow gap
          const dg = ctx.createLinearGradient(x, 0, x + scaledGap, 0);
          dg.addColorStop(0, 'rgba(0,0,0,0.55)');
          dg.addColorStop(0.35, 'rgba(0,0,0,0.85)');
          dg.addColorStop(0.65, 'rgba(0,0,0,0.85)');
          dg.addColorStop(1, 'rgba(0,0,0,0.55)');
          ctx.fillStyle = dg;
          ctx.fillRect(x, 0, scaledGap, H);
        }
      }

      x += scaledGap;
      pi++;
    }

    // Subtle vignette
    const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, W * 0.85);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }, [comp, gapKey]);

  // Animate night transition
  useEffect(() => {
    const target = time === 'nacht' ? 1 : 0;
    cancelAnimationFrame(animRef.current);
    const step = () => {
      const cur = nightT.current;
      const diff = target - cur;
      if (Math.abs(diff) < 0.005) {
        nightT.current = target;
        render();
        return;
      }
      nightT.current += diff * 0.06;
      render();
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [time, render]);

  // Redraw on composition/gap change
  useEffect(() => {
    render();
  }, [render]);

  // Resize handler
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      render();
    };
    resize();
    const obs = new ResizeObserver(resize);
    obs.observe(canvas);
    return () => obs.disconnect();
  }, [render]);

  return (
    <section
      id="visualisierung"
      className="section-pad"
      style={{ background: 'var(--color-base)' }}
      ref={sectionRef}
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="chapter-num mb-3">VI. — Visualisierung</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            Erleben Sie das System{' '}
            <em style={{ color: 'var(--color-accent)' }}>im Rhythmus.</em>
          </h2>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-8 items-start"
        >
          {/* Composition */}
          <div>
            <p className="eyebrow mb-3" style={{ fontSize: '0.62rem' }}>
              Komposition / Rhythmus
            </p>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(COMPOSITIONS) as Composition[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setComp(c)}
                  className={`segment-btn ${comp === c ? 'active' : ''}`}
                >
                  {COMP_LABELS[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Gap */}
          <div>
            <p className="eyebrow mb-3" style={{ fontSize: '0.62rem' }}>
              Fugenbreite
            </p>
            <div className="flex gap-1">
              {(Object.keys(GAPS) as Gap[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGapKey(g)}
                  className={`segment-btn ${gapKey === g ? 'active' : ''}`}
                >
                  {GAP_LABELS[g]}
                </button>
              ))}
            </div>
          </div>

          {/* Time of day */}
          <div>
            <p className="eyebrow mb-3" style={{ fontSize: '0.62rem' }}>
              Tageszeit
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setTime('tag')}
                className={`segment-btn ${time === 'tag' ? 'active' : ''}`}
              >
                Tag
              </button>
              <button
                onClick={() => setTime('nacht')}
                className={`segment-btn ${time === 'nacht' ? 'active' : ''}`}
              >
                Nacht · LED
              </button>
            </div>
          </div>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            position: 'relative',
            height: 'clamp(300px, 40vw, 560px)',
            border: '1px solid var(--color-hairline)',
            overflow: 'hidden',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
            aria-label="Interaktive Fassadenvisualisierung"
          />
          {/* Caption overlay */}
          <p
            style={{
              position: 'absolute',
              bottom: '0.875rem',
              left: '1rem',
              fontSize: '0.6rem',
              color: 'rgba(239,233,221,0.3)',
              fontStyle: 'italic',
              pointerEvents: 'none',
            }}
          >
            Visualisierung — schematisch
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <a href="#kontakt" className="btn-primary">
            Muster anfragen
          </a>
          <a href="#kalkulator" className="btn-ghost">
            Mengen berechnen
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function rgbAlum(brightness: number): string {
  const b = Math.round(Math.max(0, Math.min(1, brightness)) * 255);
  const warm = Math.round(b * 0.92);
  const cool = Math.round(b * 0.82);
  return `rgb(${b},${warm},${cool})`;
}
