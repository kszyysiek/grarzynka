'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '@/data/brand';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Draw atmospheric vertical fin silhouettes
      const fw = 28;
      const gap = 14;
      const pitch = fw + gap;
      const count = Math.ceil(W / pitch) + 2;

      for (let i = 0; i < count; i++) {
        const x = i * pitch - (t % pitch);
        // Metallic gradient
        const g = ctx.createLinearGradient(x, 0, x + fw, 0);
        g.addColorStop(0, 'rgba(30,25,20,0.7)');
        g.addColorStop(0.3, 'rgba(55,48,38,0.75)');
        g.addColorStop(0.65, 'rgba(45,38,30,0.7)');
        g.addColorStop(1, 'rgba(25,20,16,0.6)');
        ctx.fillStyle = g;
        ctx.fillRect(x, 0, fw, H);

        // LED glow in gap
        const gx = x + fw;
        const gl = ctx.createLinearGradient(gx, 0, gx + gap, 0);
        gl.addColorStop(0, 'rgba(0,0,0,0)');
        gl.addColorStop(0.4, 'rgba(212,180,131,0.08)');
        gl.addColorStop(0.6, 'rgba(212,180,131,0.08)');
        gl.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gl;
        ctx.fillRect(gx, 0, gap, H);
      }

      t += 0.18;
      animId = requestAnimationFrame(draw);
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    draw();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-end overflow-hidden"
      style={{ minHeight: '100svh', background: 'var(--color-base)' }}
    >
      {/* Animated background fins */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.45 }}
        aria-hidden="true"
      />

      {/* Vertical gradient to darken bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(12,10,9,0.55) 0%, rgba(12,10,9,0.2) 40%, rgba(12,10,9,0.85) 85%, rgba(12,10,9,1) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container-wide relative z-10 pb-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.7 }}
          className="eyebrow mb-6"
        >
          Modulares Lamellensystem · Aluminiumguss
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="display-xl text-ivory"
        >
          Die Kunst der{' '}
          <em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>
            Gliederung.
          </em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.8 }}
          className="mt-6 max-w-xl"
          style={{ fontSize: '1rem', color: 'var(--color-text-dim)', lineHeight: 1.75, fontWeight: 300 }}
        >
          Ein Fassadensystem für Architektur,<br />
          die nicht laut sein muss, um gesehen zu werden.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2, duration: 0.7 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a href="#kontakt" className="btn-primary">
            Muster anfragen
          </a>
          <a href="#system" className="btn-ghost">
            System entdecken
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span
          className="eyebrow"
          style={{ fontSize: '0.6rem', writingMode: 'vertical-rl', letterSpacing: '0.2em' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          style={{ width: '1px', height: '40px', background: 'var(--color-accent)', opacity: 0.5 }}
        />
      </motion.div>

      {/* Wordmark top-left spacer */}
      <div className="absolute top-0 left-0 right-0 h-14" />
    </section>
  );
}
