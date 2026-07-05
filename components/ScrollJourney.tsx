'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';
import { Suspense } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const JourneyScene = dynamic(() => import('@/components/three/JourneyScene'), { ssr: false });

const STATIONS = [
  {
    at: 0.06,
    eyebrow: 'Station 01 · Die Einfriedung',
    title: 'Der erste Eindruck.',
    text: 'Die Grundstückseinfriedung im Lamellenraster — dasselbe Profil, das später die Fassade gliedert.',
  },
  {
    at: 0.3,
    eyebrow: 'Station 02 · Der Eintritt',
    title: 'Licht führt zur Tür.',
    text: 'Lamellenpaneele fassen den Eingang, LED-Fugen zeichnen warme Linien in die Dämmerung.',
  },
  {
    at: 0.58,
    eyebrow: 'Station 03 · Pool & Bar',
    title: 'Der Garten als Bühne.',
    text: 'Die Poolbar trägt dieselbe Haut wie das Haus — ein System, innen wie außen, bis ans Wasser.',
  },
  {
    at: 0.9,
    eyebrow: 'Station 04 · Innenraum',
    title: 'Farbe, wenn Sie wollen.',
    text: 'Die Wohnwand in farbig eloxierten Tönen, seitlich gefasst von einer LED-Lichtlinie.',
  },
];

export default function ScrollJourney() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let a = 0;
    STATIONS.forEach((s, i) => {
      if (v >= s.at - 0.12) a = i;
    });
    setActive(a);
  });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={wrapRef} aria-label="Virtuelle Reise um ein Haus mit KANELO System" style={{ height: '520vh', position: 'relative', background: '#151a24' }}>
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        {mounted && (
          <Canvas
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.14,
              powerPreference: 'high-performance',
            }}
            camera={{ fov: 42, near: 0.1, far: 400, position: [6, 6.5, 66] }}
          >
            <Suspense fallback={null}>
              <JourneyScene progress={scrollYProgress} />
              <EffectComposer multisampling={0}>
                <Bloom intensity={1.0} luminanceThreshold={0.42} luminanceSmoothing={0.4} mipmapBlur />
                <Vignette eskil={false} offset={0.22} darkness={0.72} />
                <SMAA />
              </EffectComposer>
            </Suspense>
          </Canvas>
        )}

        {/* Header line */}
        <div
          style={{ position: 'absolute', top: '4.5rem', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}
        >
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.55)' }}>
            Eine Reise · Ein System
          </p>
        </div>

        {/* Station captions */}
        {STATIONS.map((s, i) => (
          <StationCaption key={s.eyebrow} station={s} index={i} progress={scrollYProgress} />
        ))}

        {/* Progress rail */}
        <div
          style={{
            position: 'absolute',
            right: '1.6rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {STATIONS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === active ? '10px' : '6px',
                height: i === active ? '10px' : '6px',
                borderRadius: '50%',
                background: i === active ? '#e8c68e' : 'rgba(239,230,215,0.3)',
                transition: 'all 0.4s ease',
                marginLeft: i === active ? 0 : '2px',
              }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <p
          style={{
            position: 'absolute',
            bottom: '1.2rem',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '0.6rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(239,230,215,0.4)',
            pointerEvents: 'none',
          }}
        >
          Weiterscrollen — die Kamera folgt · Visualisierung schematisch
        </p>
      </div>
    </section>
  );
}

function StationCaption({
  station,
  index,
  progress,
}: {
  station: (typeof STATIONS)[number];
  index: number;
  progress: any;
}) {
  const { at } = station;
  const opacity = useTransform(progress, [at - 0.1, at - 0.03, at + 0.09, at + 0.16], [0, 1, 1, 0]);
  const y = useTransform(progress, [at - 0.1, at - 0.03], [24, 0]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 'clamp(1.5rem, 6vw, 5rem)',
        bottom: 'clamp(4.5rem, 12vh, 8rem)',
        maxWidth: '26rem',
        opacity,
        y,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem' }}>
        <span style={{ width: '2.4rem', height: '1px', background: '#c9a166', display: 'block' }} />
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.7)' }}>
          {station.eyebrow}
        </p>
      </div>
      <h3
        className="font-serif"
        style={{ fontSize: 'clamp(1.7rem, 3.6vw, 2.6rem)', fontWeight: 300, color: '#efe6d7', lineHeight: 1.12 }}
      >
        {station.title}
      </h3>
      <p style={{ marginTop: '0.7rem', fontSize: '0.85rem', color: 'rgba(239,230,215,0.62)', lineHeight: 1.7 }}>
        {station.text}
      </p>
    </motion.div>
  );
}
