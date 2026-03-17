# UI/UX Refactor Plan Based on FE and Designer Advice

This plan outlines the steps required to address the feedback received from the frontend developer (Emiliano) and the UI/UX designer (Liz). The main goal is to strike a perfect balance between the visually engaging, interactive "portfolio" feel of the current production site and the business-oriented, service-selling approach of the staging refactor, while adhering to best UI/UX practices.

**Core Principle: Responsive First & Cross-Device Consistency**
Every change must be designed with responsiveness as a first-class citizen. The layout must elegantly scale down for mobile users (the primary audience for many portfolio sites) while taking full advantage of the screen real estate on large desktop monitors.

## 1. Executive Summary of Feedback

*   **Too Much Text:** The staging site is currently too text-heavy, especially in the services section. It needs to be drastically shortened and made scannable.
*   **Lack of Interactivity/Visuals:** Scrolling on staging reveals mostly text. The production site's strength was that scrolling immediately immersed the user in photos. We need to bring that interactivity back.
*   **Spacing & Layout Issues (Gap):**
    *   The footer needs more spacing (`gap`) between the email and Instagram links.
    *   Navigation/Section headers (Portfolio, Services) need better spacing.
*   **Information Architecture:** The path to the full galleries shouldn't feel "hidden" beneath walls of text.
*   **The Goal:** A fusion of both versions—visually stunning and interactive like a portfolio, but with clear, concise messaging that sells the services.

---

## 2. Actionable Plan & Implementation Details

### Phase 1: Fixing Specific UI/UX Details (Quick Wins)

**1.1 Footer Spacing (Responsive Approach)**
*   **File:** `src/components/Footer.astro` (markup) + `src/styles/styles.css` (styles for `.footer-social`)
*   **Current state:** The footer uses custom CSS classes (`site-footer`, `footer-inner`, `footer-social`), not Tailwind utilities. The email and Instagram links sit inside a `.footer-social` div with no explicit gap.
*   **Action:** Add `gap` to the `.footer-social` rule in `src/styles/styles.css`.
    *   *Mobile:* Stack items vertically (`flex-direction: column; gap: 1rem;`) or keep them side-by-side with wrapping (`flex-wrap: wrap; gap: 1rem;`).
    *   *Desktop:* Increase horizontal breathing room (`gap: 2rem;` at the `md` breakpoint or above).

**1.2 Navigation / Section Headers Spacing**
*   **File:** `src/components/Header.astro` + `src/styles/styles.css` (styles for `.nav-links`, `.nav-link`)
*   **Current state:** Header.astro already has a fully implemented mobile hamburger menu with a slide-out drawer (`nav-toggle`, `nav-drawer`). The desktop links use a `.nav-links` list. Styles live in `src/styles/styles.css`.
*   **Action:** Increase horizontal gap between desktop nav items in the `.nav-links` rule (e.g., `gap: 1.5rem` or `gap: 2rem`). Ensure mobile drawer links have adequate padding for touch-friendly targets (min 44×44px tap area). **Do not** re-implement the hamburger menu—it already exists.
*   **Note:** `CategoryNav.astro` is a photography categories card grid, not navigation header. It is currently **not imported on any page** and can be ignored or removed.

### Phase 2: Restructuring the Services Section

**2.1 Drastic Text Reduction**
*   **Files:** `src/components/ServiceBlocks.astro`, `src/pages/[lang]/services/index.astro`, and i18n dictionaries in `src/i18n/ui.ts`
*   **Current state:** `ServiceBlocks.astro` (used on the home page) already shows each service as a card with a cover image, a one-line description, and 3 bullet points. The dedicated services page (`services/index.astro`) is significantly more text-heavy, with package details, process steps, and CTA sections—all rendered inline with Tailwind.
*   **Action:**
    *   Audit the text in `src/i18n/ui.ts` for all `service.*` and `services.*` keys. Ask: "Is this sentence absolutely critical to sell the service?"
    *   Shorten descriptions to one punchy line each. Trim the 3 bullet points per service to essential value propositions only.
    *   On the dedicated services page, reduce the `services.intro.body`, package descriptions (`services.package.*.includes`), and process step bodies (`services.process.step*.body`) to be more concise and scannable.

**2.2 Visual Layout Refinement**
*   **Files:** `src/components/ServiceBlocks.astro` (custom CSS in `styles.css`), `src/pages/[lang]/services/index.astro` (Tailwind)
*   **Current state:** `ServiceBlocks.astro` already pairs each service with a cover photo (via `getServiceCoverPhoto()`) and renders them in a `.services-overview-grid` card layout. The dedicated services page uses a `lg:grid-cols-3` Tailwind grid for packages.
*   **Action:**
    *   The home page service cards already have images—focus on **reducing the text within each card** rather than redesigning the layout structure.
    *   On the dedicated services page, consider adding representative photos alongside each package to break up the text-heavy columns.
    *   *Mobile:* Ensure single-column stacking works well. Consider a horizontal scroll carousel for the home page service cards to save vertical space.
    *   *Desktop:* The existing grid is fine; ensure `max-w-7xl mx-auto` constrains width on ultra-wide screens (already in place on the services page).

