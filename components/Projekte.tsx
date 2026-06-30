'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { PROJECTS, type Project } from '@/data/projects';

type FilterKey = 'alle' | 'aussen' | 'innen' | 'decke' | 'tag' | 'nacht';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'alle', label: 'Alle' },
  { key: 'aussen', label: 'Außenfassade' },
  { key: 'innen', label: 'Innen' },
  { key: 'decke', label: 'Decke' },
  { key: 'tag', label: 'Tag' },
  { key: 'nacht', label: 'Nacht' },
];

// Placeholder colour fills for projects (no real imagery yet)
const PROJECT_COLORS = [
  ['#1e1a16', '#352e24'],
  ['#12100e', '#2a2218'],
  ['#161412', '#282018'],
  ['#0e0c0a', '#201c14'],
  ['#1a1610', '#302618'],
  ['#100e0c', '#22201a'],
];

export default function Projekte() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const [filter, setFilter] = useState<FilterKey>('alle');
  const [lightbox, setLightbox] = useState<Project | null>(null);

  const filtered = PROJECTS.filter((p) => {
    if (filter === 'alle') return true;
    if (filter === 'tag' || filter === 'nacht') return p.timeOfDay.includes(filter);
    return p.categories.includes(filter as 'aussen' | 'innen' | 'decke');
  });

  return (
    <section
      id="projekte"
      className="section-pad"
      style={{ background: 'var(--color-surface)' }}
      ref={ref}
    >
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="chapter-num mb-3">VII. — Projekte</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            System im{' '}
            <em style={{ color: 'var(--color-accent)' }}>Einsatz.</em>
          </h2>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`filter-btn ${filter === f.key ? 'active' : ''}`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'var(--color-hairline)' }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const [bgFrom, bgTo] = PROJECT_COLORS[PROJECTS.indexOf(project) % PROJECT_COLORS.length];
              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  style={{ background: 'var(--color-base)', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                  onClick={() => setLightbox(project)}
                >
                  {/* Image placeholder */}
                  <div
                    style={{
                      height: 'clamp(180px, 22vw, 280px)',
                      background: `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Fin pattern overlay */}
                    <FinThumbnail format={project.format} isNight={project.timeOfDay.includes('nacht') && !project.timeOfDay.includes('tag')} />

                    {/* Category badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.875rem',
                        left: '0.875rem',
                        display: 'flex',
                        gap: '0.375rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      {project.categories.map((cat) => (
                        <span
                          key={cat}
                          style={{
                            fontSize: '0.58rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            padding: '0.2rem 0.5rem',
                            background: 'rgba(12,10,9,0.7)',
                            color: 'var(--color-text-dim)',
                            backdropFilter: 'blur(4px)',
                          }}
                        >
                          {cat === 'aussen' ? 'Außen' : cat === 'innen' ? 'Innen' : 'Decke'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: '1.25rem 1.25rem 1.5rem' }}>
                    <p
                      className="font-serif"
                      style={{ fontSize: '1.1rem', color: 'var(--color-text)', marginBottom: '0.25rem' }}
                    >
                      {project.title}
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-dimmer)', letterSpacing: '0.06em' }}>
                      {project.location}
                    </p>
                  </div>

                  {/* Hover reveal */}
                  <div
                    className="absolute inset-0 flex items-end p-5 opacity-0 hover:opacity-100 transition-opacity duration-400"
                    style={{ background: 'rgba(12,10,9,0.82)' }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--color-text-dim)',
                          lineHeight: 1.7,
                          marginBottom: '0.75rem',
                        }}
                      >
                        {project.description.slice(0, 100)}…
                      </p>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--color-accent)',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Details ansehen →
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p
            style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-dimmer)', fontSize: '0.875rem' }}
          >
            Keine Projekte in dieser Kategorie.
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="lightbox-overlay"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--color-surface)',
                maxWidth: '780px',
                width: '90vw',
                maxHeight: '85vh',
                overflow: 'auto',
                border: '1px solid var(--color-hairline)',
                position: 'relative',
              }}
            >
              {/* Image area */}
              <div
                style={{
                  height: 'clamp(200px, 35vw, 360px)',
                  background: `linear-gradient(135deg, ${PROJECT_COLORS[PROJECTS.indexOf(lightbox) % PROJECT_COLORS.length][0]} 0%, ${PROJECT_COLORS[PROJECTS.indexOf(lightbox) % PROJECT_COLORS.length][1]} 100%)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <FinThumbnail format={lightbox.format} isNight={lightbox.timeOfDay.includes('nacht')} large />
                <p
                  style={{
                    position: 'absolute',
                    bottom: '0.875rem',
                    left: '1rem',
                    fontSize: '0.6rem',
                    color: 'rgba(239,233,221,0.35)',
                    fontStyle: 'italic',
                  }}
                >
                  Referenzbild Platzhalter — Projektfotografie folgt
                </p>
              </div>

              {/* Content */}
              <div style={{ padding: '2rem' }}>
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3
                    className="display-md font-serif"
                    style={{ fontSize: '1.6rem', color: 'var(--color-text)' }}
                  >
                    {lightbox.title}
                  </h3>
                  <button
                    onClick={() => setLightbox(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-dim)',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      flexShrink: 0,
                      padding: '0.25rem',
                    }}
                    aria-label="Schließen"
                  >
                    ×
                  </button>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-dimmer)', marginBottom: '1.25rem' }}>
                  {lightbox.location}
                </p>
                <div className="hairline-h mb-5" />
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}>
                  {lightbox.description}
                </p>
                <div className="mt-5 flex gap-2 flex-wrap">
                  {lightbox.categories.map((c) => (
                    <span
                      key={c}
                      style={{
                        fontSize: '0.62rem',
                        padding: '0.2rem 0.6rem',
                        border: '1px solid var(--color-hairline)',
                        color: 'var(--color-text-dimmer)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {c === 'aussen' ? 'Außen' : c === 'innen' ? 'Innen' : 'Decke'}
                    </span>
                  ))}
                  <span
                    style={{
                      fontSize: '0.62rem',
                      padding: '0.2rem 0.6rem',
                      border: '1px solid var(--color-hairline)',
                      color: 'var(--color-accent)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Format {lightbox.format === 'rhythmus' ? '90·30·15' : lightbox.format + ' mm'}
                  </span>
                </div>
                <div className="mt-6">
                  <a href="#kontakt" onClick={() => setLightbox(null)} className="btn-ghost" style={{ fontSize: '0.68rem' }}>
                    Projekt besprechen
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FinThumbnail({
  format,
  isNight,
  large,
}: {
  format: string;
  isNight: boolean;
  large?: boolean;
}) {
  const patterns: Record<string, number[]> = {
    '90': [90],
    '30': [30],
    '15': [15],
    rhythmus: [90, 30, 15],
  };
  const widths = patterns[format] ?? [90, 30, 15];
  const gap = 12;
  const scale = large ? 2 : 1.4;

  const finColor = isNight
    ? 'linear-gradient(to right, #0e0c0a, #1a1614, #0e0c0a)'
    : 'linear-gradient(to right, #383028, #584e40, #383028)';

  const repeat = 14;
  const allFins: number[] = [];
  for (let i = 0; i < repeat; i++) allFins.push(...widths);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        gap: `${gap}px`,
        padding: '0 1rem',
      }}
    >
      {allFins.map((w, i) => (
        <div key={i} style={{ flexShrink: 0, width: `${w * scale}px`, position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              background: finColor,
              borderTop: isNight
                ? '1px solid rgba(212,180,131,0.06)'
                : '1px solid rgba(255,255,255,0.1)',
            }}
          />
          {/* Gap glow */}
          {isNight && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: `-${gap}px`,
                width: `${gap}px`,
                height: '100%',
                background:
                  'linear-gradient(to right, rgba(0,0,0,0), rgba(240,200,110,0.8), rgba(0,0,0,0))',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
