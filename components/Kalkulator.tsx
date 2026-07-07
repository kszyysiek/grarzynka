'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { formatGerman, formatGermanInt } from '@/lib/utils';

type FinFormat = 90 | 30 | 15;

interface Inputs {
  W: string;
  H: string;
  fw: FinFormat;
  g: string;
  Ao: string;
  cs: string;
}

interface Results {
  pitch: number;
  n: number;
  area: number;
  totalLfm: number;
  fastenPerFin: number;
  fastenTotal: number;
  railLfm: number;
}

function calculate(inputs: Inputs): Results | null {
  const W = parseFloat(inputs.W.replace(',', '.'));
  const H = parseFloat(inputs.H.replace(',', '.'));
  const g = parseFloat(inputs.g.replace(',', '.'));
  const Ao = parseFloat((inputs.Ao || '0').replace(',', '.')) || 0;
  const cs = parseFloat(inputs.cs.replace(',', '.'));
  const fw = inputs.fw;

  if (isNaN(W) || isNaN(H) || isNaN(g) || isNaN(cs) || W <= 0 || H <= 0 || g < 0 || cs <= 0) {
    return null;
  }

  const pitch = fw + g;
  const pitch_m = pitch / 1000;
  const n = Math.floor(W / pitch_m) + 1;
  const area = Math.max(0, W * H - Ao);
  const totalLfm = n * H;
  const fastenPerFin = Math.ceil((H * 1000) / cs) + 1;
  const fastenTotal = n * fastenPerFin;
  const railLfm = (Math.ceil((H * 1000) / cs) + 1) * W;

  return { pitch, n, area, totalLfm, fastenPerFin, fastenTotal, railLfm };
}

