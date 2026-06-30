import { BRAND, COMPANY } from '@/data/brand';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: `Datenschutzerklärung — ${BRAND}`,
  robots: { index: false },
};

export default function Datenschutz() {
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
            Datenschutzerklärung
          </h1>

          <div className="hairline-h mb-8" />

          <DSection title="1. Verantwortlicher">
            <p>
              Verantwortlicher im Sinne der DSGVO ist:<br /><br />
              {COMPANY.name}<br />
              {COMPANY.city}, {COMPANY.state}, {COMPANY.country}<br />
              E-Mail: {COMPANY.email}
            </p>
          </DSection>

          <DSection title="2. Erhebung und Speicherung personenbezogener Daten">
            <p>
              Diese Website erhebt im Rahmen des Besuchs automatisch technische Zugriffsdaten
              (Server-Log-Dateien), die zur Sicherstellung des Betriebs notwendig sind. Es werden
              keine Tracking-Technologien, Cookies zu Werbezwecken oder Analyse-Tools eingesetzt.
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Bei Nutzung der Kontaktfunktion (E-Mail über Ihr lokales Mail-Programm) werden
              die von Ihnen eingegebenen Daten ausschließlich zur Bearbeitung Ihrer Anfrage
              verwendet und nicht an Dritte weitergegeben.
            </p>
          </DSection>

          <DSection title="3. Ihre Rechte">
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
              Verarbeitung Ihrer personenbezogenen Daten sowie auf Datenübertragbarkeit.
              Wenden Sie sich dazu bitte an: {COMPANY.email}
            </p>
            <p style={{ marginTop: '0.75rem' }}>
              Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde zu
              beschweren. Zuständig ist der Hessische Beauftragte für Datenschutz und
              Informationsfreiheit (HBDI).
            </p>
          </DSection>

          <DSection title="4. Externe Dienste">
            <p>
              Diese Website lädt Schriftarten (Google Fonts: Cormorant Garamond, Jost) von den
              Google-Servern. Dabei kann Ihre IP-Adresse an Google übermittelt werden. Sofern
              Sie dies vermeiden möchten, können Sie in Ihrem Browser entsprechende
              Einstellungen vornehmen.
            </p>
          </DSection>

          <DSection title="5. Aktualität und Änderung dieser Erklärung">
            <p>
              Da sich das Angebot dieser Website noch im Aufbau befindet, wird diese
              Datenschutzerklärung laufend aktualisiert. Stand: {new Date().getFullYear()}.
            </p>
          </DSection>

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

function DSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2
        style={{
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          marginBottom: '0.875rem',
        }}
      >
        {title}
      </h2>
      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', lineHeight: 1.85 }}>
        {children}
      </div>
      <div className="hairline-h mt-6" />
    </section>
  );
}
