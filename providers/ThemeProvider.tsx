'use client';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <div className="dark min-h-full bg-[#0a0e17] text-slate-100">{children}</div>;
}