### Phase 3: Bringing Back Interactivity & The "Portfolio Feel"

**3.1 Visual Interactivity on Scroll**
*   **Files:** `src/pages/[lang]/index.astro`, `src/components/FeaturedGallery.astro`, `src/components/ServiceBlocks.astro`
*   **Current state:** The home page layout is: `Hero` → `ServiceBlocks` → `TrustSignals` → `FeaturedGallery` → `StatementBlock` → `ContactCTA`. The `FeaturedGallery` component displays a masonry photo grid with reveal animations. `TrustSignals` and `StatementBlock` are text-only sections. **Note:** `PortfolioSection.astro` is used on the gallery page (`/gallery`), not the home page. `HomeCarousel.astro` is currently **not imported on any page** (orphaned component).
*   **Action:**
    *   Reorder or intersperse photo-rich content earlier in the scroll. Consider moving `FeaturedGallery` above `TrustSignals` so users see photos sooner after the hero.
    *   Optionally re-introduce `HomeCarousel.astro` (currently unused) between sections to add scrollable photo interactivity.
    *   The existing `.reveal` class provides fade-in animations on scroll—verify these are working and that they respect `prefers-reduced-motion`.
    *   *Mobile:* `FeaturedGallery` masonry should use 1–2 columns. *Desktop:* 3–4 columns with capped aspect ratios.

**3.2 Clearer Pathways to Galleries**
*   **Files:** `src/components/FeaturedGallery.astro`, `src/components/ServiceBlocks.astro`, `src/components/ContactCTA.astro`
*   **Current state:** `FeaturedGallery` has a "View All" link to `/gallery`. `ServiceBlocks` links each service card to `/services#[group-id]`. `ContactCTA` has a link to `/gallery`. The gallery page (`/gallery`) uses `PortfolioSection.astro` which has archive links to individual gallery groups.
*   **Action:**
    *   Make the "View All" CTA in `FeaturedGallery` more prominent (larger button, contrasting style).
    *   In `ServiceBlocks`, ensure the service cards clearly convey they are clickable pathways—consider adding a visible arrow or "View gallery →" label.
    *   Ensure all CTA tap targets are at least 44×44px for mobile users.
*   **Note:** `CategoryDropdown.astro` is a filter dropdown for use within gallery pages—it is currently **not imported on any page** (orphaned component) and is not relevant to gallery pathway navigation from the home page.

### Phase 4: Content Audit & Final Polish

*   **File:** `src/i18n/ui.ts`
*   **Action:** Review all text strings in both Spanish and English. Ensure the tone is direct, professional, and concise.
*   **Action:** Rigorously test the refactored layout.
    *   Check on small mobile devices (e.g., iPhone SE) for overlapping text or broken grids.
    *   Check on standard laptops and tablets.
    *   Check on large desktop monitors (27"+) to ensure content doesn't stretch awkwardly and max-width containers are working as intended.

---

## 3. Recommended Order of Execution

1.  **UI Quick Fixes:** Add `gap` to `.footer-social` in `src/styles/styles.css` and increase desktop nav link spacing in `.nav-links`. The mobile hamburger/drawer already works—just verify touch target sizing.
2.  **Content Pruning:** Rewrite and shorten the text in `src/i18n/ui.ts` for all `service.*`, `services.*`, `trust.*`, and `statement.*` keys. Focus on the dedicated services page text which is the heaviest.
3.  **Services Refinement:** Reduce text within the existing `ServiceBlocks.astro` cards (they already have images and a grid layout). On the dedicated services page, add photos to the package columns.
4.  **Interactivity Injection:** Reorder home page sections in `[lang]/index.astro` to show photos sooner (e.g., move `FeaturedGallery` higher). Optionally re-enable `HomeCarousel`. Make gallery CTAs more prominent and ensure touch-friendly targets throughout.

---

## 4. Unused Components (Cleanup Candidates)

The following components exist in `src/components/` but are **not imported on any page**. They may be legacy from the production site or unused experiments:

*   `CategoryNav.astro` — Photography categories card grid
*   `HomeCarousel.astro` — Horizontal photo carousel with category filtering
*   `CategoryDropdown.astro` — Category filter dropdown
*   `CategoryFilter.astro` — Category filter (variant)
*   `GalleryGrid.astro` — Gallery grid layout

Consider re-using `HomeCarousel.astro` as part of Phase 3, or removing unused components to reduce project clutter.
