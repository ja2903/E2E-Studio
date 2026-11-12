@AGENTS.md

# E2E Studio website

One-page site for E2E Studio (brand, websites, bookings and care for small local businesses).
Full brief: `../WEBSITE-BRIEF.md`. 3D method: `../3D Updated Guide.pdf`. Brand assets: `../Logos`.

## Run it
- `npm install` then `npm run dev` → http://localhost:3000
- Test on a real phone: `npx next dev --hostname 0.0.0.0` (headless screenshots render 3D at ~1 fps).
- `npm run build` before committing.
- Live: https://e2-e-studio.vercel.app (Vercel, auto-deploys from `main`; env vars set in Vercel settings, redeploy after changing them).
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
- Env: `CONTACT_EMAIL`, `RESEND_API_KEY`, optional `MAIL_FROM`, `NEXT_PUBLIC_SITE_URL` (see `.env.example`; real values only in `.env.local`).
- Booking form: `components/sections/BookForm.tsx` → `app/api/book/route.ts` (validates, honeypot `website`, 5/10min per IP, sends via Resend REST with plain fetch, reply-to = visitor). Form also has `method=post action=/api/book`: without JS the route takes the form post and 303-redirects to `/booking/sent` or `/booking/failed` (static pages, `components/sections/BookingResult.tsx`), so details never go in the URL. Loader markup lives in `app/page.tsx` (home only).
- Phone testing: `allowedDevOrigins` in `next.config.ts` must list the Mac's Wi-Fi IP, or the phone gets no JS (endless reloads, no 3D, form falls back).
- Orb: `components/ui/WarpOrb.tsx`, adapted from cult-ui AI Blob Warp (`@paper-design/shaders-react`; CSS pulse instead of `motion`). Pauses off-screen / reduced motion; carries `data-orb`.

## 3D engine (components/three)
- `path.ts`: the ribbon's route (flow mark, then 4 stops, then the orb). `ribbon.ts`: shader ribbon + glow texture. `engine.ts`: clock, camera cues, particles, dust, nodes, cursor bend/parallax (sets `--px/--py` on `<html>`), HTML reveals. `post.ts`: bloom → ACES → grain, then adds the midnight base (clearing to midnight inside the HDR chain came out teal).
- Cues are measured from the page: hero → `.static-mark` box, steps → `[data-stop]`, end → `[data-orb]`. Change layout freely; cues re-measure on resize.
- Performance: frame-rate watchdog in `engine.ts` (`watchFps`): below 40 fps over 2s it steps down (1x pixels → bloom off → 0.75x), never back up; level shows as `data-quality` on `<html>`. Pixel ratio cap 1.75 phones / 2 desktop. Test the slow path by busy-waiting 30ms per rAF via `SHOOT_EVAL` (headless runs ~60 fps).
- Loader: inline script in `layout.tsx` adds `loading-3d` (skipped for reduced motion); `.loader` (logo on midnight) covers the page until `has-3d`, failure, or 4s (CSS backstop 5s).
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
1. Scaffold ✅ 2. Static sections + brand ✅ 3. Ribbon + camera cues ✅ 4. Post/finish, Lenis, Blueprint ✅ 5. Orb + form ✅ 6. Performance pass ✅
