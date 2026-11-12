# Agent profile

- **Product:** Explore China BD marketing site (single page). Study-in-China admissions + Chinese visas, audience in Bangladesh.
- **Level:** L1 (pre-launch marketing site, no user data yet). Raise to L3 before going live with real contact details.
- **Flags:** ui public
- **Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (`row:` custom variant), GSAP + ScrollTrigger + @gsap/react, Lenis, raw WebGL.
- **Source dirs:** app components lib content
- **Content:** all copy and image URLs live in `content/site.ts`. Fees, contact details, refusal policy and the address are placeholders.
- **Checks:** `npm run lint`, `npm run build`. Visual: desktop 1440×900 (sideways runs), 390×844 (stacked), `prefers-reduced-motion` (stacked, no smoke), `?edit` (stacked).
- **Decisions:** the brief came from the developer's design spec (2026-11-12) and stands as the agreed plan.
- **Decision (2026-11-12):** the developer asked to follow manifesto.blandina.org's design and motion directly. Layout, type scale, buttons, cursor modes, preloader, menu, footer orb with a breathing overlay, and the endless loop are rebuilt in our own code, with our own content and red palette.
