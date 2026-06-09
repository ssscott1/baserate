export function Disclaimer({ children }) {
  return (
    <p className="text-xs text-[#5c5c72] leading-relaxed pl-3" style={{ borderLeft: '2px solid rgba(255,255,255,0.08)' }}>
      {children}
    </p>
  );
}
