'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '@/data/brand';

const NAV_ITEMS = [
  { label: 'System', href: '#system' },
  { label: 'Formate', href: '#formate' },
  { label: 'Visualisierung', href: '#visualisierung' },
  { label: 'Projekte', href: '#projekte' },
  { label: 'Kalkulator', href: '#kalkulator' },
  { label: 'Technik', href: '#technik' },
  { label: 'Kontakt', href: '#kontakt' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.1 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(12,10,9,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-hairline)' : '1px solid transparent',
      }}
    >
      <div className="container-wide flex items-center justify-between h-14">
        {/* Wordmark */}
        <a
          href="/"
          className="font-serif text-ivory tracking-[0.35em] text-sm hover:text-accent transition-colors duration-300"
        >
          {BRAND}
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="eyebrow text-[length:inherit] hover:text-ivory transition-all duration-400"
              style={{ fontSize: '0.67rem' }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          <span
            className="block w-5 h-px transition-all duration-300 origin-center"
            style={{
              background: 'var(--color-text)',
              transform: menuOpen ? 'rotate(45deg) translateY(3.5px)' : 'none',
            }}
          />
          <span
            className="block w-5 h-px transition-all duration-300 origin-center"
            style={{
              background: 'var(--color-text)',
              transform: menuOpen ? 'rotate(-45deg) translateY(-3.5px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-hairline)', overflow: 'hidden' }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="block px-6 py-4 eyebrow hover:text-ivory"
                style={{ borderBottom: '1px solid var(--color-hairline)', fontSize: '0.7rem' }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
