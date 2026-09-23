---
name: JRMGraphy
description: Mesa de edición — an authored photographic portfolio on warm paper.
colors:
  paper: "#f0eee8"
  ink: "#252720"
  muted: "#62635a"
  line: "#cccac0"
  accent: "#9e351e"
typography:
  display:
    fontFamily: '"Cormorant Garamond", Georgia, serif'
    fontSize: "clamp(54px, 6.7vw, 96px)"
    fontWeight: 400
    lineHeight: 0.91
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Cormorant Garamond", Georgia, serif'
    fontSize: "clamp(36px, 4.1vw, 65px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Cormorant Garamond", Georgia, serif'
    fontSize: "clamp(32px, 3.6vw, 56px)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  body:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: '"Manrope", sans-serif'
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  square: "0"
  photo-control: "50%"
spacing:
  gutter: "clamp(22px, 4vw, 72px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "18px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
  text-link:
    textColor: "{colors.ink}"
    padding: "8px 0"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "8px 0 13px"
  inquiry-choice:
    textColor: "{colors.ink}"
    padding: "12px 14px"
    rounded: "{rounded.square}"
  inquiry-choice-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: JRMGraphy

## Overview

**Creative North Star: "Mesa de edición"**

A photographic editing table translated into an editorial interface: warm paper, near-black ink, large serif statements, and real color photography with clean edges. Asymmetry comes from deliberate image sizes and offsets within a strict grid, while captions and restrained sans-serif copy make the work easy to browse.

The interface feels authored, quiet, and precise. Vermilion marks interaction; the photographs supply the visual richness. Motion reveals and refocuses an existing composition, with equivalent static states for reduced motion and useful links before JavaScript runs.

**Key Characteristics:**

- Real photography with separate, legible captions and copy.
- Large serif statements paired with small sans-serif navigation and metadata.
- Flat paper surfaces, fine rules, and staggered photographic compositions.
- Purposeful reveal and selection motion with reduced-motion equivalents.

## Colors

A warm, restrained paper-and-ink palette supports full-color photography. Frontmatter values are normative and correspond to the root custom properties in `src/styles/editorial.css`.

### Primary

- **Vermilion / accent:** focus outlines, selected gallery links, primary-action hover, text selection, and the closing contact arrow. Keep it sparse.

### Neutral

- **Warm paper / paper:** page canvas and text or controls on dark surfaces.
- **Near-black ink / ink:** primary text, filled actions, selected inquiry choices, and the author section.
- **Muted olive-gray / muted:** captions, support copy, and secondary metadata.
- **Fine paper rule / line:** navigation dividers, form underlines, and section boundaries.

**The Photograph First Rule.** Keep the strongest color and texture in the photographs; use the accent to mark interaction rather than decorate whole surfaces.

## Typography

**Display Font:** Cormorant Garamond with Georgia and serif fallbacks. Regular and italic (400) are locally served WOFF2 faces with font-display swap.

**Body Font:** Manrope with sans-serif fallback. Body, navigation, captions, and form controls share this voice. The stylesheet declares regular, 600, and 700 faces; the current declarations use the same local Manrope font file.

The serif creates the photographic editorial voice; italic phrases add emphasis without a second display family. Sans-serif copy stays quieter and supports practical reading. There is no fixed modular scale: headings use context-specific fluid clamps.

### Hierarchy

- **Display:** the frontmatter display role describes the home hero; inner-page titles use related fluid sizes. Hero italic lines are offset rather than centered.
- **Headline:** section statements use the headline role, with other large statements scaled to their context.
- **Title:** story titles use the title role; process titles are smaller (30px).
- **Body:** the base body role is reduced to 12–14px for many editorial passages. Paragraphs have a global maximum width of 65ch, often constrained further by their layout.
- **Label:** navigation and metadata range from 9–12px; labels use normal case rather than a universal uppercase treatment.

## Layout

The shared fluid gutter aligns the masthead, page content, section rules, and footer. At widths of at least 1600px the body is centered with a maximum width of 1900px. Desktop compositions mix two-column sections, alternating three-column stories, and a three-column masonry gallery. Large section intervals (commonly 100–150px) give photographs room; controls and captions use closer spacing.

The home editing table contains three offset images. The selected image has a flex weight of 1.55 while the others use 1; mobile selection uses 1.35. It is a specific home composition, not a required layout for every page. Story image/detail pairs keep their copy separate.

At 1100px and below, navigation and story spacing tighten. At 760px and below, desktop navigation becomes a modal menu, major content grids become single-column, story image pairs sit above copy, and gallery columns reduce to two. The home table retains three images with smaller gaps and heights. Narrow-screen refinements further stack the form pairs. Typography and spacing use explicit mobile adjustments rather than simple uniform scaling.

## Elevation & Depth

The system has no box-shadow vocabulary. Depth comes from paper/ink contrast, image scale, whitespace, staggered placement, and controlled motion. The mobile menu uses a translucent dark backdrop; the photo viewer uses a full dark canvas. Neither is a floating, shadowed card.

