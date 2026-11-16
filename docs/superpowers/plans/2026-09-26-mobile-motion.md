# Mobile-first page signatures

Extend the approved Bosque/Raíces language. User explicitly requests unique authored animation for principal pages and every specific gallery, with mobile as primary audience. Preserve bilingual content, selected photography, lead conversion, and native scrolling.

1. Gallery opening: curated, bounded two-photo composition (three on selected work). Product opens four shutter panels; portraits opens an iris with focusing brackets; events parts two stage wings; archive unfurls a leaf-shaped aperture; selection assembles three prints. Keep original media visible without JS and with reduced motion. Exclude opening photos from the following grid to avoid duplication, preserve lightbox access.
2. Main pages: services draws a branching route into chapter photos; about uses an optical frame around the author portrait; contact grows four leaves from real validated progress and unfolds the selected photograph; thanks presents the completed sprout. Home on small screens reveals each world as it enters view, instead of finishing all animation above/below the fold.
3. Mobile polish: navigation touch targets, stable image dimensions, no hover dependency, dialog safe areas, safe interruption and focus fallback. New module owns authored effects; generic reveal must not double-animate the same element. Avoid global ScrollTrigger cleanup across unrelated modules.
4. Validate: typecheck/build/link & image verifier/tests. Batch browser inspection of all principal ES routes, all five gallery variants, EN long copy, 360/390/430 mobile and desktop; exercise menu, lightbox, gallery links, contact errors/progress. Confirm one defect-fix pass. No claims of actual device performance or complete absence of bugs without evidence.

Budget: existing GSAP only, finite first-view timelines and bounded scroll interpolation. No autoplay video, no new image catalogue scan, no new loops. Media preference changes restore all inline styles. Publish the completed work to staging under the existing deployment authorization, after checking remote ancestry. Production remains outside the release.


## Verification and release

Implemented separate opening sequences for selection, product, portraits, events and archive; service chapter stems; author focus frame; validated contact sprout; thanks sprout; mobile home viewport reveals; animated menu and touch swipe handling. Existing photos remain zoomable, with opening photographs removed from the lower grid to avoid duplicates.

Browser pass: five gallery routes, about, services, contact, thanks and home at mobile widths 360/390/430; English archive/contact; nine principal desktop routes at 1280×900. Checked layout overflow and loaded media, screenshots of each visual family, no console errors in the desktop batch. Exercised rapid contact category changes, trimmed message validation, completion, menu open/close, photo opening/next/close and focus/scroll restoration. Fixed required-field accessible names so inline error text remains a description rather than becoming part of the name. Removed global ScrollTrigger teardown that could disrupt separately owned animations.

Checks: Astro 61 files without diagnostics; build and 31-page route/image/form verifier pass; 3 existing inquiry transport tests pass. Touch swipe implementation and reduced-motion cleanup reviewed in source; actual iOS/Android hardware, pinch/swipe gestures and frame-rate profiling were not measured. No real inquiry was submitted. Remote staging still 8f6bce6; no newer changes to preserve; main 5173927.
