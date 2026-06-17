import Link from 'next/link';

const navItems = ['Marketplace', 'Rewards', 'Orders', 'Profile'];

export function Navbar() {
  return (
    <header className="border-b border-cyan-400/10 bg-[#111827]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-[0.2em] text-cyan-300">
          CYBEREATS
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <span
              key={item}
              className="cursor-default text-sm text-slate-400 transition-colors hover:text-cyan-300"
            >
              {item}
            </span>
          ))}
        </nav>
        <Link href="/login" className="text-sm text-cyan-300 hover:underline">
          Login
        </Link>
      </div>
    </header>
  );
}
