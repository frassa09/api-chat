const common = {
  width: 19,
  height: 19,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function Icon({ name, size = 19, ...props }) {
  const paths = {
    sparkle: <><path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3Z"/><path d="m19 18 .5 1.5L21 20l-1.5.5L19 22l-.5-1.5L17 20l1.5-.5L19 18Z"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    message: <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.9-3.2A7.5 7.5 0 1 1 20 11.5Z"/>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    x: <path d="M5 5l14 14M19 5 5 19"/>,
    arrowUp: <><path d="M12 19V5M5 12l7-7 7 7"/></>,
    chevronDown: <path d="m6 9 6 6 6-6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    bot: <><rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 3v4M9 13h.01M15 13h.01M9 17h6"/></>,
    alert: <><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></>,
  };
  return <svg {...common} width={size} height={size} {...props}>{paths[name]}</svg>;
}
