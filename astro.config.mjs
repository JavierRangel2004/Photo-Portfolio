import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://jrmgraphy.com',
  output: 'static',
  build: {
    assets: 'assets'
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          en: 'en',
          es: 'es',
        },
      },
    }),
    tailwind()
  ]
});
