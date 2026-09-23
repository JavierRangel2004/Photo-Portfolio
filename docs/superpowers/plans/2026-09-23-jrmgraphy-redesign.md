# JRMGraphy Redesign Implementation Plan

**Goal:** Deliver the approved Mesa de edición experience with authored motion and contextual inquiries, then publish only to staging.
**Architecture:** Astro static pages, shared editorial shell and tokens, curated photo data and progressive enhancement. Keep legacy URLs and SEO content; isolate interaction in small scripts.
**Tech Stack:** Astro, TypeScript, CSS, GSAP, Netlify Forms.

## Global constraints
- Preserve staging commits 1b7debf and 2f1d9da.
- Real photography only; no invented customer claims or prices.
- Spanish/English, keyboard navigation, reduced motion, responsive imagery.
- Contact form/email is the primary conversion.
- Publish to staging only.

## Execution
- [x] Create `src/lib/editorial.ts`: typed vertical definitions, explicit curated filename selections, bilingual factual descriptions; resolve photos against the existing catalog and fail on missing IDs.
- [x] Replace shell (`BaseLayout`, `Header`, `Footer`) and `src/styles/editorial.css`: shared paper/ink identity, semantic nav, accessible mobile dialog, correct metadata and production-only analytics.
- [x] Build `EditorialHero`, `EditorialImage`, `InquiryForm`: first-screen photo selection with animated image rearrangement; responsive images; contextual form with inline success/error and duplicate-send protection.
- [x] Replace home, services, about, contact and gallery routes. Preserve old group URLs and SEO content via redesigned `SeoLandingBody` and `ContactCTA`.
- [x] Add page entrances, image reveals, bounded scroll movement and image expansion. Disable movement for reduced motion while retaining all controls.
- [x] Validate build, active route graph, photo taxonomy, form behavior, desktop/mobile and keyboard. Investigate pre-existing typecheck configuration and dependency issues before changing them.
- [x] Run design detector once on completed changes; get independent finish review under Impeccable, resolve material findings and document built system.
- [x] Commit, preserve remote staging ancestry, push staging and verify the published site, routes and Netlify form recognition. Record exact deployed commit and any verification limitations.

## Published result

- Verified deployment: `b62d6df05157ada8266aec492c4cfc6adf800094`.
- Staging: https://staging--jrmgraphy.netlify.app/es/
- Netlify deploy: https://app.netlify.com/projects/jrmgraphy/deploys/6ab37e57c4184b000840f49c
- Public HTML reports the exact commit, noindex and no production analytics.
- Netlify processed the contact form and retained the contact form identity. Actual inquiry receipt/email notification was not tested.
- Product, portrait, event galleries, English services and a responsive image return HTTP 200.
- Production HTML matches the pre-deployment snapshot after normalizing Cloudflare's per-response email obfuscation. Main was not pushed.
- Local validation: 31-page build, 52-file Astro check with zero errors/warnings/hints, 3 passing inquiry tests, route/image/form/taxonomy verifier passing, npm audit zero vulnerabilities.
- Independent finish review approved staging with minor residual polish, documented in `docs/redesign-finish-review-2026-09-23.md`. No field performance benchmark was run.
