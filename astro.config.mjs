import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jrmgraphy.com', // Replace with actual domain later if different
  output: 'static',
  build: {
    assets: 'assets'
  },
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'es',
      locales: {
        en: 'en',
        es: 'es',
      },
    },
  })]
});

