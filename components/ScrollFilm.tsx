'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';

/**
 * Camera fly-through scrubbed by scroll: one continuous film (driveway → entrance →
 * hall → salon → terrace). Scroll position maps to video time; the playhead eases
 * toward it every frame so fast scrolling still reads as a smooth camera move.
 * The film is encoded with a short keyframe interval so seeking stays fluid.
 */

const SRC = '/renders/film/przelot.mp4';
const POSTER = '/renders/podroz/02-zmierzch-1920.webp';

const STOPS = [
  { at: 0, eyebrow: 'Die Ankunft', title: 'Licht führt zur Tür.' },
  { at: 0.25, eyebrow: 'Der Eingang', title: 'Holz, Linie, Licht.' },
  { at: 0.5, eyebrow: 'Die Halle', title: 'Ankommen zwischen Lamellen.' },
  { at: 0.75, eyebrow: 'Der Salon', title: 'Raum, der nach draußen führt.' },
  { at: 1, eyebrow: 'Die Terrasse', title: 'Ein System bis ans Wasser.' },
];

export default function ScrollFilm() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const target = useRef(0);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    target.current = v;
  });

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const onMeta = () => setReady(true);
    v.addEventListener('loadedmetadata', onMeta);
    if (v.readyState >= 1) setReady(true);
    let raf = 0;
    const tick = () => {
      if (v.duration && !v.seeking) {
        const want = target.current * (v.duration - 0.05);
        const diff = want - v.currentTime;
        if (Math.abs(diff) > 0.01) v.currentTime = v.currentTime + diff * 0.18;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  return (
    <section
      id="przelot"
      ref={ref}
      aria-label="Kameraflug durch die Villa"
      style={{ height: '600vh', position: 'relative', background: '#0d0f14' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        <video
          ref={video}
          src={SRC}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, rgba(10,11,15,0.5) 0%, rgba(10,11,15,0) 20%), linear-gradient(to top, rgba(10,11,15,0.65) 0%, rgba(10,11,15,0) 40%)',
          }}
        />
        {STOPS.map((s, i) => (
          <Caption key={s.eyebrow} stop={s} first={i === 0} last={i === STOPS.length - 1} progress={scrollYProgress} />
        ))}
        {!ready && (
          <p style={{ position: 'absolute', right: '1.5rem', bottom: '1.2rem', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(239,230,215,0.55)', textTransform: 'uppercase' }}>
            Film wird geladen …
          </p>
        )}
      </div>
    </section>
  );
}

function Caption({
  stop,
  first,
  last,
  progress,
}: {
  stop: (typeof STOPS)[number];
  first: boolean;
  last: boolean;
  progress: MotionValue<number>;
}) {
  const a = stop.at;
  const opacity = useTransform(
    progress,
    first ? [0, 0.08, 0.12] : last ? [0.9, 0.96, 1] : [a - 0.07, a - 0.02, a + 0.05, a + 0.1],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  );
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 'clamp(1.5rem, 6vw, 5rem)',
        bottom: 'clamp(4.5rem, 12vh, 8rem)',
        maxWidth: '30rem',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.8rem' }}>
        <span style={{ width: '2.4rem', height: '1px', background: '#c9a166', display: 'block' }} />
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.82)' }}>
          {stop.eyebrow}
        </p>
      </div>
      <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', fontWeight: 300, color: '#efe6d7', lineHeight: 1.12 }}>
        {stop.title}
      </h2>
    </motion.div>
  );
}
