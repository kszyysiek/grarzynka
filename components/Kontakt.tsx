'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { BRAND, COMPANY } from '@/data/brand';

type RequestType = 'muster' | 'mengen' | 'projekt' | 'unterlagen';

const REQUEST_LABELS: Record<RequestType, string> = {
  muster: 'Muster anfragen',
  mengen: 'Mengen anfragen',
  projekt: 'Projekt besprechen',
  unterlagen: 'Technische Unterlagen',
};

export default function Kontakt() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });

  const [reqType, setReqType] = useState<RequestType>('muster');
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build mailto link with form data
    const subject = `${REQUEST_LABELS[reqType]} — ${form.company || form.name}`;
    const body = `Anfrageart: ${REQUEST_LABELS[reqType]}\n\nName: ${form.name}\nUnternehmen: ${form.company}\nE-Mail: ${form.email}\nTelefon: ${form.phone}\n\nNachricht:\n${form.message}`;
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section
      id="kontakt"
      className="section-pad"
      style={{ background: 'var(--color-base)' }}
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
          <p className="chapter-num mb-3">XIII. — Kontakt & Bemusterung</p>
          <div className="hairline-h mb-8" style={{ maxWidth: '3rem' }} />
          <h2 className="display-lg text-ivory">
            Erleben Sie das System{' '}
            <em style={{ color: 'var(--color-accent)' }}>in der Hand.</em>
          </h2>
          <p
            className="mt-5 max-w-xl"
            style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.8 }}
          >
            Für Architekten, Planer und ausgewählte Verarbeiter: Musterprofile und
            technische Unterlagen auf Anfrage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Request type */}
            <div className="mb-7">
              <p className="eyebrow mb-3" style={{ fontSize: '0.62rem' }}>
                Art der Anfrage
              </p>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(REQUEST_LABELS) as RequestType[]).map((rt) => (
                  <button
                    key={rt}
                    onClick={() => setReqType(rt)}
                    className={`segment-btn ${reqType === rt ? 'active' : ''}`}
                  >
                    {REQUEST_LABELS[rt]}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="name">
                    Name *
                  </label>
                  <input
                    id="name"
                    required
                    className="input-field"
                    placeholder="Vorname Nachname"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="company">
                    Unternehmen / Büro
                  </label>
                  <input
                    id="company"
                    className="input-field"
                    placeholder="Architekturbüro GmbH"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="email">
                    E-Mail *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="input-field"
                    placeholder="name@buero.de"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="phone">
                    Telefon
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="input-field"
                    placeholder="+49 6181 …"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow block mb-2" style={{ fontSize: '0.62rem' }} htmlFor="message">
                  Nachricht / Projektbeschreibung
                </label>
                <textarea
                  id="message"
                  className="input-field"
                  rows={5}
                  placeholder="Beschreiben Sie Ihr Projekt oder Ihren Bedarf …"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ resize: 'vertical', fontFamily: 'Jost, sans-serif' }}
                />
              </div>

              <p
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--color-text-dimmer)',
                  lineHeight: 1.65,
                }}
              >
                Mit dem Absenden öffnet sich Ihr Standard-E-Mail-Programm mit vorausgefüllter
                Nachricht an {COMPANY.email}. Pflichtfelder *
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <button type="submit" className="btn-primary">
                  {REQUEST_LABELS[reqType]}
                </button>
                {sent && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontStyle: 'italic' }}
                  >
                    E-Mail geöffnet ✓
                  </motion.span>
                )}
              </div>
            </form>
          </motion.div>

          {/* Right: info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            {/* Brand info box */}
            <div
              style={{
                border: '1px solid var(--color-hairline)',
                padding: '2rem',
                background: 'var(--color-surface)',
              }}
            >
              <span
                className="font-serif"
                style={{ fontSize: '1.4rem', letterSpacing: '0.3em', color: 'var(--color-ivory)' }}
              >
                {BRAND}
              </span>
              <div className="hairline-h my-4" />
              <div className="flex flex-col gap-2">
                <InfoRow label="Unternehmen" value={COMPANY.name} />
                <InfoRow label="Standort" value={`${COMPANY.city}, ${COMPANY.state}`} />
                <InfoRow label="E-Mail" value={COMPANY.email} />
                <InfoRow label="Status" value="Gesellschaft in Gründung (GmbH i. Gr.)" />
              </div>
            </div>

            {/* Quotes */}
            <div
              style={{ borderLeft: '1px solid var(--color-accent)', paddingLeft: '1.25rem' }}
            >
              <p
                className="font-serif"
                style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--color-text)', lineHeight: 1.7 }}
              >
                „Für Architekten, Planer und ausgewählte Verarbeiter bieten wir
                Musterprofile, technische Beratung und Projektunterstützung an."
              </p>
              <p
                style={{
                  marginTop: '0.75rem',
                  fontSize: '0.72rem',
                  color: 'var(--color-text-dimmer)',
                }}
              >
                — {BRAND} {COMPANY.city}
              </p>
            </div>

            {/* Hinweis Bemusterung */}
            <div
              style={{
                border: '1px solid var(--color-hairline)',
                padding: '1.5rem',
              }}
            >
              <p
                className="eyebrow mb-3"
                style={{ fontSize: '0.62rem', color: 'var(--color-accent)' }}
              >
                Bemusterung
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)', lineHeight: 1.75 }}>
                Musterprofile in allen drei Formaten (90 / 30 / 15 mm) stehen für
                Architekten und Planer auf Anfrage zur Verfügung. Entnahme und Präsentation
                nach Absprache in Hanau oder per Versand.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
      <span style={{ color: 'var(--color-text-dimmer)', minWidth: '90px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'var(--color-text)' }}>{value}</span>
    </div>
  );
}
