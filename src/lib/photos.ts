import photosData from '../data/photos.json';

interface PhotoRecord {
  id: string;
  category: string;
  src: string;
  date: string;
  sessionDate: string;
  originalName: string;
  width?: number;
  height?: number;
}

export interface Photo {
  id: string;
  category: string;
  src: string;
  date: string;
  sessionDate: string;
  originalName: string;
  width?: number;
  height?: number;
}

export type PhotoOrientation = 'landscape' | 'portrait' | 'square';

const allPhotos: Photo[] = (photosData as PhotoRecord[]).map((photo) => {
  const width = photo.width && photo.width > 0 ? photo.width : undefined;
  const height = photo.height && photo.height > 0 ? photo.height : undefined;

  return {
    ...photo,
    width,
    height,
  };
});

// Obtener orientación de una foto
export function getPhotoOrientation(photo: Photo): PhotoOrientation {
  const { width, height } = photo;
  if (!width || !height) return 'landscape'; // fallback
  
  if (width === height) return 'square';
  return width > height ? 'landscape' : 'portrait';
}

// Cargar todas las fotos
export function getAllPhotos(): Photo[] {
  return allPhotos;
}

// Obtener fotos por categoría
export function getPhotosByCategory(category: string): Photo[] {
  if (category === 'all') {
    return getAllPhotos();
  }
  return getAllPhotos().filter(photo => photo.category === category);
}

// Obtener todas las categorías únicas
export function getCategories(): string[] {
  const categories = new Set<string>();
  getAllPhotos().forEach(photo => {
    categories.add(photo.category);
  });
  return Array.from(categories).sort();
}

// Agrupar fotos por sesión (mismo día)
export function groupPhotosBySession(photos: Photo[]): Map<string, Photo[]> {
  const grouped = new Map<string, Photo[]>();
  
  photos.forEach(photo => {
    const sessionDate = photo.sessionDate;
    if (!grouped.has(sessionDate)) {
      grouped.set(sessionDate, []);
    }
    grouped.get(sessionDate)!.push(photo);
  });
  
  // Ordenar cada sesión por fecha (más nuevo primero)
  grouped.forEach((sessionPhotos, date) => {
    sessionPhotos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });
  
  return grouped;
}

// Obtener foto por ID
export function getPhotoById(id: string): Photo | undefined {
  return getAllPhotos().find(photo => photo.id === id);
}

// Obtener fotos ordenadas por popularidad (preparado para futuro)
// Por ahora, solo devuelve las fotos ordenadas por fecha
// En el futuro, aquí se podría integrar con Firebase para obtener likes/vistas
export function getPhotosByPopularity(limit?: number): Photo[] {
  const photos = getAllPhotos();
  // TODO: Integrar con Firebase para obtener likes/vistas
  // Por ahora, devolver ordenadas por fecha (más nuevo primero)
  const sorted = photos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

// Obtener imágenes aleatorias de una categoría
export function getRandomPhotosByCategory(category: string, count: number): Photo[] {
  const photos = getPhotosByCategory(category);
  const shuffled = [...photos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Obtener imágenes aleatorias de todas las categorías (para home)
// Devuelve un número específico de imágenes por categoría
export function getRandomPhotosFromAllCategories(perCategory: number = 5): Photo[] {
  const categories = getCategories();
  const result: Photo[] = [];
  
  categories.forEach(category => {
    const categoryPhotos = getPhotosByCategory(category);
    if (categoryPhotos.length > 0) {
      const randomPhotos = getRandomPhotosByCategory(category, perCategory);
      result.push(...randomPhotos);
    }
  });
  
  // Mezclar todas las fotos para que no estén agrupadas por categoría
  return result.sort(() => Math.random() - 0.5);
}
