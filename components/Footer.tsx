import { BRAND, COMPANY } from '@/data/brand';

const NAV = [
  ['System', '#system'],
  ['Formate', '#formate'],
  ['Visualisierung', '#visualisierung'],
  ['Rundgang', '#rundgang'],
  ['Projekte', '#projekte'],
  ['Kalkulator', '#kalkulator'],
  ['Technik', '#technik'],
  ['Kontakt', '#kontakt'],
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid rgba(212,180,131,0.14)',
        background: '#221c15',
        color: '#efe6d7',
        overflow: 'hidden',
      }}
    >
      <div className="container-wide pt-16 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          {/* Claim */}
          <div className="md:col-span-5">
            <p
              className="font-serif"
              style={{ fontSize: '1.5rem', fontStyle: 'italic', lineHeight: 1.4, color: '#efe6d7' }}
            >
              Architektur, die nicht laut sein muss,
              <br />
              um gesehen zu werden.
            </p>
            <a
              href="#kontakt"
              className="inline-block mt-6"
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#c9a166',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(201,161,102,0.4)',
                paddingBottom: '0.35rem',
              }}
            >
              Projekt besprechen →
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.4)', marginBottom: '1.25rem' }}>
              Navigation
            </p>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-2">
              {NAV.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontSize: '0.78rem',
                    color: 'rgba(239,230,215,0.72)',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.4)', marginBottom: '1.25rem' }}>
              Kontakt
            </p>
            <p style={{ fontSize: '0.82rem', color: 'rgba(239,230,215,0.72)', lineHeight: 2 }}>
              {COMPANY.name}
              <br />
              {COMPANY.city}, {COMPANY.state}
              <br />
              <a href={`mailto:${COMPANY.email}`} style={{ color: '#c9a166', textDecoration: 'none' }}>
                {COMPANY.email}
              </a>
            </p>
          </div>
        </div>

        {/* Giant wordmark */}
        <div aria-hidden="true" className="select-none" style={{ lineHeight: 0.9, marginBottom: '2.5rem' }}>
          <span
            className="font-serif block text-center"
            style={{
              fontSize: 'clamp(3.5rem, 13vw, 11rem)',
              letterSpacing: '0.22em',
              fontWeight: 300,
              color: 'transparent',
              backgroundImage: 'linear-gradient(180deg, rgba(201,161,102,0.5) 0%, rgba(201,161,102,0.06) 90%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              whiteSpace: 'nowrap',
            }}
          >
            {BRAND}
          </span>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-6"
          style={{ borderTop: '1px solid rgba(212,180,131,0.12)' }}
        >
          <p style={{ fontSize: '0.62rem', color: 'rgba(239,230,215,0.4)', letterSpacing: '0.08em' }}>
            © {year} {COMPANY.name} — Gesellschaft in Gründung. Angaben ohne Gewähr.
          </p>
          <div className="flex gap-6">
            <a href="/impressum" style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.5)', textDecoration: 'none' }}>
              Impressum
            </a>
            <a href="/datenschutz" style={{ fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(239,230,215,0.5)', textDecoration: 'none' }}>
              Datenschutz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
