// Explore China BD mark: a ring (the signature circle) holding a gate. The curved eave is the
// paifang roof, two pillars frame the opening, and a red sun rises through it: an open door to China.

export function Mark({ className = "", draw = false }: { className?: string; draw?: boolean }) {
  const s = draw ? { pathLength: 1, className: "mark-stroke" } : {};
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="32" cy="32" r="29" {...s} />
      <path d="M12 23 Q32 15 52 23" {...s} />
      <path d="M17 29 H47" {...s} />
      <path d="M22 29 V50 M42 29 V50" {...s} />
      <circle cx="32" cy="41" r="6" fill="#f2b65a" stroke="none" className={draw ? "mark-fill" : ""} />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className="h-9 w-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] uppercase tracking-[0.04em]">Explore China</span>
        <span className="label mt-1 text-sand">Bangladesh</span>
      </span>
    </span>
  );
}
