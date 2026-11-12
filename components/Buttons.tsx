import type { ReactNode } from "react";

const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {});

/** Corner button: plain uppercase text; a soft blurred fill opens from the middle on hover. */
export function Primary({ href, children, className = "", cursor = "snap" }: { href: string; children: ReactNode; className?: string; cursor?: string }) {
  return (
    <a href={href} data-cursor={cursor} className={`btn btn-primary t-ui ${className}`} {...ext(href)}>
      <span>{children}</span>
    </a>
  );
}

/** Framed serif button: the hairline frame pinches at top and bottom middle, the label rolls up to its copy. */
export function Secondary({ href, label, arrow = false, className = "", onClick }: { href?: string; label: string; arrow?: boolean; className?: string; onClick?: () => void }) {
  const inner = (
    <>
      <svg className="btn-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <path />
      </svg>
      <span className="roll">
        <span>{label}{arrow && " ↗"}</span>
        <span aria-hidden>{label}{arrow && " ↗"}</span>
      </span>
    </>
  );
  const cls = `btn btn-secondary ${className}`;
  return href ? (
    <a href={href} data-cursor="snap" className={cls} {...ext(href)}>{inner}</a>
  ) : (
    <button type="button" data-cursor="snap" onClick={onClick} className={cls}>{inner}</button>
  );
}

/** Words that blur in one by one (driven by the [data-words] trigger in Run / page code). */
export function Words({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span data-words className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-word className="inline-block whitespace-pre">
          {w}{" "}
        </span>
      ))}
    </span>
  );
}
