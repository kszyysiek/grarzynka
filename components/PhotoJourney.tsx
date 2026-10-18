'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { BRAND } from '@/data/brand';

/**
 * Scroll-driven photo journey: each station is a full-screen photograph that the
 * next one slides over like a card coming forward in 3D space. The leaving card
 * recedes (scale down, tilt back, dim) while the arriving one straightens up.
 * Photos live in /public/renders/podroz as <name>-1920.webp / -960.webp.
 */

interface Station {
  img: string;
  alt: string;
  eyebrow: string;
  title: string;
  text: string;
}

const STATIONS: Station[] = [
  {
    img: '01-dzien',
    alt: `Moderne Villa mit schwarzer ${BRAND} Rippenfassade und integrierten LED-Linien bei Tageslicht`,
    eyebrow: `${BRAND} · Modulares Aluminium-Lamellensystem`,
    title: 'Ein Haus, gekleidet in Linien.',
    text: 'Fassade, Eingang, Wohnraum, Garten — eine Villa, durchgängig mit unseren Profilen gestaltet. Scrollen Sie: Der Tag geht, das Licht kommt.',
  },
  {
    img: '02-zmierzch',
    alt: 'Dieselbe Villa zur blauen Stunde, die LED-Linien in der Fassade leuchten',
    eyebrow: 'Station 01 · Licht im Profil',
    title: 'Die Dämmerung zeichnet nach.',
    text: 'Das Licht sitzt im Profil. Wenn der Tag geht, wird die Fassade zur Lichtzeichnung.',
  },
  {
    img: '05-salon',
    alt: 'Großzügiger Wohnraum mit Lamellenwand, Kamin und Blick auf Pergola und Pool',
    eyebrow: 'Station 02 · Der Salon',
    title: 'Raum, der nach draußen führt.',
    text: 'Lamellenwand, lineare Lichtfugen, und eine Glasfront, die sich zum Garten öffnet.',
  },
  {
    img: '07-basen',
    alt: 'Pool mit Pergola, Außenbar und Pflanzkübeln im Lamellenprofil, beleuchtet',
    eyebrow: 'Station 03 · Pool, Bar & Pflanzkübel',
    title: 'Ein System bis ans Wasser.',
    text: 'Bar und Pflanzkübel im selben Profil, mit verborgener LED-Linie — dieselbe Haut wie das Haus.',
  },
  {
    img: '08-ogrod',
    alt: 'Blick von oben über den Garten mit Lamellenzaun und integrierten LED-Leisten',
    eyebrow: 'Station 04 · Die Einfriedung',
    title: 'Und rundherum: der Zaun.',
    text: 'Dieselben Profile schließen das Grundstück — ein System, innen wie außen.',
  },
];

export default function PhotoJourney() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const n = STATIONS.length;

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(n - 1, Math.max(0, Math.round(v * (n - 1)))));
  });

  return (
    <section
      id="hero"
      ref={ref}
      aria-label={`Rundgang durch eine Villa mit ${BRAND} System`}
      style={{ height: `${n * 110}vh`, position: 'relative', background: '#0d0f14' }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100svh',
          overflow: 'hidden',
          perspective: '1400px',
          perspectiveOrigin: '50% 40%',
        }}
      >
        {STATIONS.map((s, i) => (
          <Slide key={s.img} station={s} index={i} count={n} progress={scrollYProgress} />
        ))}

        {/* progress rail */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '1.6rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.9rem',
            zIndex: 20,
          }}
        >
          {STATIONS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === active ? '10px' : '6px',
                height: i === active ? '10px' : '6px',
                borderRadius: '50%',
                background: i === active ? '#e8c68e' : 'rgba(239,230,215,0.35)',
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
            color: 'rgba(239,230,215,0.55)',
            zIndex: 20,
            pointerEvents: 'none',
          }}
        >
          Scrollen · Visualisierung
        </p>
      </div>
    </section>
  );
}

function Slide({
  station,
  index,
  count,
  progress,
}: {
  station: Station;
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  // local position: −1 arriving … 0 in focus … +1 gone
  const seg = 1 / (count - 1);
  const t = useTransform(progress, (p) => p / seg - index);
  const first = index === 0;
  const last = index === count - 1;

  // arriving card rises from below, tilted back; leaving card recedes into depth
  const y = useTransform(t, [-1, 0, 1], [first ? '0%' : '100%', '0%', '-4%']);
  const rotateX = useTransform(t, [-1, 0, 1], [first ? 0 : -22, 0, last ? 0 : 10]);
  const scale = useTransform(t, [-1, 0, 1], [first ? 1 : 0.92, 1, last ? 1 : 0.82]);
  const dim = useTransform(t, [0, 1], [0, last ? 0 : 0.75]);
  const radius = useTransform(t, [-1, -0.05, 0, 1], [first ? 0 : 28, 0, 0, last ? 0 : 28]);
  // slow push-in on the photo itself
  const imgScale = useTransform(t, [-1, 1], [1.14, 1.0]);
  // caption
  const capOpacity = useTransform(t, [-0.35, -0.05, 0.3, 0.6], [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const capY = useTransform(t, [-0.35, -0.05], [first ? 0 : 30, 0]);
  const Heading = first ? 'h1' : 'h2';

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: index + 1,
        y,
        rotateX,
        scale,
        borderRadius: radius,
        overflow: 'hidden',
        transformOrigin: '50% 100%',
        boxShadow: '0 -30px 80px rgba(0,0,0,0.45)',
        willChange: 'transform',
      }}
    >
      <motion.picture style={{ position: 'absolute', inset: 0, scale: imgScale, display: 'block' }}>
        <source
          type="image/webp"
          srcSet={`/renders/podroz/${station.img}-960.webp 960w, /renders/podroz/${station.img}-1920.webp 1920w`}
          sizes="100vw"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/renders/podroz/${station.img}.jpg`}
          alt={station.alt}
          loading={first ? 'eager' : 'lazy'}
          fetchPriority={first ? 'high' : 'auto'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </motion.picture>

      {/* grading for nav + caption legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,11,15,0.5) 0%, rgba(10,11,15,0) 20%), linear-gradient(to top, rgba(10,11,15,0.72) 0%, rgba(10,11,15,0.15) 45%, rgba(10,11,15,0) 60%)',
        }}
      />
      <motion.div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: '#07080b', opacity: dim }} />

      <motion.div
        style={{
          position: 'absolute',
          left: 'clamp(1.5rem, 6vw, 5rem)',
          right: 'clamp(1.5rem, 6vw, 5rem)',
          bottom: 'clamp(4.5rem, 12vh, 8rem)',
          maxWidth: first ? '40rem' : '30rem',
          opacity: capOpacity,
          y: capY,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem' }}>
          <span style={{ width: '2.4rem', height: '1px', background: '#c9a166', display: 'block', flexShrink: 0 }} />
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.82)' }}>
            {station.eyebrow}
          </p>
        </div>
        <Heading
          className={first ? 'display-xl' : 'font-serif'}
          style={
            first
              ? { color: '#efe6d7', maxWidth: '13ch' }
              : { fontSize: 'clamp(1.8rem, 3.8vw, 2.8rem)', fontWeight: 300, color: '#efe6d7', lineHeight: 1.12 }
          }
        >
          {station.title}
        </Heading>
        <p style={{ marginTop: '0.9rem', fontSize: '0.92rem', color: 'rgba(239,230,215,0.78)', lineHeight: 1.7 }}>
          {station.text}
        </p>
      </motion.div>
    </motion.div>
  );
}
