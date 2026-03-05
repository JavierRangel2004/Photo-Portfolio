# Migración de Jekyll a Astro - JRMGraphy Portfolio

## Estado Actual (Jekyll)

### Estructura del Proyecto

```
Photo-Portfolio/
├── _config.yml              # Configuración Jekyll
├── _data/
│   ├── categories.yml       # Metadata de categorías
│   └── site_info.yml        # Info del sitio
├── _layouts/                # Templates Jekyll
│   ├── default.html
│   ├── home.html
│   ├── gallery.html
│   ├── category.html
│   └── page.html
├── _includes/               # Componentes reutilizables
│   ├── header.html
│   ├── navigation.html
│   ├── footer.html
│   └── modal.html
├── assets/
│   ├── css/styles.css       # Estilos personalizados
│   ├── js/script.js        # Lógica de galerías
│   └── images/             # Imágenes RAW por categoría
│       ├── portraits/      # 110 webp + 67 jpg
│       ├── nature/         # 58 webp
│       ├── product/        # 58 jpg + 58 webp
│       ├── concert/        # 96 webp + 96 jpg (AAAORIGINAL/)
│       ├── city/           # 39 webp
│       └── creativity/     # 45 webp
├── gallery/                 # Páginas de categorías (markdown)
│   ├── nature.md
│   ├── portraits.md
│   ├── concert.md
│   └── product.md
└── [páginas raíz]          # index.md, about.md, contact.md, gallery.md
```

### Cómo se usan las imágenes actualmente

1. **Metadata en `_data/categories.yml`**:
   - Define `prefix`, `start`, `count` para cada categoría
   - JavaScript genera nombres: `{prefix} ({i}).webp`

2. **Generación dinámica en `script.js`**:
   - `generateImageList()` crea arrays de nombres de archivos
   - Rutas hardcodeadas: `/assets/images/${category}/${filename}`
   - Sin validación de existencia de archivos

3. **Carga de imágenes**:
   - Home: carousel horizontal con selección aleatoria
   - Categorías: infinite scroll (20 por batch)
   - Lazy loading básico con `loading="lazy"`
   - Sin `srcset`/`sizes` ni optimización de tamaños

### Problemas identificados

- Sin ordenamiento por fecha de captura
- No hay metadata por foto (títulos, descripciones, alt text)
- Imágenes no optimizadas para web
- Dependencia de nombres de archivo específicos
- Layout de categorías incompleto

---

## Plan de Migración a Astro

### Nueva Estructura

```
Photo-Portfolio/
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── GalleryGrid.astro
│   │   ├── PhotoCard.astro
│   │   └── CategoryFilter.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── gallery/
│   │       ├── index.astro
│   │       └── [category].astro
│   ├── lib/
│   │   └── photos.ts        # Helpers para trabajar con fotos
│   ├── data/
│   │   └── photos.json      # Generado automáticamente
│   └── styles/
│       └── styles.css
├── public/
│   └── photos/              # Imágenes optimizadas
│       ├── portraits/
│       ├── nature/
│       ├── product/
│       ├── concert/
│       ├── city/
│       └── creativity/
├── assets/                  # Mantener como RAW input
│   └── images/             # (sin cambios, materia prima)
├── scripts/
│   └── generate-photos.mjs # Script de procesamiento
├── astro.config.mjs
├── package.json
└── netlify.toml
```

### Pipeline Automático de Fotos

1. **Input**: `assets/images/<categoria>/*` (imágenes RAW)
2. **Procesamiento** (`scripts/generate-photos.mjs`):
   - Lee EXIF (DateTimeOriginal) o fallback a mtime/ctime
   - Optimiza con `sharp` → `public/photos/<categoria>/<nombre>.webp`
   - Genera `src/data/photos.json` ordenado por fecha descendente
3. **Output**: 
   - Imágenes optimizadas en `public/photos/`
   - JSON con metadata en `src/data/photos.json`

### Estructura de `photos.json`

