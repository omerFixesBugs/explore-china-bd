# Agent profile

- **Product:** Explore China BD marketing site (single page). Study-in-China admissions + Chinese visas, audience in Bangladesh.
- **Level:** L1 (pre-launch marketing site, no user data yet). Raise to L3 before going live with real contact details.
- **Flags:** ui public
- **Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (`row:` custom variant), GSAP + ScrollTrigger + @gsap/react, Lenis, raw WebGL.
- **Source dirs:** app components lib content
- **Content:** all copy and image URLs live in `content/site.ts`. Fees, contact details, refusal policy and the address are placeholders.
- **Checks:** `npm run lint`, `npm run build`. Visual: desktop 1440×900 (sideways runs), iPad landscape 1180×820 touch (sideways), 390×844 touch (stacked with motion), `prefers-reduced-motion` (stacked, no smoke), `?edit` (stacked).
- **Decisions:** the brief came from the developer's design spec (2026-11-12) and stands as the agreed plan.
- **Decision (2026-11-12):** the developer asked to follow manifesto.blandina.org's design and motion directly. Layout, type scale, buttons, cursor modes, preloader, menu, footer orb with a breathing overlay, and the endless loop are rebuilt in our own code, with our own content.
- **Decision (2026-11-13):** palette moved from red to jade/teal (sea, sky, jade) with gold accents to fit a travel and study-abroad agency. Student stories became testimonial cards (placeholders until real students sign off).
- **Decision (2026-11-13):** sideways runs now apply to any landscape screen from 1024px, mouse or touch. Phones and portrait tablets get a stacked version with the same effects: live smoke stirred by touch (vertical burns via `vertical` surfaces), sticky hero, pinned intro, sticky service stack, swipe rows (`mo:` variant). Ring cursor stays mouse-only. Contact: 01770-768159 (also WhatsApp) and 01306-277017; offices in Dhaka and Chattogram, clients from all of Bangladesh.
