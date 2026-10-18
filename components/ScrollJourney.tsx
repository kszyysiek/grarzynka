'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { BRAND } from '@/data/brand';

const JourneyScene = dynamic(() => import('@/components/three/JourneyScene'), { ssr: false });

const STATIONS = [
  {
    at: 0,
    eyebrow: `${BRAND} · Modulares Aluminium-Lamellensystem`,
    title: 'Ein Haus, gekleidet in Linien.',
    text: 'Fassade, Eingang, Wohnraum, Garten — eine Villa, vollständig mit unseren Profilen gestaltet. Scrollen Sie: Der Tag geht, das Licht kommt.',
  },
  {
    at: 0.2,
    eyebrow: 'Station 01 · Licht im Profil',
    title: 'Die Dämmerung zeichnet nach.',
    text: 'Integrierte LED-Profile übernehmen, wenn das Tageslicht geht — die Fassade wird zur Lichtzeichnung.',
  },
  {
    at: 0.35,
    eyebrow: 'Station 02 · Der Eingang',
    title: 'Licht führt zur Tür.',
    text: 'Lamellenpfeiler fassen das Portal, LED-Fugen zeichnen warme Linien in die Nacht.',
  },
  {
    at: 0.48,
    eyebrow: 'Station 03 · Die Halle',
    title: 'Farbe, gesteuert per Pixel.',
    text: 'Eine Wand aus farbig eloxierten Profilen, dazwischen adressierbare SPI-LED-Linien mit laufender Lichtszene.',
  },
  {
    at: 0.61,
    eyebrow: 'Station 04 · Der Salon',
    title: 'Raum, der nach draußen führt.',
    text: 'Medienwand im Profil 90 in dunkler Bronze, lineare Deckenlichter — und eine Glasfront, die sich zum Garten öffnet.',
  },
  {
    at: 0.72,
    eyebrow: 'Station 05 · Pergola Tarasola',
    title: 'Unter der Pergola ins Freie.',
    text: 'Die bioklimatische Pergola von Tarasola verbindet Salon und Terrasse.',
  },
  {
    at: 0.83,
    eyebrow: 'Station 06 · Pool, Bar & Pflanzkübel',
    title: 'Ein System bis ans Wasser.',
    text: 'Bar und Pflanzkübel in unseren Profilen, mit integrierter Beleuchtung — dieselbe Haut wie das Haus.',
  },
  {
    at: 0.96,
    eyebrow: 'Station 07 · Die Einfriedung',
    title: 'Und rundherum: der Zaun.',
    text: 'Dieselben Profile schließen das Grundstück — ein durchgängiges System, vom Tor bis zum Garten.',
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
      if (v >= s.at - 0.06) a = i;
    });
    setActive(a);
  });

  // Keep the WebGL canvas mounted only while the journey is near the viewport —
  // an offscreen RAF loop starves the compositor on weaker GPUs.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => setMounted(e.isIntersecting));
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={wrapRef}
      aria-label={`Virtuelle Reise durch eine Villa mit ${BRAND} System`}
      style={{ height: '1000vh', position: 'relative', background: '#121722' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100svh', overflow: 'hidden' }}>
        {mounted && (
          <Canvas
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.1,
              powerPreference: 'high-performance',
            }}
            camera={{ fov: 42, near: 0.1, far: 500, position: [72, 24, 98] }}
          >
            <Suspense fallback={null}>
              <JourneyScene progress={scrollYProgress} />
            </Suspense>
          </Canvas>
        )}

        {/* legibility grading for the nav and captions */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(to bottom, rgba(12,14,20,0.5) 0%, rgba(12,14,20,0) 18%), linear-gradient(to top, rgba(12,14,20,0.62) 0%, rgba(12,14,20,0) 45%)',
          }}
        />

        {STATIONS.map((s, i) => (
          <StationCaption key={s.eyebrow} station={s} index={i} last={i === STATIONS.length - 1} progress={scrollYProgress} />
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
            color: 'rgba(239,230,215,0.5)',
            pointerEvents: 'none',
          }}
        >
          Scrollen — die Kamera folgt · Visualisierung schematisch
        </p>
      </div>
    </section>
  );
}

function StationCaption({
  station,
  index,
  last,
  progress,
}: {
  station: (typeof STATIONS)[number];
  index: number;
  last: boolean;
  progress: MotionValue<number>;
}) {
  const { at } = station;
  // first caption is visible on load, the last one stays to the end
  const input = index === 0 ? [0, 0.06, 0.1, 0.11] : last ? [at - 0.07, at - 0.02, 1, 1.01] : [at - 0.07, at - 0.02, at + 0.05, at + 0.09];
  const opacity = useTransform(progress, input, [index === 0 ? 1 : 0, 1, last ? 1 : 0, last ? 1 : 0]);
  const y = useTransform(progress, input.slice(0, 2), index === 0 ? [0, 0] : [24, 0]);
  const Heading = index === 0 ? 'h1' : 'h2';

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 'clamp(1.5rem, 6vw, 5rem)',
        right: 'clamp(1.5rem, 6vw, 5rem)',
        bottom: 'clamp(4.5rem, 12vh, 8rem)',
        maxWidth: index === 0 ? '40rem' : '28rem',
        opacity,
        y,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem' }}>
        <span style={{ width: '2.4rem', height: '1px', background: '#c9a166', display: 'block', flexShrink: 0 }} />
        <p style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.78)' }}>
          {station.eyebrow}
        </p>
      </div>
      <Heading
        className={index === 0 ? 'display-xl' : 'font-serif'}
        style={
          index === 0
            ? { color: '#efe6d7', maxWidth: '13ch' }
            : { fontSize: 'clamp(1.7rem, 3.6vw, 2.6rem)', fontWeight: 300, color: '#efe6d7', lineHeight: 1.12 }
        }
      >
        {station.title}
      </Heading>
      <p style={{ marginTop: '0.9rem', fontSize: '0.9rem', color: 'rgba(239,230,215,0.72)', lineHeight: 1.7, maxWidth: '30rem' }}>
        {station.text}
      </p>
    </motion.div>
  );
}
