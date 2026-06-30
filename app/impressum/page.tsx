import { BRAND, COMPANY } from '@/data/brand';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: `Impressum — ${BRAND}`,
  robots: { index: false },
};

export default function Impressum() {
  return (
    <>
      <Navigation />
      <main
        style={{
          background: 'var(--color-base)',
          minHeight: '100vh',
          paddingTop: '8rem',
          paddingBottom: '6rem',
        }}
      >
        <div className="container-wide" style={{ maxWidth: '720px' }}>
          <p className="chapter-num mb-4">Rechtliches</p>
          <h1
            className="font-serif text-ivory"
            style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '2.5rem' }}
          >
            Impressum
          </h1>

          <div className="hairline-h mb-8" />

          <section style={{ marginBottom: '2.5rem' }}>
            <h2
              style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.875rem' }}
            >
              Angaben gemäß § 5 TMG
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}>
              {COMPANY.name}<br />
              <em style={{ fontSize: '0.8rem', color: 'var(--color-text-dimmer)' }}>
                (Gesellschaft in Gründung — noch nicht im Handelsregister eingetragen)
              </em>
              <br /><br />
              {COMPANY.city}, {COMPANY.state}<br />
              {COMPANY.country}
            </p>
          </section>

          <div className="hairline-h mb-6" />

          <section style={{ marginBottom: '2.5rem' }}>
            <h2
              style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.875rem' }}
            >
              Kontakt
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}>
              E-Mail:{' '}
              <a
                href={`mailto:${COMPANY.email}`}
                style={{ color: 'var(--color-text)' }}
              >
                {COMPANY.email}
              </a>
            </p>
          </section>

          <div className="hairline-h mb-6" />

          <section style={{ marginBottom: '2.5rem' }}>
            <h2
              style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.875rem' }}
            >
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}>
              Geschäftsführung {COMPANY.name}<br />
              {COMPANY.city}, {COMPANY.state}
            </p>
          </section>

          <div className="hairline-h mb-6" />

          <section style={{ marginBottom: '2.5rem' }}>
            <h2
              style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.875rem' }}
            >
              Haftungsausschluss
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}>
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr
              übernommen werden. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Diese
              Website befindet sich im Aufbau. Alle Angaben sind vorläufig und ohne Gewähr.
            </p>
          </section>

          <div className="hairline-h mb-6" />

          <section>
            <h2
              style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.875rem' }}
            >
              Urheberrecht
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung,
              Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts
              bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

          <div className="mt-12">
            <a href="/" className="btn-ghost" style={{ fontSize: '0.68rem' }}>
              ← Zurück zur Website
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
