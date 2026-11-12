@AGENTS.md

# E2E Studio website

One-page site for E2E Studio (brand, websites, bookings and care for small local businesses).
Full brief: `../WEBSITE-BRIEF.md`. 3D method: `../3D Updated Guide.pdf`. Brand assets: `../Logos`.

## Run it
- `npm install` then `npm run dev` → http://localhost:3000
- Test on a real phone: `npx next dev --hostname 0.0.0.0` (headless screenshots render 3D at ~1 fps).
- `npm run build` before committing.
- Screenshots (needs Chrome, site running): `node scripts/shoot.mjs http://localhost:3000 /tmp/shot 390 844 1 "0,0.5"` (width height mobile scroll-fractions). Prints console errors.

## Tech
- Next.js 16 (App Router, TypeScript), Tailwind v4, plain three.js (no react-three-fiber).
- Fonts via `next/font`: Plus Jakarta Sans (headings, logo, buttons), Inter (body).
- npm, not pnpm (pnpm isn't installed). Use `npx shadcn@latest add …` for cult-ui.

## Brand (dark-first)
- Midnight #02070A (~70%), Electric blue #0297DE (~20%), Cantaloupe #FC734D (≤10%, accent only), Cloud #F5F7F8.
- Text on blue/cantaloupe fills is midnight, never white. No exclamation marks. Warm, plain, no jargon.
- All tokens live in `app/globals.css` (`:root`). Tailwind classes: `bg-midnight`, `text-electric`, etc.

## Structure
- `app/page.tsx`: `<main class="overflow-x-clip">` → fixed `SceneCanvas` (z-0) + HTML sections (z-10).
- `components/three/`: the 3D engine. `components/sections/`: page sections.
- Icons/OG image: `app/icon.svg`, `app/apple-icon.png`, `app/opengraph-image.png`.
- Copy lives in `lib/content.ts`. Case study images: `public/work/` (site screenshots taken from the live artifact).
- Env: `CONTACT_EMAIL`, `NEXT_PUBLIC_SITE_URL` (see `.env.example`).

## 3D engine (components/three)
- `path.ts`: the ribbon's route (flow mark, then 4 stops, then the orb). `ribbon.ts`: shader ribbon + glow texture. `engine.ts`: clock, camera cues, particles, dust, nodes, cursor bend/parallax (sets `--px/--py` on `<html>`), HTML reveals. `post.ts`: bloom → ACES → grain, then adds the midnight base (clearing to midnight inside the HDR chain came out teal).
- Cues are measured from the page: hero → `.static-mark` box, steps → `[data-stop]`, end → `[data-orb]`. Change layout freely; cues re-measure on resize.
- Engine adds `has-3d` to `<html>` when running. Reduced motion or no WebGL: no engine, static mark stays, all text visible.

- Hero: `components/brand/AnimatedLogo.tsx` (CSS-animated logo, `.logo-anim` in globals.css), floating step cards, word-by-word headline. Pricing tilt: `components/ui/TiltCard.tsx`.
- All CSS motion uses the finished look as the base style, so reduced motion shows everything static.
- Smooth scroll: Lenis is created in `engine.ts` and stepped by the engine's clock (`lenis.raf` in `tick`), so page and ribbon never drift. Wheel only; touch stays native. Anchor links offset −64px for the nav. No engine → native `scroll-behavior: smooth`.
- Blueprint: `components/ui/BlueprintToggle.tsx` (footer) sets `data-blueprint` on `<html>` + localStorage `e2e-blueprint`. Engine eases `uBlueprint` (ribbon → edges + ribs, glows → ring markers); CSS adds the grid (`main::before`) and dashed card outlines.

## Key decisions / rules
- `overflow-x: clip`, never `hidden`. Scroll reveals come from scroll position, not IntersectionObserver.
- One clock drives all motion. The camera follows a scroll cue list and frames by size, not distance.
- Case study: The Cake and Candle Co. (bespoke baking, Hatfield). Name confirmed by Jay 2026-11-11. Unfinished copy is `[PLACEHOLDER]`.

## Stages
1. Scaffold ✅ 2. Static sections + brand ✅ 3. Ribbon + camera cues ✅ 4. Post/finish, Lenis, Blueprint ✅ 5. Orb + form 6. Performance pass
