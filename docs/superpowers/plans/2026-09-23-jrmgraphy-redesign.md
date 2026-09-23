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
- [ ] Commit, preserve remote staging ancestry, push staging and verify the published site, routes and Netlify form recognition. Record exact deployed commit and any verification limitations.
