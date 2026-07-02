'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '@/data/brand';

const DURATION = 1700; // counter runtime in ms

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out so the counter decelerates like a real load
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setVisible(false), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={false}
          exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#221c15' }}
        >
          <motion.span
            initial={{ opacity: 0, y: 14, letterSpacing: '0.28em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.45em' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif"
            style={{ color: '#efe6d7', fontSize: '1.6rem' }}
          >
            {BRAND}
          </motion.span>

          <div className="mt-10 w-44 overflow-hidden" style={{ height: '1px', background: 'rgba(212,180,131,0.18)' }}>
            <motion.div
              style={{ height: '100%', background: '#c9a166', width: `${count}%` }}
            />
          </div>

          <div className="mt-4 flex items-baseline gap-1" aria-hidden="true">
            <span
              className="font-serif"
              style={{ color: '#c9a166', fontSize: '0.95rem', fontStyle: 'italic', fontVariantNumeric: 'tabular-nums' }}
            >
              {String(count).padStart(3, '0')}
            </span>
            <span style={{ color: 'rgba(239,230,215,0.4)', fontSize: '0.6rem', letterSpacing: '0.2em' }}>
              %
            </span>
          </div>

          <span
            className="absolute bottom-8"
            style={{ color: 'rgba(239,230,215,0.35)', fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}
          >
            Modulares Lamellensystem
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
