# Interior motion refinement

User feedback: Work and galleries feel flat and transitions abrupt. Continue the approved editorial world and site-wide motion scope.

- Focal moment: photographs settle onto the editing table in short, spatially ordered groups; first visible images get an inner photographic settle. No repeated rectangular wipes.
- Continuity: native cross-document transitions keep navigation steady with a short content dissolve; ordinary navigation remains the fallback. The viewer opens from the selected photograph and loads the next image before fading it in.
- Supporting interiors: restrained header choreography, service chapter photo/text pairing, about portrait/copy sequence, and an immediately usable contact form.
- Budget: existing GSAP only, opacity/transform, bounded batches, no scroll hijacking, no permanent GPU hints. Reduced motion bypasses spatial choreography. Back-forward cache restores visible content.

Implementation: shared motion in src/scripts/editorial.ts; isolated viewer in src/scripts/photo-viewer.ts; view-transition and interaction CSS in editorial.css; preserve HTML routes and form behavior. Verify Work/product, services/about/contact, viewer repeated navigation/close, mobile, build/check/tests. Deploy only staging after ancestry check.

Verification: 53-file Astro check clean; 31-page build and route verifier pass; 3 existing inquiry tests pass. Independent bounded review found and confirmed fixes for competing About tweens and interrupted viewer fades. Browser checked rapid image navigation, Escape, history restoration, mobile overflow and settled visible photos. Frame-rate on physical devices and cross-browser transition support are not certified.
