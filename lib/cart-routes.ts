/** Routes where cart state is needed (avoids /checkout/cart fetch on admin, orders, etc.) */
export function isCartEnabledRoute(pathname: string): boolean {
  if (pathname.startsWith('/terminal') || pathname.startsWith('/dashboard')) return false;
  if (pathname === '/') return true;
  if (pathname.startsWith('/restaurants')) return true;
  if (pathname.startsWith('/checkout')) return true;
  if (pathname.startsWith('/profile')) return true;
  return false;
}

/** Dashboard routes use sidebar nav — hide mobile bottom bar */
export function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith('/terminal') || pathname.startsWith('/dashboard');
}
