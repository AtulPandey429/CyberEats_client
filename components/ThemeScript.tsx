export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('cybereats-theme');var theme=t==='light'?'light':'dark';document.documentElement.classList.remove('dark','light');document.documentElement.classList.add(theme);document.documentElement.style.colorScheme=theme;}catch(e){document.documentElement.classList.add('dark');}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
