'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { PANO_NODES, PANO_START } from '@/data/pano';

const PanoScene = dynamic(() => import('@/components/three/PanoScene'), { ssr: false });

/** Full-screen 360° walk-through: drag to look around, arrows to move between rooms. */
export default function PanoTour() {
  const ref = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(PANO_START);
  const [mounted, setMounted] = useState(false);

  // only run WebGL while the tour is near the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => setMounted(e.isIntersecting)), {
      rootMargin: '400px 0px',
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const node = PANO_NODES[current];
  const rooms = Object.entries(PANO_NODES);

  return (
    <section
      id="rundgang-360"
      ref={ref}
      aria-label="360° Rundgang durch die Villa"
      style={{ position: 'relative', height: '100svh', background: '#0d0f14', cursor: 'grab' }}
    >
      {mounted && (
        <Canvas camera={{ fov: 72, near: 0.01, far: 200, position: [0, 0, 0.1] }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <PanoScene nodes={PANO_NODES} current={current} onWalk={setCurrent} />
          </Suspense>
        </Canvas>
      )}

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(to bottom, rgba(10,11,15,0.55) 0%, rgba(10,11,15,0) 22%), linear-gradient(to top, rgba(10,11,15,0.6) 0%, rgba(10,11,15,0) 30%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 'clamp(1.5rem, 6vw, 5rem)',
          top: 'clamp(5rem, 12vh, 7rem)',
          pointerEvents: 'none',
          maxWidth: '26rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.8rem' }}>
          <span style={{ width: '2.4rem', height: '1px', background: '#c9a166', display: 'block' }} />
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.8)' }}>
            Rundgang 360°
          </p>
        </div>
        <h2 className="font-serif" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)', fontWeight: 300, color: '#efe6d7', lineHeight: 1.1 }}>
          {node.title}
        </h2>
      </div>

      {rooms.length > 1 && (
        <nav
          aria-label="Räume"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '1.6rem',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0 1rem',
          }}
        >
          {rooms.map(([id, r]) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrent(id)}
              aria-pressed={id === current}
              className={`segment-btn pano-room${id === current ? ' active' : ''}`}
            >
              {r.title}
            </button>
          ))}
        </nav>
      )}

      <p
        style={{
          position: 'absolute',
          right: 'clamp(1.5rem, 6vw, 5rem)',
          top: 'clamp(5.2rem, 12vh, 7.2rem)',
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(239,230,215,0.6)',
          pointerEvents: 'none',
        }}
      >
        Ziehen zum Umsehen
      </p>
    </section>
  );
}
