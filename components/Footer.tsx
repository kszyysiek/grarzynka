import { BRAND, COMPANY } from '@/data/brand';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-hairline)',
        background: 'var(--color-surface)',
      }}
    >
      <div className="container-wide py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Left: wordmark + tagline */}
          <div>
            <span className="font-serif text-ivory tracking-[0.35em] text-sm">
              {BRAND}
            </span>
            <p
              className="mt-2 text-[length:inherit]"
              style={{ fontSize: '0.72rem', color: 'var(--color-text-dimmer)', letterSpacing: '0.06em' }}
            >
              Modulares Aluminium Lamellensystem
            </p>
            <p
              className="mt-1"
              style={{ fontSize: '0.68rem', color: 'var(--color-text-dimmer)', fontStyle: 'italic' }}
            >
              {COMPANY.name} · {COMPANY.city}, {COMPANY.state}
            </p>
          </div>

          {/* Center: navigation */}
          <nav className="flex flex-col gap-2">
            {[
              ['System', '#system'],
              ['Formate', '#formate'],
              ['Visualisierung', '#visualisierung'],
              ['Projekte', '#projekte'],
              ['Kalkulator', '#kalkulator'],
              ['Technik', '#technik'],
              ['Kontakt', '#kontakt'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="eyebrow hover:text-ivory transition-colors duration-300"
                style={{ fontSize: '0.65rem' }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right: legal */}
          <div className="flex flex-col gap-2">
            <a
              href="/impressum"
              className="eyebrow hover:text-ivory transition-colors duration-300"
              style={{ fontSize: '0.65rem' }}
            >
              Impressum
            </a>
            <a
              href="/datenschutz"
              className="eyebrow hover:text-ivory transition-colors duration-300"
              style={{ fontSize: '0.65rem' }}
            >
              Datenschutz
            </a>
            <a
              href={`mailto:${COMPANY.email}`}
              className="eyebrow hover:text-ivory transition-colors duration-300"
              style={{ fontSize: '0.65rem' }}
            >
              {COMPANY.email}
            </a>
          </div>
        </div>

        <div className="hairline-h mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p style={{ fontSize: '0.65rem', color: 'var(--color-text-dimmer)' }}>
            © {year} {COMPANY.name}
          </p>
          <p style={{ fontSize: '0.65rem', color: 'var(--color-text-dimmer)', fontStyle: 'italic' }}>
            Gesellschaft in Gründung — Angaben ohne Gewähr
          </p>
        </div>
      </div>
    </footer>
  );
}
