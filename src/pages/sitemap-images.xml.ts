import type { APIRoute } from 'astro';
import {
  getAllPhotos,
  getPhotoGroup,
  getPortfolioGroupSlug,
  type Photo,
} from '../lib/photos';

const altByCategoryEs: Record<string, string> = {
  portraits: 'Retrato editorial por JRMGraphy en Ciudad de México',
  concert: 'Cobertura de concierto por JRMGraphy en Ciudad de México',
  product: 'Fotografía de producto por JRMGraphy en Ciudad de México',
  city: 'Fotografía urbana por JRMGraphy en Ciudad de México',
  nature: 'Fotografía documental de naturaleza por JRMGraphy',
  'travel-cityscape': 'Fotografía de viaje y cityscape por JRMGraphy',
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function absoluteImageUrl(src: string, origin: string): string {
  const encoded = src
    .split('/')
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join('/');
  return `${origin}${encoded}`;
}

export const GET: APIRoute = ({ site }) => {
  const origin = site ? site.origin : 'https://jrmgraphy.com';
  const photos = getAllPhotos();

  const byGroupUrl = new Map<string, Photo[]>();
  for (const photo of photos) {
    const group = getPhotoGroup(photo);
    const slug = getPortfolioGroupSlug(group);
    const pageUrl = `${origin}/es/gallery/${slug}/`;
    const bucket = byGroupUrl.get(pageUrl) ?? [];
    bucket.push(photo);
    byGroupUrl.set(pageUrl, bucket);
  }

  const entries = Array.from(byGroupUrl.entries())
    .map(([pageUrl, pagePhotos]) => {
      const images = pagePhotos
        .map((photo) => {
          const imgUrl = absoluteImageUrl(photo.src, origin);
          const caption = altByCategoryEs[photo.category] ??
            'Fotografía por JRMGraphy en Ciudad de México';
          return `    <image:image>\n      <image:loc>${escapeXml(imgUrl)}</image:loc>\n      <image:caption>${escapeXml(caption)}</image:caption>\n    </image:image>`;
        })
        .join('\n');
      return `  <url>\n    <loc>${escapeXml(pageUrl)}</loc>\n${images}\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
