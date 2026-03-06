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

`npm run dev` only starts the dev server. It does not process photos automatically.
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
