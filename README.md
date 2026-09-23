# JRMGraphy - Photography Portfolio

Professional photography portfolio built with Astro and a manual photo library sync pipeline.

## Features

- Astro-based static site
- Manual photo pipeline with `sharp` and `exifr`
- Generated `src/data/photos.json` metadata
- Responsive masonry archive
- Category filtering and lightbox viewer

## Project Structure

```text
Photo-Portfolio/
|-- assets/images/            # Raw source images by category
|-- public/photos/            # Optimized generated images
|-- scripts/generate-photos.mjs
|-- src/components/
|-- src/layouts/
|-- src/lib/
|-- src/pages/
|-- src/data/photos.json      # Generated metadata
|-- public/styles/styles.css
`-- docs/
```

## Install

```bash
npm install
```

## Local Development

1. Sync photos when you add or update raw selections in `assets/images`:

```bash
npm run prepare:photos
```

The command will ask which mode to use:

- `overwrite` - replace `public/photos` entirely from `assets/images`
- `add` - add/update images by category and keep the current processed library

In `add` mode, any brand new category must contain at least 20 images.

2. Start the Astro dev server:

```bash
npm run dev
```

The site runs at `http://localhost:4321`.

`npm run dev` and `npm run build` generate cached 480/960px responsive variants from the existing photo library. They do not import raw photos automatically.
The site data is built from `public/photos`, not directly from `assets/images`.

## Production

Build the site:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Available Scripts

- `npm run prepare:photos` - Interactively sync `assets/images` into `public/photos` and rebuild `src/data/photos.json` from the processed library
- `npm run dev` - Start the Astro dev server only
- `npm run build` - Build the static site
- `npm run preview` - Preview the production build

## Photo Workflow

1. Cull and select new raw images into `assets/images/<category>/`
2. Run `npm run prepare:photos`
3. Choose `add` to append/update, or `overwrite` to replace the processed library
4. Run `npm run dev` for local work, or `npm run build` for production output

## Deploy

Netlify is configured to publish `dist/` using:

- Build command: `npm run build`
- Publish directory: `dist`

If the processed library changes, run `npm run prepare:photos` before deploying so `public/photos` and `src/data/photos.json` stay in sync.

## Stack

- Astro
- Sharp
- Exifr
- TypeScript support via Astro

## Editorial design and verification

The approved Mesa de edición system is documented in `DESIGN.md`. Curated commercial verticals live in `src/lib/editorial.ts`; original city/nature work remains in the archive.

Use Node 22.12 or newer supported by Astro 7, then run:

```bash
npm ci
npm run check
npm test
npm run build
npm run verify
```

Netlify builds `staging` at https://staging--jrmgraphy.netlify.app/ and production from `main`. Only `CONTEXT=production` enables analytics and indexing. Forms use Netlify Forms; notification delivery is configured in the Netlify dashboard.
