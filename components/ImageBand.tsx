'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ImageBandProps {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  caption?: string;
  href?: string;
  cta?: string;
}

/** Full-bleed editorial image band with gentle scroll parallax. */
export default function ImageBand({ src, alt, eyebrow, title, caption, href, cta }: ImageBandProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section
      ref={ref}
      style={{ position: 'relative', height: 'clamp(440px, 68vh, 700px)', overflow: 'hidden' }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          position: 'absolute',
          left: 0,
          top: '-12%',
          width: '100%',
          height: '124%',
          objectFit: 'cover',
          y,
        }}
      />

      {/* Grading */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(16,15,17,0.72) 0%, rgba(16,15,17,0.15) 40%, rgba(16,15,17,0) 60%)',
        }}
      />

      {/* Copy */}
      <div className="container-wide" style={{ position: 'absolute', left: 0, right: 0, bottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
        <div className="flex items-center gap-4 mb-4">
          <span style={{ width: '2.5rem', height: '1px', background: '#c9a166', display: 'block' }} />
          <p
            style={{
              fontSize: '0.66rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(239,230,215,0.75)',
              fontWeight: 400,
            }}
          >
            {eyebrow}
          </p>
        </div>
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: '#efe6d7',
            maxWidth: '22ch',
          }}
        >
          {title}
        </h2>
        {caption && (
          <p style={{ marginTop: '0.9rem', fontSize: '0.82rem', color: 'rgba(239,230,215,0.6)', maxWidth: '52ch', lineHeight: 1.75 }}>
            {caption}
          </p>
        )}
        {href && cta && (
          <a
            href={href}
            className="inline-block mt-6"
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#e8c68e',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(232,198,142,0.45)',
              paddingBottom: '0.35rem',
            }}
          >
            {cta} →
          </a>
        )}
      </div>
    </section>
  );
}
