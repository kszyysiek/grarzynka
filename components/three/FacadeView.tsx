'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { type FacadeConfig } from './FacadeScene';

const FacadeCanvas = dynamic(() => import('./FacadeCanvas'), {
  ssr: false,
  loading: () => <Placeholder />,
});

function Placeholder() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 60% 40%, #1a1611 0%, #0c0a09 70%)',
      }}
    />
  );
}

interface FacadeViewProps extends FacadeConfig {
  variant: 'hero' | 'config';
  /** Mount immediately (hero / above-the-fold). Others mount on near-viewport. */
  eager?: boolean;
  className?: string;
}

export default function FacadeView({ eager, ...props }: FacadeViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(!!eager);

  useEffect(() => {
    if (eager || mounted) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, mounted]);

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: 0 }}>
      {mounted ? <FacadeCanvas {...props} /> : <Placeholder />}
    </div>
  );
}
