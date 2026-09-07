export function Logo({ className }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="100" height="100" rx="22" fill="#2563EB" />
      <path d="M50 26 L26 39 L50 52 L74 39 Z" fill="url(#grad-top)" />
      <path d="M26 41 L48 53 L48 76 L26 63 Z" fill="url(#grad-left)" />
      <path d="M53 58 L58 55.3 L58 73 L53 74.5 Z" fill="url(#grad-bar)" />
      <path d="M61 53.7 L66 51 L66 69 L61 71 Z" fill="url(#grad-bar)" />
      <path d="M69 49.3 L74 46.6 L74 65 L69 67.5 Z" fill="url(#grad-bar)" />
      <defs>
        <linearGradient id="grad-top" x1="26" y1="26" x2="74" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
        <linearGradient id="grad-left" x1="26" y1="41" x2="48" y2="76" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f8fafc" />
          <stop offset="1" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="grad-bar" x1="53" y1="46" x2="74" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f1f5f9" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
