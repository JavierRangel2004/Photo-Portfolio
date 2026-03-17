# Astro to Tailwind CSS Migration Guide

## Fase 1: Instalación y Configuración

Para integrar Tailwind CSS en el proyecto utilizando las prácticas más modernas y la integración oficial de Astro, ejecuta el siguiente comando en la raíz de tu proyecto.

```bash
npx astro add tailwind
```

Este comando instalará `@astrojs/tailwind` y `tailwindcss`, y automáticamente actualizará tu archivo `astro.config.mjs` para incluir la integración, además de crear el archivo `tailwind.config.mjs` base.

Tu `astro.config.mjs` debería verse así tras la actualización:

```javascript
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
```
*Documentación oficial:* [Astro Tailwind Integration](https://docs.astro.build/en/guides/integrations-guide/tailwind/)

## Fase 2: Configuración del Tema (Design Token Mapping)

A partir de tu archivo `src/styles/styles.css`, hemos extraído tu sistema de diseño actual. Reemplaza el contenido de `tailwind.config.mjs` con la siguiente configuración para mapear exactamente tus variables nativas a las utilidades de Tailwind:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffffff',
          dark: '#d4d4d4',
          light: '#a3a3a3',
        },
        secondary: {
          DEFAULT: '#ff3366',
          dark: '#cc0033',
        },
        background: {
          DEFAULT: '#050505',
          alt: '#0a0a0a',
          light: '#151515',
          card: 'rgba(20, 20, 20, 0.6)',
        },
        text: {
          DEFAULT: '#e5e5e5',
          light: '#ffffff',
          muted: '#888888',
        }
      },
      spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
      },
      transitionDuration: {
        fast: '200ms',
        base: '300ms',
        slow: '400ms',
      },
      borderRadius: {
        sm: '10px',
        md: '20px',
        lg: '50px',
      },
      zIndex: {
        background: '-1',
        base: '1',
        dropdown: '10',
        modal: '100',
        navbar: '1000',
      }
    },
  },
  plugins: [],
}
```

## Fase 3: Guía de Traducción de Clases

Aquí tienes ejemplos de cómo deberías migrar las clases custom que estás utilizando en componentes como `src/pages/[lang]/gallery/index.astro` a las nuevas utilidades que hemos configurado en Tailwind.

| Clase Original | Utilidades de Tailwind Correspondientes |
| --- | --- |
| `.container` | `max-w-[1200px] mx-auto px-lg max-md:px-md` |
| `.gallery-page-copy` | `flex flex-col gap-md py-xl` (ajustable según el diseño visual) |
| `.gallery-page-title` | `font-heading text-5xl md:text-6xl font-bold text-primary mb-md` |
| `.gallery-page-subtitle` | `text-xl text-text-muted mb-lg` |
| `.section-eyebrow` | `text-sm font-semibold uppercase tracking-wider text-secondary` |
| `.btn-outline-light` | `px-xl py-sm rounded-lg border-2 border-primary-light bg-primary-light text-text-light font-medium transition-all duration-base hover:bg-primary-dark hover:border-primary-dark hover:text-background hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]` |
| `.card` | `rounded-md bg-background-card border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-slow hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] overflow-hidden` |
| `.navbar` | `bg-[#050505]/60 backdrop-blur-[16px] border-b border-white/5 py-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]` |

## Fase 4: Estrategia de Refactorización

Para evitar romper el sitio en producción durante la migración, te sugiero este flujo de trabajo paso a paso:

1. **Instalación y Setup Base:**
   - Corre `npx astro add tailwind` y valida que no haya errores de compilación.
   - Aplica la configuración en `tailwind.config.mjs` proporcionada en la Fase 2.
   - Configura las directivas `@tailwind base; @tailwind components; @tailwind utilities;` en tu archivo global o deja que la integración de Astro las inyecte. Mueve tus resets base de CSS debajo de la capa correspondiente si es necesario.

2. **Migración de Layouts Globales y Nav/Footer:**
   - Convierte los componentes principales (`BaseLayout.astro`, `Header.astro`, `Footer.astro`).
   - Reemplaza `.navbar`, `.site-footer` y clases de grilla/flexbox en estos archivos.
   - Retira el CSS equivalente de `styles.css`.

3. **Migración de Componentes de UI Modulares:**
   - Refactoriza componentes aislados como `PhotoCard.astro`, `Modal.astro`, `ContactCTA.astro`.
   - Reemplaza las utilidades específicas y elementos interactivos (.btn, .card).

4. **Migración de Páginas (Gallery, About, Contact):**
   - Refactoriza `index.astro` de cada ruta (ej. `src/pages/[lang]/gallery/index.astro`).
   - Aplica las utilidades de espaciado (`gap-md`, `py-xl`), tipografía (`font-heading`, `text-primary`) y layout (`flex`, `grid`).

5. **Limpieza Final (Cleanup):**
   - Una vez que todas las páginas se vean igual o mejor usando Tailwind, elimina el archivo original `styles.css` (o reduce drásticamente las líneas que ahora maneja Tailwind).
   - Elimina las variables CSS del `:root` ya que estarán integradas directamente en tu configuración de Tailwind.