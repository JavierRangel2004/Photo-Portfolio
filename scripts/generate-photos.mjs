import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { existsSync } from 'fs';
import { createHash } from 'crypto';
import sharp from 'sharp';
import exifr from 'exifr';

const RAW_IMAGES_DIR = './assets/images';
const OUTPUT_DIR = './public/photos';
const DATA_FILE = './src/data/photos.json';
const CACHE_FILE = './.photos-cache.json';

// Extensiones de imagen soportadas
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif'];

// Cache en memoria
let cache = {};
let photosProcessed = [];
let interrupted = false;

// Variable para guardar la función de guardado (se definirá después)
let saveProgressFn = null;

/**
 * Obtiene la fecha de captura de una imagen
 * Prioridad: EXIF DateTimeOriginal > mtime del archivo
 */
async function getImageDate(imagePath) {
  try {
    // Intentar leer EXIF
    const exif = await exifr.parse(imagePath, {
      pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate']
    });

    if (exif?.DateTimeOriginal) {
      return new Date(exif.DateTimeOriginal);
    }
    if (exif?.CreateDate) {
      return new Date(exif.CreateDate);
    }
    if (exif?.ModifyDate) {
      return new Date(exif.ModifyDate);
    }
  } catch (error) {
    // Si falla EXIF, continuar con fallback
  }

  // Fallback: usar mtime del archivo
  try {
    const stats = await stat(imagePath);
    return stats.mtime;
  } catch (error) {
    // Si todo falla, usar fecha actual
    console.warn(`No se pudo obtener fecha para ${imagePath}, usando fecha actual`);
    return new Date();
  }
}

/**
 * Genera un ID único para una foto
 */
function generatePhotoId(category, originalName, date) {
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const nameHash = basename(originalName, extname(originalName))
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .substring(0, 20);
  return `${category}-${dateStr}-${nameHash}`;
}

/**
 * Genera un hash del archivo para cache
 */
async function getFileHash(filePath) {
  try {
    const fs = await import('fs/promises');
    const buffer = await fs.readFile(filePath);
    return createHash('md5').update(buffer).digest('hex');
  } catch (error) {
    // Si no se puede leer, usar mtime como fallback
    const stats = await stat(filePath);
    return `${stats.mtime.getTime()}-${stats.size}`;
  }
}

/**
 * Verifica si una imagen necesita ser procesada
 */
async function needsProcessing(inputPath, outputPath, cacheKey) {
  // Si no existe el archivo de salida, necesita procesamiento
  if (!existsSync(outputPath)) {
    return true;
  }
  
  // Si existe en cache, verificar si cambió
  if (cache[cacheKey]) {
    const cachedHash = cache[cacheKey].hash;
    const currentHash = await getFileHash(inputPath);
    
    // Si el hash es diferente, necesita reprocesamiento
    if (cachedHash !== currentHash) {
      return true;
    }
    
    // Verificar que el archivo de salida existe y es válido
    try {
      const outputStats = await stat(outputPath);
      if (outputStats.size === 0) {
        return true; // Archivo vacío, reprocesar
      }
      return false; // Ya está procesado y es válido
    } catch (error) {
      return true; // Error al leer, reprocesar
    }
  }
  
  // Si no está en cache, comparar fechas de modificación
  try {
    const inputStats = await stat(inputPath);
    const outputStats = await stat(outputPath);
    
    // Si el archivo original es más reciente, necesita reprocesamiento
    return inputStats.mtime > outputStats.mtime;
  } catch (error) {
    return true; // Error, mejor reprocesar
  }
}

/**
 * Procesa una imagen: optimiza y guarda en public/photos
 */