**The Flat Paper Rule.** Separate content with space, fine rules, scale, and contrast; do not introduce card shadows.

## Shapes

Images, filled actions, fields, and inquiry choices have square corners. Thin single rules divide related content. Small circular arrow/expand controls appear over photographs; this is a local image-control shape, not a global pill treatment. Image containers clip zoom and reveal motion to their clean rectangular edges.

## Components

### Buttons and links

Primary actions are square ink blocks with paper text, 12px labels, a minimum height of 56px, and an inline arrow. Hover changes the fill to accent over 0.3s. Editorial text links use a single ink underline, 12px labels, and a minimum height of 40px; their arrows move slightly upward and right on hover. Quiet links retain a simple text underline.

The shared keyboard focus treatment is a 2px accent outline with 6px offset. Form fields use 4px offset. Disabled buttons lower opacity to 0.5 and show a waiting cursor. Reduced motion removes transitions and photo-hover transforms.

### Inquiry choices and fields

Category radio choices look like rectangular outlined labels; checked choices invert to ink and paper. They wrap naturally, and keyboard focus outlines the visible label. Fields have a transparent background and bottom rule, with small labels above. Textareas resize vertically and start at a minimum height of 120px.

The form validates required values, disables repeated submission while pending, and announces sending, success, and failure inline. Failure keeps entered values. Status uses the existing text surface rather than toast cards; there is no separate visual error-color token.

### Navigation

The masthead is a ruled horizontal line of wordmark, small links, language switch, and contact action. Desktop links reveal an underline on hover and retain it for the current page. Gallery navigation marks the current category in accent with an underline. Mobile opens a full-height paper dialog with large serif navigation and a visible close control; closing restores focus to its opener.

### Photographic frames

Photographs are the system’s card equivalent: clean rectangular images, a caption underneath, and a discreet circular expand control revealed on hover or keyboard focus. They have no enclosing card background, radius, or shadow. Fullscreen viewing preserves the image proportions and provides captions, close, previous/next controls, and arrow-key navigation; closing restores focus to the source.

### Editing-table selection and motion

The home specialty selector uses small text buttons with an underlined pressed state. Selection enlarges the corresponding frame and updates supporting copy and contact destination; GSAP Flip preserves spatial continuity over 0.85s. Controls are exposed only when JavaScript initializes; the underlying gallery links remain useful without it.

Entrance motion combines brief vertical text reveals and clipped photographic reveals. Story details drift only on desktop widths of at least 900px. Image hover scales are subtle (1.025–1.045). Reduced-motion users receive immediate state changes without these entrance, scroll, or hover movements. Work and galleries settle photographs in visually ordered batches of at most six with a capped stagger. Interior headings, service chapters, about copy and the contact form have restrained entrance sequences. Native document transitions preserve navigation where supported; ordinary links remain the fallback. The viewer expands from the selected photograph, decodes the next image before fading, and exits faster than it enters. One animation owns each element’s transform. The extension sidecar records motion values and representative components.

## Do's and Don'ts

### Do:

- Do use Javier’s real photographs as the evidence of the work.
- Do keep copy on its own readable surface and preserve clear image edges.
- Do use the shared paper, ink, muted, line, and accent roles consistently.
- Do provide visible keyboard focus and equivalent touch interactions.
- Do preserve content and state changes when motion is reduced.

### Don't:

- Don’t replace the editing-table world with decorative collage or arbitrary image tilts.
- Don’t turn photographs into generic rounded cards with drop shadows.
- Don’t depend on hover, dragging, a custom cursor, or scroll hijacking for navigation.
- Don’t use generated imagery as evidence of Javier’s portfolio.

## Local exploration: Bosque / Raíces (2026-09-23)

Home now uses a dark forest stage (#182e27), cream type and ochre root trajectories. Three unequal organic photographic apertures grow from the existing JR leaf monogram. Authored SVG linework draws once; pointer and keyboard focus highlight the branch belonging to each photographic vertical. Direct gallery and inquiry links remain available throughout. Mobile uses a vertically staggered composition. Reduced motion skips entrance choreography and presents the complete composition.

Shared contact invitations carry a quieter root signature. Interior gallery, services and inquiry behavior is preserved. Bosque surface tokens are restored: cream #f3ecd9, green #24473c, muted #536459, line #c5c9b5 and accessible ochre #80632c. This is a local exploration, not a deployment.

### Raíces: cinematic extension

Home now enhances the static vector root signature with a deterministic Canvas 2D field: 51 root strands and 204 lateral branches track the monogram and image geometry. Drawing is scheduled on geometry/interaction changes, with capped pixel density and offscreen gating. Desktop viewports at least 960×700 use a finite pinned scroll sequence that brings each photographic vertical forward with bilingual narrative. Touch layouts keep the vertical composition without pinning. Reduced-motion users retain the static vector composition; keyboard focus releases the pinned sequence and exposes all links. No new dependencies.