```json
[
  {
    "id": "portraits-20241001-DSC_1234",
    "category": "portraits",
    "src": "/photos/portraits/DSC_1234.webp",
    "date": "2024-10-01T15:30:00.000Z",
    "originalName": "portraits (1).webp",
    "sessionDate": "2024-10-01",
    "width": 2048,
    "height": 1365
  }
]
```

**Nota**: Los campos `width` y `height` se obtienen de las imágenes optimizadas y se usan para determinar la orientación (landscape/portrait/square) en el carrusel del home.

### Preparación para Features Futuras

- Cada foto tiene `id` único y estable
- Campo `sessionDate` para agrupar por sesión
- Estructura lista para integrar Firebase (likes, vistas)
- Helper functions preparadas para ordenar por popularidad

---

## Checklist de Migración

- [x] Documentar estructura actual
- [x] Crear proyecto Astro base
- [x] Crear script `generate-photos.mjs`
- [x] Migrar layouts y componentes
- [x] Migrar páginas
- [x] Adaptar CSS
- [x] Configurar Netlify
- [x] Actualizar README
- [x] Implementar filtrado correcto sin acumulación
- [x] Implementar masonry gallery
- [x] Crear HomeCarousel component
- [ ] Probar script de generación de fotos
- [ ] Verificar build completo

---

## Sistema de Filtrado

### Implementación

El filtrado funciona mediante **query strings** en la URL:

- Home: `/?category=portraits` o `/` para "All"
- Gallery: `/gallery?category=concert` o `/gallery` para "All"

### Componentes

1. **CategoryFilter** (`src/components/CategoryFilter.astro`):
   - Usado en Gallery
   - Renderiza chips/botones con links normales (`<a>`)
   - Cada click navega a una nueva URL (SSR)
   - Sin manipulación de DOM del lado del cliente

2. **CategoryDropdown** (`src/components/CategoryDropdown.astro`):
   - Usado en Home
   - Dropdown con `<select>` que redirige mediante `onchange`
   - Navegación limpia sin acumulación

### Comportamiento

- **Home (`/`)**: 
  - Carrusel horizontal con fotos aleatorias
  - "All": 5 fotos por categoría mezcladas
  - Categoría específica: 15 fotos aleatorias de esa categoría
  
- **Gallery (`/gallery`)**:
  - Masonry layout con todas las fotos
  - "All": todas las fotos ordenadas por fecha
  - Categoría específica: todas las fotos de esa categoría ordenadas por fecha

### Sin Acumulación

- Cada cambio de categoría recarga la página completamente (SSR)
- No hay scripts que agreguen contenido dinámicamente
- El HTML renderizado contiene solo las fotos de la categoría seleccionada
- No se cargan scripts legacy de Jekyll

---

## Layout Masonry

### Implementación

El masonry se implementa con **CSS Columns** en `GalleryGrid.astro`:

```css
.masonry-gallery {
  column-count: 3;        /* Desktop: 3 columnas */
  column-gap: 1.5rem;
}

@media (max-width: 1024px) {
  .masonry-gallery {
    column-count: 2;     /* Tablet: 2 columnas */
  }
}

@media (max-width: 640px) {
  .masonry-gallery {
    column-count: 1;     /* Móvil: 1 columna */
  }
}
```

### Características

- **Respeta proporciones naturales**: Las imágenes mantienen su aspect ratio original
- **Sin cropping forzado**: No se usa `object-fit: cover` ni heights fijos
- **Responsive**: Se adapta automáticamente a diferentes tamaños de pantalla
- **Break-inside: avoid**: Evita que las fotos se corten entre columnas

### Componentes Afectados

- `PhotoCard.astro`: Removido `aspect-ratio: 4/3` y `object-fit: cover`
- `GalleryGrid.astro`: Implementado masonry con CSS columns
- Las imágenes ahora usan `width: 100%; height: auto;`

---

## Scripts Legacy Eliminados

