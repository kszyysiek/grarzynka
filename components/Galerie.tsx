'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { BRAND } from '@/data/brand';

/**
 * Photo gallery of the villa: house, salon, hall, pool and garden. Editorial grid;
 * click opens a full-screen lightbox (Esc closes, arrow keys browse).
 * Photos live in /public/renders/podroz as <name>-960.webp / -1920.webp / .jpg.
 */

interface Photo {
  img: string;
  title: string;
  label: string;
  alt: string;
  span: string;
}

const PHOTOS: Photo[] = [
  {
    img: '01-dzien',
    label: 'Fassade',
    title: 'Die Villa bei Tag',
    alt: `Moderne Villa mit schwarzer ${BRAND} Rippenfassade, breiter Auffahrt und Bepflanzung bei Tageslicht`,
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    img: '02-zmierzch',
    label: 'Licht',
    title: 'Blaue Stunde',
    alt: 'Dieselbe Villa zur blauen Stunde, vertikale LED-Linien leuchten in der Fassade',
    span: '',
  },
  {
    img: '05-salon',
    label: 'Salon',
    title: 'Wohnraum mit Lamellenwand',
    alt: 'Großzügiger Salon mit heller Lamellenwand, Fernseher und Blick auf die bronzene Pergola',
    span: '',
  },
  {
    img: '04-hol',
    label: 'Halle',
    title: 'Ankommen zwischen Lamellen',
    alt: 'Eingangshalle mit heller Kamm-Lamellenwand und verborgener vertikaler LED',
    span: '',
  },
  {
    img: '07-basen',
    label: 'Garten',
    title: 'Pool, Bar & Pflanzkübel',
    alt: 'Pool mit bronzener Pergola, Außenbar und Pflanzkübeln im Lamellenprofil, beleuchtet',
    span: '',
  },
  {
    img: '08-ogrod',
    label: 'Garten',
    title: 'Das ganze Grundstück',
    alt: 'Blick von oben über Garten, Pool und Lamellenzaun mit integrierten LED-Leisten',
    span: '',
  },
];

const src = (img: string, w: 960 | 1920) => `/renders/podroz/${img}-${w}.webp`;

export default function Galerie() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);
  const step = useCallback((d: number) => {
    setOpen((i) => (i === null ? i : (i + d + PHOTOS.length) % PHOTOS.length));
  }, []);

  useEffect(() => {
    if (open === null) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  const current = open === null ? null : PHOTOS[open];

  return (
    <section id="galerie" ref={ref} className="section-pad" style={{ background: '#0d0f14' }}>
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="chapter-num mb-3">Galerie — Die Villa</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg" style={{ color: '#efe6d7' }}>
            Haus, Salon, Garten.
            <br />
            <em style={{ color: 'var(--color-accent)' }}>Ein System.</em>
          </h2>
        </motion.div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          style={{ gridAutoRows: 'clamp(220px, 24vw, 340px)' }}
        >
          {PHOTOS.map((p, i) => (
            <motion.button
              key={p.img}
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`${p.title} vergrößern`}
              className={`group ${p.span}`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 * i }}
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: 0,
                border: 0,
                background: '#15181f',
                cursor: 'zoom-in',
                textAlign: 'left',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src(p.img, i === 0 ? 1920 : 960)}
                alt={p.alt}
                loading="lazy"
                className="transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,11,15,0.7) 0%, rgba(10,11,15,0) 45%)',
                }}
              />
              <span style={{ position: 'absolute', left: '1.2rem', bottom: '1.1rem', right: '1.2rem' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.6rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: '#c9a166',
                    marginBottom: '0.35rem',
                  }}
                >
                  {p.label}
                </span>
                <span className="font-serif" style={{ display: 'block', fontSize: '1.2rem', fontWeight: 300, color: '#efe6d7' }}>
                  {p.title}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(7,8,11,0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(1rem, 4vw, 3rem)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={current.img}
              src={src(current.img, 1920)}
              alt={current.alt}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '100%', maxHeight: '86vh', objectFit: 'contain', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}
            />
            <p
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: '1.2rem',
                textAlign: 'center',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(239,230,215,0.75)',
              }}
            >
              {current.title} · {(open ?? 0) + 1} / {PHOTOS.length}
            </p>
            <LightboxButton ref={closeBtn} label="Schließen" style={{ top: '1rem', right: '1rem' }} onClick={close}>
              ×
            </LightboxButton>
            <LightboxButton label="Vorheriges Bild" style={{ left: '1rem', top: '50%' }} onClick={() => step(-1)}>
              ‹
            </LightboxButton>
            <LightboxButton label="Nächstes Bild" style={{ right: '1rem', top: '50%' }} onClick={() => step(1)}>
              ›
            </LightboxButton>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface LightboxButtonProps {
  label: string;
  style: React.CSSProperties;
  onClick: () => void;
  children: React.ReactNode;
}

const LightboxButton = forwardRef<HTMLButtonElement, LightboxButtonProps>(function LightboxButton(
  { label, style, onClick, children },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        position: 'absolute',
        width: '3rem',
        height: '3rem',
        marginTop: style.top === '50%' ? '-1.5rem' : 0,
        borderRadius: '50%',
        border: '1px solid rgba(239,230,215,0.3)',
        background: 'rgba(13,15,20,0.6)',
        color: '#efe6d7',
        fontSize: '1.6rem',
        lineHeight: 1,
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
});
