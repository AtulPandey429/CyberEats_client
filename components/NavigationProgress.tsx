'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(15);

    const advance = window.setTimeout(() => setProgress(75), 80);
    const finish = window.setTimeout(() => setProgress(100), 220);
    const hide = window.setTimeout(() => setVisible(false), 380);

    return () => {
      window.clearTimeout(advance);
      window.clearTimeout(finish);
      window.clearTimeout(hide);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
      role="progressbar"
      aria-hidden
    >
      <div
        className="h-full bg-accent shadow-[0_0_8px_var(--accent-glow)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
