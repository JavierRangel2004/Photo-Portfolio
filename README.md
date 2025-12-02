# JRMGraphy - Photography Portfolio

Portfolio de fotografía profesional construido con **Astro**, optimizado para rendimiento y experiencia de usuario.

## 🚀 Características

- **Pipeline automático de fotos**: Procesa y optimiza imágenes automáticamente desde Lightroom
- **Ordenamiento por fecha**: Las fotos se ordenan automáticamente por fecha de captura (EXIF)
- **Galería moderna**: Grid responsivo con CSS Grid
- **Optimización de imágenes**: Generación automática de versiones WebP optimizadas
- **Filtros por categoría**: Navegación fácil entre categorías
- **Preparado para features futuras**: Estructura lista para likes/popularidad (Firebase)

## 📁 Estructura del Proyecto

```
Photo-Portfolio/
├── assets/images/          # Imágenes RAW (input)
│   ├── portraits/
│   ├── nature/
│   ├── product/
│   ├── concert/
│   ├── city/
│   └── creativity/
├── src/
│   ├── components/        # Componentes Astro
│   ├── layouts/           # Layouts base
│   ├── pages/             # Páginas del sitio
│   ├── lib/               # Helpers y utilidades
│   ├── data/              # photos.json (generado automáticamente)
│   └── styles/            # Estilos CSS
├── public/
│   ├── photos/            # Imágenes optimizadas (generadas)
│   └── assets/            # Assets estáticos (logo, etc.)
├── scripts/
│   └── generate-photos.mjs  # Script de procesamiento
└── docs/                  # Documentación
```

## 🛠️ Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <repo-url>
   cd Photo-Portfolio
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

## 📸 Cómo Agregar Nuevas Fotos

### Flujo de trabajo:

1. **Exportar desde Lightroom**:
   - Exporta tus fotos con los nombres que prefieras
   - No necesitas renombrarlas manualmente

2. **Copiar a la carpeta correspondiente**:
   - Copia las fotos a `assets/images/<categoria>/`
   - Ejemplo: `assets/images/portraits/DSC_1234.jpg`

3. **Commit y push**:
   ```bash
   git add assets/images/
   git commit -m "Add new photos"
   git push
   ```

4. **Build automático**:
   - En Netlify, el build ejecutará automáticamente:
     - `npm run prepare:photos` → Procesa y optimiza imágenes
     - `npm run build` → Genera el sitio estático

### El script automáticamente:

- ✅ Lee la fecha de captura desde EXIF (o usa mtime como fallback)
- ✅ Optimiza las imágenes a WebP (1600px máximo, calidad 85%)
- ✅ Genera `src/data/photos.json` ordenado por fecha
- ✅ Agrupa fotos por sesión (mismo día)

## 🏃 Desarrollo Local

1. **Procesar fotos** (primera vez o cuando agregues nuevas):
   ```bash
   npm run prepare:photos
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   El sitio estará disponible en `http://localhost:4321`

3. **Build de producción**:
   ```bash
   npm run build
   ```
   Genera el sitio estático en `dist/`

4. **Preview del build**:
   ```bash
   npm run preview
   ```

## 📝 Scripts Disponibles

- `npm run prepare:photos` - Procesa y optimiza todas las imágenes
- `npm run dev` - Inicia servidor de desarrollo (procesa fotos automáticamente)
- `npm run build` - Build de producción (procesa fotos automáticamente)
- `npm run preview` - Preview del build de producción

## 🎨 Categorías

Las categorías se detectan automáticamente desde las carpetas en `assets/images/`. Actualmente:

- `portraits` - Retratos
- `nature` - Naturaleza
- `product` - Producto
- `concert` - Conciertos
- `city` - Ciudad
- `creative` - Creatividad

## 🔮 Features Futuras (Preparado)

El proyecto está estructurado para facilitar la implementación de:

- **Likes/Popularidad**: Cada foto tiene un `id` único que puede usarse con Firebase
- **Filtro "Most Popular"**: Función `getPhotosByPopularity()` lista para integrar
- **Agrupación por sesión**: Función `groupPhotosBySession()` disponible para UI

Ver `docs/astro-migration.md` para más detalles.

## 🌐 Deploy en Netlify

El proyecto está configurado para deploy automático en Netlify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

El archivo `netlify.toml` contiene la configuración.

## 📚 Tecnologías

- **Astro** - Framework estático
- **Sharp** - Procesamiento de imágenes
- **Exifr** - Lectura de metadatos EXIF
- **Bootstrap 5** - UI framework
- **TypeScript** - Tipado (opcional)

## 📄 Licencia

Todos los derechos reservados - JRMGraphy
