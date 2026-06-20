'use client';

import { useEffect, useRef, useState } from 'react';
import { ApiStatusBanner } from '@/components/ApiStatusBanner';
import { Navbar } from '@/components/Navbar';

export function AppHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeight = () => {
      document.documentElement.style.setProperty('--app-header-height', `${el.offsetHeight}px`);
    };

    syncHeight();
    const observer = new ResizeObserver(syncHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      <ApiStatusBanner />
      <Navbar scrolled={scrolled} />
    </div>
  );
}
