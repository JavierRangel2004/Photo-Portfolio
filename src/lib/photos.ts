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
export type PortfolioGroupId = 'branding' | 'events' | 'author-archive';
export type PortfolioGroupSlug = 'branding' | 'events' | 'archive';
export type RawCategory =
  | 'portraits'
  | 'concert'
  | 'city'
  | 'nature'
  | 'product'
  | 'travel-cityscape';

export interface PortfolioGroup {
  id: PortfolioGroupId;
  categories: RawCategory[];
  homepageCount: number;
  portfolioCount: number;
}

const allPhotos: Photo[] = (photosData as PhotoRecord[]).map((photo) => {
  const width = photo.width && photo.width > 0 ? photo.width : undefined;
  const height = photo.height && photo.height > 0 ? photo.height : undefined;

  return {
    ...photo,
    width,
    height,
  };
});

const sortedPhotos = [...allPhotos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const portfolioGroups: PortfolioGroup[] = [
  {
    id: 'branding',
    categories: ['portraits', 'product'],
    homepageCount: 3,
    portfolioCount: 12,
  },
  {
    id: 'events',
    categories: ['concert'],
    homepageCount: 3,
    portfolioCount: 12,
  },
  {
    id: 'author-archive',
    categories: ['nature', 'city', 'travel-cityscape'],
    homepageCount: 2,
    portfolioCount: 10,
  },
];

const groupSlugMap: Record<PortfolioGroupId, PortfolioGroupSlug> = {
  branding: 'branding',
  events: 'events',
  'author-archive': 'archive',
};

const slugGroupMap: Record<PortfolioGroupSlug, PortfolioGroupId> = {
  branding: 'branding',
  events: 'events',
  archive: 'author-archive',
};

function sortByDateDesc(photos: Photo[]): Photo[] {
  return [...photos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function selectCuratedPhotos(photos: Photo[], count: number): Photo[] {
  const sorted = sortByDateDesc(photos);
  if (count >= sorted.length) {
    return sorted;
  }

  if (count <= 1) {
    return sorted.slice(0, 1);
  }

  const step = (sorted.length - 1) / (count - 1);
  const pickedIndexes = new Set<number>();

  for (let index = 0; index < count; index += 1) {
    pickedIndexes.add(Math.round(index * step));
  }

  return Array.from(pickedIndexes)
    .sort((a, b) => a - b)
    .map((photoIndex) => sorted[photoIndex])
    .slice(0, count);
}

// Obtener orientación de una foto
export function getPhotoOrientation(photo: Photo): PhotoOrientation {
  const { width, height } = photo;
  if (!width || !height) return 'landscape'; // fallback
  
  if (width === height) return 'square';
  return width > height ? 'landscape' : 'portrait';
}

// Cargar todas las fotos
export function getAllPhotos(): Photo[] {
  return sortedPhotos;
}

// Obtener fotos por categoría
export function getPhotosByCategory(category: string): Photo[] {
  if (category === 'all') {
    return getAllPhotos();
  }
  return getAllPhotos().filter((photo) => photo.category === category);
}

// Obtener todas las categorías únicas
export function getCategories(): string[] {
  const categories = new Set<string>();
  getAllPhotos().forEach(photo => {
    categories.add(photo.category);
  });
  return Array.from(categories).sort();
}

export function getRawCategories(): RawCategory[] {
  return getCategories() as RawCategory[];
}

export function getPortfolioGroups(): PortfolioGroup[] {
  return portfolioGroups.filter((group) =>
    group.categories.some((category) => getPhotosByCategory(category).length > 0),
  );
}

export function getPortfolioGroup(groupId: PortfolioGroupId): PortfolioGroup | undefined {
  return portfolioGroups.find((group) => group.id === groupId);
}

export function getPortfolioGroupSlug(groupId: PortfolioGroupId): PortfolioGroupSlug {
  return groupSlugMap[groupId];
}

export function getPortfolioGroupIdFromSlug(slug: string): PortfolioGroupId | undefined {
  return slugGroupMap[slug as PortfolioGroupSlug];
}

export function getPhotosByGroup(groupId: PortfolioGroupId): Photo[] {
  const group = portfolioGroups.find((item) => item.id === groupId);
  if (!group) {
    return [];
  }

  const photos = group.categories.flatMap((category) => getPhotosByCategory(category));
  return sortByDateDesc(photos);
}

export function getCuratedPhotosByGroup(groupId: PortfolioGroupId, count?: number): Photo[] {
  const group = portfolioGroups.find((item) => item.id === groupId);
  if (!group) {
    return [];
  }

  return selectCuratedPhotos(getPhotosByGroup(groupId), count ?? group.portfolioCount);
}

export function getPhotoGroup(photo: Photo): PortfolioGroupId {
  const group = portfolioGroups.find((item) => item.categories.includes(photo.category as RawCategory));
  return group?.id ?? 'author-archive';
}

export function getHeroPhoto(): Photo | undefined {
  return getCuratedPhotosByGroup('branding', 1)[0] ?? getAllPhotos()[0];
}

export function getServiceCoverPhoto(groupId: PortfolioGroupId): Photo | undefined {
  return getCuratedPhotosByGroup(groupId, 1)[0];
}

export function getHomepageFeaturedPhotos(): Photo[] {
  return portfolioGroups.flatMap((group) => getCuratedPhotosByGroup(group.id, group.homepageCount));
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
  const photos = [...getAllPhotos()];
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
