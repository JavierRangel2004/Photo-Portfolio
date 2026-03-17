# Implementation Plan: Niche Strategy (gptNicheFinal.md)

## Brand Foundation
Before implementing structural changes, the following brand definitions must guide all copy and design decisions:

- **Core Promise:** "Documentary photography and natural portraiture for people, brands, and creative projects in CDMX."
- **Ideal User:** Artists, musicians, chefs/cafés, entrepreneurs, cultural projects, and personal brands with a human identity.
- **Brand Tone:** 
  - Human, not pretentious.
  - Professional, not cold or corporate.
  - Sensitive, but concrete and clear.
  - Artistic, but useful for business.
- **Primary CTAs (Max 3 throughout the site):**
  - "View Services"
  - "Explore Portfolio"
  - "Tell me about your project" (or "Let's talk about your session")

## Objective
Implement the commercial and positioning restructuring defined in `docs/gptNicheFinal.md` to transform the website from a generic "genre archive" into a "simple positioning machine" focused on visual services for people and brands.

## Background & Motivation
Photographic analysis revealed that JRMGraphy's strengths lie in documentary portraiture, event/music coverage, and personal work (nature/travel). The current portfolio presents too many disconnected categories and lacks a clear commercial message. The goal is to reduce friction, improve local SEO in CDMX, strictly limit the number of visible photos to increase perceived value (curation), and structure navigation around **Services** rather than abstract photographic categories.

## Scope & Impact
- **Homepage:** Radical shift in focus, moving from a general visual showcase to a conversion-focused landing page (Clear Hero + 3 Service Blocks + Trust Signals/Social Proof + Strict curation of 6-9 images).
- **Translations/i18n (`src/i18n/ui.ts`):** Complete update of copy, eliminating terms like "amateur" and adopting a professional, problem-solving tone based on the Brand Foundation.
- **Navigation:** Redesign the menu to prioritize "Services", "Portfolio" (curated), "About me", and "Contact".
- **Category System:** Introduction of new logical categories (`travel-cityscape`) and commercial groupings (`branding`, `events`, `author-archive`).
- **New Pages:** Creation of service pages optimized for local SEO.

---

## Phased Implementation Plan

### Phase 1: Brand Tone & Copy Update (i18n)
1. Edit `src/i18n/ui.ts`:
   - **Hero:** 
     - Title/Eyebrow: "Documentary photography and natural portraiture for people, brands, and creative projects in CDMX."
     - Subtitle: "Natural images for chefs, artists, entrepreneurs, events, and cultural projects."
   - **Navigation:** Change structure to `Home`, `Services`, `Portfolio`, `About me`, `Contact`. *(Note: Avoid using "Archive" in the main menu as it sounds like internal storage. Use "Portfolio" instead).*
   - **About:** Remove all references to "amateur" or insecurities. Write a confident manifesto focused on solving visual needs.
   - **Services/Categories:** Define the new blocks:
     1. Branding & Documentary Portraiture
     2. Events & Music
     3. Author's Archive (Nature / Travel / Prints - keep this lighter commercially than the first two).

### Phase 2: Homepage Redesign
1. **Hero Component (`src/components/Hero.astro`):**
   - Integrate the new, conversion-focused copy.
   - Force the main hero image to be from the strongest portrait category or use a predefined static hero image to ensure immediate impact.
   - Update main CTA to something human and direct like "Tell me about your project" instead of generic buttons.
2. **New Service Blocks (`src/components/ServiceBlocks.astro`):**
   - Replace `CategoryNav.astro` with a new `ServiceBlocks.astro` component.
   - Display 3 clear visual blocks: Branding, Events, and a lighter third block for Author's Archive.
   - Each block links to its respective service section.
3. **Trust Signals / Social Proof Section (New):**
   - Add a small section indicating ideal clients, collaborations, types of projects realized, and location (CDMX) to help visitors self-identify (e.g., "I work with artists, gastronomic projects, personal brands, and cultural spaces in CDMX.").
4. **Strict Gallery Curation:**
   - Modify `FeaturedGallery.astro` or `HomeCarousel.astro` to strictly show **6 to 9 maximum images**, intentionally selected:
     - 2 strong portraits
     - 2 branding/project images
     - 2 event/music images
     - 1-2 powerful personal/author works

### Phase 3: Service Pages & Local SEO
1. **Services Page (`src/pages/[lang]/services/index.astro`):**
   - Create a main services page detailing the core offerings.
   - Include orientative packages, focusing on what is included, who it is for, and the type of delivery. Avoid publishing rigid pricing; use "starting at" or simply close with a strong CTA to maintain flexibility.
     - *Basic Branding* (creatives, artists, entrepreneurs).
     - *Gastronomic Documentary Branding* (chefs, cafés).
     - *Cultural Event Coverage* (concerts, launches).
2. **SEO and Intentional Titles:**
   - Set specific meta titles such as: `Personal Branding Photography in CDMX | JRMGraphy`, `Event and Concert Photography in CDMX | JRMGraphy`.
3. **Context for Key Projects:**
   - Modify `GalleryGrid` or create a specific portfolio layout where certain images or groups have a 1-3 line micro-description (e.g., "Chef / documentary branding: Session focused on showing the process...").

### Phase 4: Archive Restructuring and Photographic Categories
1. **Category Cleanup:**
   - Modify the logic in `src/lib/photos.ts` and the generator script (`scripts/generate-photos.mjs`) to support the new `travel-cityscape` category.
   - Instruct the user to move architecture/travel photos currently miscategorized in `city` or `street` into the new `travel-cityscape` folder in their RAW assets.
2. **Curated Portfolio:**
   - Limit the massive load on the Portfolio page. Internally structure the portfolio page to show curated collections (10-15 images per commercial section) rather than a full dump.

## Verification
- [ ] Copy reflects a professional tone, eliminating the word "amateur" and following the Brand Tone guide.
- [ ] Homepage displays 3 service blocks, trust signals, and a strict maximum of 6-9 intentionally selected images.
- [ ] Navigation includes links to Services and Portfolio (not Archive).
- [ ] Service pages include flexible package descriptions and meta tags with local SEO (CDMX).
- [ ] Primary CTAs are human and conversion-focused ("Tell me about your project").
- [ ] The photo generation script supports new classifications (like `travel-cityscape`).

## Migration & Rollback
- By keeping original images in `assets/images/`, any changes to folder structures are reversible.
- The i18n system allows rewriting copy without affecting the base Astro component structure. If the new commercial tone does not perform well, text changes can be easily reverted to the previous commit.