async function processImage(inputPath, category, outputDir) {
  try {
    const originalName = basename(inputPath);
    const ext = extname(originalName);
    const baseName = basename(originalName, ext);
    
    // Obtener fecha
    const date = await getImageDate(inputPath);
    const sessionDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Generar nombre de salida (mantener nombre original pero con .webp)
    const outputName = `${baseName}.webp`;
    const outputPath = join(outputDir, outputName);
    
    // Clave de cache única
    const cacheKey = `${category}:${originalName}`;
    
    // Verificar si necesita procesamiento
    const shouldProcess = await needsProcessing(inputPath, outputPath, cacheKey);
    
    if (!shouldProcess) {
      // Ya está procesado, leer metadata de la imagen optimizada
      const hash = await getFileHash(inputPath);
      cache[cacheKey] = { hash, processed: true };
      
      // Obtener dimensiones de la imagen optimizada existente
      let width = 0;
      let height = 0;
      try {
        const optimizedMetadata = await sharp(outputPath).metadata();
        width = optimizedMetadata.width || 0;
        height = optimizedMetadata.height || 0;
      } catch (error) {
        // Si falla, intentar leer del archivo original
        try {
          const originalMetadata = await sharp(inputPath).metadata();
          width = originalMetadata.width || 0;
          height = originalMetadata.height || 0;
        } catch (e) {
          console.warn(`No se pudieron obtener dimensiones para ${inputPath}`);
        }
      }
      
      const id = generatePhotoId(category, originalName, date);
      return {
        id,
        category,
        src: `/photos/${category}/${outputName}`,
        date: date.toISOString(),
        sessionDate,
        originalName,
        width,
        height
      };
    }
    
    // Asegurar que el directorio existe
    await mkdir(outputDir, { recursive: true });
    
    // Optimizar imagen con sharp y obtener metadata
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    await image
      .resize(1600, 1600, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    // Obtener dimensiones de la imagen optimizada
    const optimizedMetadata = await sharp(outputPath).metadata();
    const width = optimizedMetadata.width || metadata.width || 0;
    const height = optimizedMetadata.height || metadata.height || 0;
    
    // Actualizar cache
    const hash = await getFileHash(inputPath);
    cache[cacheKey] = { hash, processed: true };
    
    // Generar ID único
    const id = generatePhotoId(category, originalName, date);
    
    return {
      id,
      category,
      src: `/photos/${category}/${outputName}`,
      date: date.toISOString(),
      sessionDate,
      originalName,
      width,
      height
    };
  } catch (error) {
    console.error(`Error procesando ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Carga el cache desde disco
 */
async function loadCache() {
  try {
    if (existsSync(CACHE_FILE)) {
      const fs = await import('fs/promises');
      const cacheData = await fs.readFile(CACHE_FILE, 'utf-8');
      cache = JSON.parse(cacheData);
      console.log(`📦 Cache cargado: ${Object.keys(cache).length} entradas`);
    }
  } catch (error) {
    console.warn('⚠️  No se pudo cargar el cache, empezando desde cero');
    cache = {};
  }
}

/**
 * Guarda el cache en disco
 */
async function saveCache() {
  try {
    const fs = await import('fs/promises');
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (error) {
    console.warn('⚠️  No se pudo guardar el cache:', error.message);
  }
}

/**
 * Guarda el progreso parcial (fotos procesadas hasta ahora)
 */
async function saveProgress() {
  try {
    const fs = await import('fs/promises');
    
    // Ordenar las fotos procesadas
    photosProcessed.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Guardar JSON parcial
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(photosProcessed, null, 2),
      'utf-8'
    );
    
    // Guardar cache
    await saveCache();
    
    console.log(`💾 Guardadas ${photosProcessed.length} fotos procesadas`);
  } catch (error) {
    console.error('❌ Error guardando progreso:', error.message);
  }
}

// Asignar la función para que esté disponible en los handlers
saveProgressFn = saveProgress;

// Manejar interrupciones (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n\n⚠️  Interrupción detectada. Guardando progreso...');
  interrupted = true;
  if (saveProgressFn) {
    await saveProgressFn();
  }
  console.log('✅ Progreso guardado. Puedes continuar después.');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n⚠️  Terminación detectada. Guardando progreso...');
  interrupted = true;
  if (saveProgressFn) {
    await saveProgressFn();
  }
  process.exit(0);
});

/**
 * Procesa todas las imágenes de una categoría
 */
async function processCategory(categoryName, categoryPath) {
  const photos = [];
  
  try {
    const files = await readdir(categoryPath);
    const imageFiles = files.filter(file => {
      const ext = extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });
    
    console.log(`\n📁 Categoría "${categoryName}": ${imageFiles.length} imágenes`);
    
    const outputDir = join(OUTPUT_DIR, categoryName);
    let processed = 0;
    let skipped = 0;
    
    for (const file of imageFiles) {
      if (interrupted) {
        break;
      }
      
      const inputPath = join(categoryPath, file);
      
      try {
        // Saltar subdirectorios (como AAAORIGINAL en concert)
        const stats = await stat(inputPath);
        if (stats.isDirectory()) {
          continue;
        }
        
        const baseName = basename(file, extname(file));
        const outputName = `${baseName}.webp`;
        const outputPath = join(outputDir, outputName);
        const cacheKey = `${categoryName}:${file}`;
        
        // Verificar si necesita procesamiento
        const shouldProcess = await needsProcessing(inputPath, outputPath, cacheKey);
        
        if (!shouldProcess) {
          skipped++;
          // Aún así necesitamos la metadata para el JSON
          const date = await getImageDate(inputPath);
          const sessionDate = date.toISOString().split('T')[0];
          const id = generatePhotoId(categoryName, file, date);
          
          photos.push({
            id,
            category: categoryName,
            src: `/photos/${categoryName}/${outputName}`,
            date: date.toISOString(),
            sessionDate,
            originalName: file
          });
          continue;
        }
        
        const photo = await processImage(inputPath, categoryName, outputDir);
        if (photo) {
          photos.push(photo);
          processed++;
          process.stdout.write(`\r   Procesando: ${processed} procesadas, ${skipped} omitidas...`);
        }
      } catch (error) {
        console.warn(`\n⚠️  Saltando ${file}: ${error.message}`);
        continue;
      }
    }
    
    console.log(`\r   ✅ ${categoryName}: ${processed} procesadas, ${skipped} omitidas (cache)`);
    
  } catch (error) {
    console.error(`❌ Error procesando categoría ${categoryName}:`, error.message);
  }
  
  return photos;
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando generación de fotos...\n');
  
  if (!existsSync(RAW_IMAGES_DIR)) {
    console.error(`❌ No se encuentra el directorio ${RAW_IMAGES_DIR}`);
    process.exit(1);
  }
  
  // Cargar cache existente
  await loadCache();
  
  // Asegurar que el directorio de salida existe
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(dirname(DATA_FILE), { recursive: true });
  
  try {
    // Leer todas las carpetas en assets/images
    const categories = await readdir(RAW_IMAGES_DIR);
    
    for (const category of categories) {
      if (interrupted) {
        break;
      }
      
      const categoryPath = join(RAW_IMAGES_DIR, category);
      const stats = await stat(categoryPath);
      
      // Solo procesar directorios (categorías)
      if (stats.isDirectory() && category !== 'AAAORIGINAL') {
        const photos = await processCategory(category, categoryPath);
        photosProcessed.push(...photos);
      }
    }
    
    if (interrupted) {
      console.log('\n⚠️  Proceso interrumpido. Guardando progreso...');
      await saveProgress();
      return;
    }
    
    // Ordenar por fecha descendente (más nuevo primero)
    photosProcessed.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Guardar JSON final
    const fs = await import('fs/promises');
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(photosProcessed, null, 2),
      'utf-8'
    );
    
    // Guardar cache
    await saveCache();
    
    console.log(`\n✅ Procesadas ${photosProcessed.length} fotos`);
    console.log(`📁 JSON guardado en ${DATA_FILE}`);
    console.log(`💾 Cache guardado en ${CACHE_FILE}`);
    
    // Mostrar resumen por categoría
    const byCategory = {};
    photosProcessed.forEach(photo => {
      byCategory[photo.category] = (byCategory[photo.category] || 0) + 1;
    });
    
    console.log('\n📊 Resumen por categoría:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} fotos`);
    });
    
    // Estadísticas de cache
    const cacheEntries = Object.keys(cache).length;
    console.log(`\n💡 Cache: ${cacheEntries} entradas guardadas`);
    console.log('   (Las imágenes ya procesadas se omitirán en la próxima ejecución)');
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    
    // Intentar guardar progreso antes de salir
    if (photosProcessed.length > 0) {
      console.log('\n💾 Intentando guardar progreso...');
      await saveProgress();
    }
    
    process.exit(1);
  }
}

main();