- **Ningún script de Jekyll se carga**: Verificado que no hay referencias a `assets/js/script.js`
- **Modal handler simplificado**: Usa delegación de eventos en `BaseLayout.astro`
- **Sin manipulación de DOM**: Todo el contenido se renderiza server-side

---

## Notas Técnicas

### Home vs Gallery

- **Home**: Carrusel horizontal (`HomeCarousel.astro`) - peek general del trabajo
- **Gallery**: Masonry completo (`GalleryGrid.astro`) - archivo completo

---

## Carrusel del Home

### Implementación de Altura Uniforme

El carrusel del home usa una **CSS custom property** (`--carousel-height`) para mantener todas las tarjetas con la misma altura:

1. **Cálculo dinámico de altura**:
   - JavaScript calcula la altura máxima basada en las imágenes cargadas
   - Considera el aspect ratio de cada imagen y el ancho del slide
   - Aplica la altura más alta encontrada a todas las tarjetas

2. **CSS Custom Property**:
   ```css
   .home-carousel-slide {
     height: var(--carousel-height, 420px); /* fallback: 420px */
   }
   ```

3. **Comportamiento de las imágenes**:
   - Usa `object-fit: contain` (NO `cover`) para evitar recortes
   - Las imágenes se adaptan dentro del contenedor sin cortarse
   - Verticales se ven altas, horizontales se ajustan en ancho

### Componentes

- **HomeCarousel.astro**: Contenedor principal del carrusel
- **HomePhotoCard.astro**: Componente específico para fotos del carrusel (separado de `PhotoCard.astro` usado en gallery)

### Características

- **Altura uniforme**: Todas las tarjetas tienen la misma altura (basada en la foto más alta)
- **Sin recortes**: Las imágenes usan `object-fit: contain` para no cortarse
- **Badge overlay**: El label de categoría es un overlay absoluto que no afecta la altura
- **Sin líneas visibles**: Eliminado padding/margin que causaba franjas debajo de las fotos
- **Responsive**: Se ajusta en móvil manteniendo la altura uniforme

### Lógica de Cálculo

```javascript
// Pseudo-código del cálculo
1. Esperar a que todas las imágenes se carguen
2. Para cada imagen:
   - Obtener ancho del slide
   - Calcular altura basada en aspect ratio natural
   - Comparar con altura máxima actual
3. Aplicar altura máxima a todas las tarjetas via CSS custom property
4. Recalcular en resize de ventana
```

### Orientación de Fotos

El carrusel detecta la orientación de cada foto usando `width` y `height` del JSON:

- **`getPhotoOrientation(photo)`**: Determina si es `landscape`, `portrait` o `square`
- **Clases CSS aplicadas**:
  - `.home-carousel-image--landscape`: Llena ancho (100% width, object-fit: cover)
  - `.home-carousel-image--portrait`: Llena alto (100% height, object-fit: cover)
  - `.home-carousel-image--square`: Llena ancho (100% width, object-fit: cover)

### Comportamiento Visual

- **Horizontales/Cuadradas**: Ocupan todo el ancho de la tarjeta, pueden recortarse mínimamente arriba/abajo
- **Verticales**: Ocupan todo el alto de la tarjeta, pueden recortarse mínimamente a los lados
- **Sin espacios**: Eliminado padding/margin que causaba franjas visibles
- **Badge overlay**: El label de categoría es absoluto y no afecta el layout

### Filtrado

- Basado en navegación (query strings)
- Cada cambio recarga la página completamente
- No hay estado del lado del cliente que cause acumulación

---

## Notas de Implementación

### Ordenamiento por Fecha

- Prioridad: EXIF DateTimeOriginal
- Fallback: mtime del archivo
- Orden: descendente (más nuevo primero)

### Agrupación por Sesión

- Fotos del mismo día (`sessionDate`) se consideran misma sesión
- Útil para mostrar bloques cronológicos en la UI

### IDs Únicos

- Formato: `{category}-{date}-{hash}`
- Hash basado en nombre de archivo original
- Estable entre builds si el archivo no cambia