export default function Kalkulator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [inputs, setInputs] = useState<Inputs>({
    W: '',
    H: '',
    fw: 90,
    g: '30',
    Ao: '',
    cs: '600',
  });

  const set = useCallback(
    <K extends keyof Inputs>(key: K, val: Inputs[K]) =>
      setInputs((prev) => ({ ...prev, [key]: val })),
    []
  );

  const results = calculate(inputs);

  const hasInputs =
    inputs.W !== '' && inputs.H !== '' && parseFloat(inputs.W) > 0 && parseFloat(inputs.H) > 0;

  const prefillContact = () => {
    const W = inputs.W;
    const H = inputs.H;
    const fw = inputs.fw;
    const g = inputs.g;
    const subject = `Mengenanfrage KANELO — ${W}×${H} m, Format ${fw} mm`;
    return `mailto:info@kanelo.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Guten Tag,\n\nfür folgendes Projekt bitte ich um eine Angebotsanfrage:\n\nFassadenbreite: ${W} m\nFassadenhöhe: ${H} m\nLamellenformat: ${fw} mm\nFugenbreite: ${g} mm\n\nMit freundlichen Grüßen`
    )}`;
  };

  return (
    <section
      id="kalkulator"
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
          className="mb-14"
        >
          <p className="chapter-num mb-3">X. — Kalkulator</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            Profilmengen{' '}
            <em style={{ color: 'var(--color-accent)' }}>berechnen.</em>
          </h2>
          <p
            className="mt-5 max-w-xl"
            style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}
          >
            Geben Sie die Abmessungen Ihrer Fassadenfläche ein. Der Rechner ermittelt
            eine erste indikative Mengenübersicht — ohne Verschnitt, Öffnungsdetails,
            Ecken oder Abschlussprofile.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex flex-col gap-6">
              {/* W and H */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="W">
                    Breite (m)
                  </label>
                  <input
                    id="W"
                    className="input-field"
                    placeholder="z. B. 12,5"
                    value={inputs.W}
                    onChange={(e) => set('W', e.target.value)}
                    inputMode="decimal"
                  />
                </div>
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="H">
                    Höhe (m)
                  </label>
                  <input
                    id="H"
                    className="input-field"
                    placeholder="z. B. 8,4"
                    value={inputs.H}
                    onChange={(e) => set('H', e.target.value)}
                    inputMode="decimal"
                  />
                </div>
              </div>

              {/* Format selector */}
              <div>
                <p className="eyebrow mb-3" style={{ fontSize: '0.62rem' }}>
                  Format (Lamellenbreite)
                </p>
                <div className="flex gap-1">
                  {([90, 30, 15] as FinFormat[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => set('fw', f)}
                      aria-pressed={inputs.fw === f}
                      className={`segment-btn ${inputs.fw === f ? 'active' : ''}`}
                    >
                      {f} mm
                    </button>
                  ))}
                </div>
              </div>

              {/* Gap */}
              <div>
                <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="g">
                  Fuge (mm)
                </label>
                <input
                  id="g"
                  className="input-field"
                  value={inputs.g}
                  onChange={(e) => set('g', e.target.value)}
                  inputMode="decimal"
                  style={{ maxWidth: '160px' }}
                />
              </div>

              {/* Opening area */}
              <div>
                <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="Ao">
                  Öffnungen abziehen (m²) — optional
                </label>
                <input
                  id="Ao"
                  className="input-field"
                  placeholder="0"
                  value={inputs.Ao}
                  onChange={(e) => set('Ao', e.target.value)}
                  inputMode="decimal"
                  style={{ maxWidth: '200px' }}
                />
              </div>

              {/* Advanced toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-left"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: '0.68rem',
                  color: 'var(--color-accent)',
                  letterSpacing: '0.1em',
                }}
              >
                {showAdvanced ? '− Erweiterte Optionen ausblenden' : '+ Erweiterte Optionen (Befestigungsraster)'}
              </button>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="cs">
                      Befestigungsraster (mm)
                    </label>
                    <input
                      id="cs"
                      className="input-field"
                      value={inputs.cs}
                      onChange={(e) => set('cs', e.target.value)}
                      inputMode="decimal"
                      style={{ maxWidth: '200px' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div
              aria-live="polite"
              style={{
                border: '1px solid var(--color-hairline)',
                padding: '2rem',
                minHeight: '320px',
                background: 'var(--color-card)',
              }}
            >
              {!hasInputs ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    color: 'var(--color-text-dimmer)',
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    textAlign: 'center',
                  }}
                >
                  Breite und Höhe eingeben,<br />
                  um die Kalkulation zu starten.
                </div>
              ) : !results ? (
                <div
                  style={{
                    padding: '2rem',
                    color: 'var(--color-text-dimmer)',
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                  }}
                >
                  Bitte gültige Werte eingeben.
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={JSON.stringify(results)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p
                      className="eyebrow mb-6"
                      style={{ fontSize: '0.62rem', color: 'var(--color-text-dimmer)' }}
                    >
                      Ergebnis — indikative Mengenübersicht
                    </p>

                    <div>
                      <ResultRow label="Fassadenfläche" value={`${formatGerman(results.area, 1)} m²`} />
                      <ResultRow label="Anzahl Lamellen" value={`${formatGermanInt(results.n)} Stk.`} />
                      <ResultRow label="Profil gesamt" value={`${formatGerman(results.totalLfm, 1)} lfm`} />
                      <ResultRow label="Raster sichtbar" value={`${formatGermanInt(results.pitch)} mm`} />
                    </div>

                    {/* Advanced results */}
                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div
                            style={{
                              marginTop: '1rem',
                              paddingTop: '1rem',
                              borderTop: '1px dashed var(--color-hairline)',
                            }}
                          >
                            <p
                              style={{
                                fontSize: '0.62rem',
                                color: 'var(--color-accent)',
                                letterSpacing: '0.12em',
                                marginBottom: '0.75rem',
                              }}
                            >
                              RICHTWERTE — projektbezogen zu ermitteln
                            </p>
                            <ResultRow
                              label="Befestigungen"
                              value={`${formatGermanInt(results.fastenTotal)} Stk.`}
                              dim
                            />
                            <ResultRow
                              label="Trägerprofil"
                              value={`${formatGerman(results.railLfm, 1)} lfm`}
                              dim
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Disclaimer */}
                    <p
                      style={{
                        marginTop: '1.25rem',
                        fontSize: '0.68rem',
                        color: 'var(--color-text-dimmer)',
                        lineHeight: 1.7,
                        fontStyle: 'italic',
                        borderTop: '1px solid var(--color-hairline)',
                        paddingTop: '0.875rem',
                      }}
                    >
                      Befestigungs- und Trägermengen sind Richtwerte und werden
                      projektbezogen ermittelt. Sprechen Sie uns an.
                    </p>

                    {/* CTA */}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <a href={prefillContact()} className="btn-primary" style={{ fontSize: '0.68rem' }}>
                        Mengen anfragen
                      </a>
                      <a href="#kontakt" className="btn-ghost" style={{ fontSize: '0.68rem' }}>
                        Projekt besprechen
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ResultRow({
  label,
  value,
  dim,
}: {
  label: string;
  value: string;
  dim?: boolean;
}) {
  return (
    <div className="result-row">
      <span className="result-label" style={{ opacity: dim ? 0.6 : 1 }}>
        {label}
      </span>
      <span className="result-value" style={{ opacity: dim ? 0.65 : 1 }}>
        {value}
      </span>
    </div>
  );
}
