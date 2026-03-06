import { createHash } from 'crypto';
import { existsSync } from 'fs';
import {
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'fs/promises';
import { basename, dirname, extname, join } from 'path';
import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import exifr from 'exifr';
import sharp from 'sharp';

const RAW_IMAGES_DIR = './assets/images';
const OUTPUT_DIR = './public/photos';
const DATA_FILE = './src/data/photos.json';
const CACHE_FILE = './.photos-cache.json';
const MIN_NEW_CATEGORY_IMAGES = 20;
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif']);

let cache = {};

function isSupportedImage(fileName) {
  return IMAGE_EXTENSIONS.has(extname(fileName).toLowerCase());
}

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

async function loadCache() {
  if (!existsSync(CACHE_FILE)) {
    cache = {};
    return;
  }

  try {
    const raw = await readFile(CACHE_FILE, 'utf-8');
    cache = JSON.parse(raw);
  } catch {
    cache = {};
  }
}

async function saveCache() {
  await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
}

async function getImageDate(imagePath) {
  try {
    const exif = await exifr.parse(imagePath, {
      pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate'],
    });

    if (exif?.DateTimeOriginal) return new Date(exif.DateTimeOriginal);
    if (exif?.CreateDate) return new Date(exif.CreateDate);
    if (exif?.ModifyDate) return new Date(exif.ModifyDate);
  } catch {
    // Fall back to file metadata below.
  }

  const fileStats = await stat(imagePath);
  return fileStats.mtime;
}

function generatePhotoId(category, originalName, date) {
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const normalizedName = basename(originalName, extname(originalName))
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase()
    .slice(0, 20);

  return `${category}-${dateStr}-${normalizedName}`;
}

async function getFileHash(filePath) {
  try {
    const buffer = await readFile(filePath);
    return createHash('md5').update(buffer).digest('hex');
  } catch {
    const fileStats = await stat(filePath);
    return `${fileStats.size}-${fileStats.mtimeMs}`;
  }
}

async function getCategoryNames(baseDir) {
  if (!(await pathExists(baseDir))) {
    return [];
  }

  const entries = await readdir(baseDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && entry.name !== 'AAAORIGINAL')
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

async function getImageFiles(dirPath) {
  if (!(await pathExists(dirPath))) {
    return [];
  }

  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && isSupportedImage(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function collectRawCategories() {
  const categories = await getCategoryNames(RAW_IMAGES_DIR);
  const result = [];

  for (const category of categories) {
    const files = await getImageFiles(join(RAW_IMAGES_DIR, category));
    if (files.length > 0) {
      result.push({ category, files });
    }
  }

  return result;
}

async function needsProcessing(inputPath, outputPath, cacheKey) {
  if (!(await pathExists(outputPath))) {
    return true;
  }

  const outputStats = await stat(outputPath);
  if (outputStats.size === 0) {
    return true;
  }

  const currentHash = await getFileHash(inputPath);
  const cachedHash = cache[cacheKey]?.hash;

  if (!cachedHash) {
    const inputStats = await stat(inputPath);
    return inputStats.mtime > outputStats.mtime;
  }

  return cachedHash !== currentHash;
}

async function processRawImage(inputPath, category, outputDir) {
  const originalName = basename(inputPath);
  const outputName = `${basename(originalName, extname(originalName))}.webp`;
  const outputPath = join(outputDir, outputName);
  const cacheKey = `${category}:${originalName}`;

  const shouldProcess = await needsProcessing(inputPath, outputPath, cacheKey);
  const fileHash = await getFileHash(inputPath);

  if (shouldProcess) {
    await ensureDir(outputDir);
    await sharp(inputPath)
      .resize(1600, 1600, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(outputPath);
  }

  cache[cacheKey] = { hash: fileHash, outputName, category };

  return {
    action: shouldProcess ? 'processed' : 'skipped',
    outputPath,
    outputName,
  };
}

async function buildPhotoRecord(category, fileName, filePath) {
  const date = await getImageDate(filePath);
  const metadata = await sharp(filePath).metadata();

  return {
    id: generatePhotoId(category, fileName, date),
    category,
    src: `/photos/${category}/${fileName}`,
    date: date.toISOString(),
    sessionDate: date.toISOString().split('T')[0],
    originalName: fileName,
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}

async function rebuildMetadataFromOutput() {
  const categories = await getCategoryNames(OUTPUT_DIR);
  const photos = [];

  for (const category of categories) {
    const categoryDir = join(OUTPUT_DIR, category);
    const files = await getImageFiles(categoryDir);

    for (const file of files) {
      const filePath = join(categoryDir, file);
      photos.push(await buildPhotoRecord(category, file, filePath));
    }
  }

  photos.sort((a, b) => new Date(b.date) - new Date(a.date));

  await ensureDir(dirname(DATA_FILE));
  await writeFile(DATA_FILE, JSON.stringify(photos, null, 2), 'utf-8');

  return photos;
}

function summarizeByCategory(photos) {
  const summary = new Map();

  for (const photo of photos) {
    summary.set(photo.category, (summary.get(photo.category) || 0) + 1);
  }

  return summary;
}

async function promptForMode() {
  if (!input.isTTY || !output.isTTY) {
    throw new Error('Interactive mode is not available. Run with --mode=add or --mode=overwrite.');
  }

  const rl = readline.createInterface({ input, output });

  try {
    while (true) {
      const answer = await rl.question(
        [
          '',
          'How do you want to sync assets/images into public/photos?',
          '1) overwrite - replace public/photos entirely from assets/images',
          '2) add       - add/update images by category and keep existing public/photos',
          `   New categories in add mode require at least ${MIN_NEW_CATEGORY_IMAGES} images.`,
          'Choose 1 or 2: ',
        ].join('\n')
      );

      const normalized = answer.trim().toLowerCase();
      if (normalized === '1' || normalized === 'overwrite') {
        return 'overwrite';
      }
      if (normalized === '2' || normalized === 'add') {
        return 'add';
      }
    }
  } finally {
    rl.close();
  }
}

function getRequestedMode() {
  const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
  if (!modeArg) {
    return null;
  }

  const value = modeArg.split('=')[1]?.trim().toLowerCase();
  if (value === 'add' || value === 'overwrite') {
    return value;
  }

  throw new Error(`Unsupported mode "${value}". Use --mode=add or --mode=overwrite.`);
}

async function validateAddMode(rawCategories, publicCategorySet) {
  const invalidCategories = rawCategories.filter(({ category, files }) => {
    return !publicCategorySet.has(category) && files.length < MIN_NEW_CATEGORY_IMAGES;
  });

  if (invalidCategories.length === 0) {
    return;
  }

  const details = invalidCategories
    .map(({ category, files }) => `- ${category}: ${files.length} images`)
    .join('\n');

  throw new Error(
    [
      'Cannot create new categories in add mode unless they contain at least 20 images.',
      details,
    ].join('\n')
  );
}

async function syncOverwriteMode(rawCategories) {
  console.log('\nOverwriting public/photos from assets/images...');
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await ensureDir(OUTPUT_DIR);
  cache = {};

  let processed = 0;
  let skipped = 0;

  for (const { category, files } of rawCategories) {
    const outputDir = join(OUTPUT_DIR, category);
    await ensureDir(outputDir);

    console.log(`\nCategory "${category}" (${files.length} images)`);

    for (const file of files) {
      const inputPath = join(RAW_IMAGES_DIR, category, file);
      const result = await processRawImage(inputPath, category, outputDir);

      if (result.action === 'processed') {
        processed += 1;
      } else {
        skipped += 1;
      }
    }
  }

  return { processed, skipped };
}

async function syncAddMode(rawCategories) {
  console.log('\nAdding new selections from assets/images into public/photos...');
  await ensureDir(OUTPUT_DIR);

  const publicCategories = await getCategoryNames(OUTPUT_DIR);
  const publicCategorySet = new Set(publicCategories);

  await validateAddMode(rawCategories, publicCategorySet);

  let processed = 0;
  let skipped = 0;

  for (const { category, files } of rawCategories) {
    const outputDir = join(OUTPUT_DIR, category);
    await ensureDir(outputDir);

    const isNewCategory = !publicCategorySet.has(category);
    console.log(
      `\nCategory "${category}" (${files.length} images)${isNewCategory ? ' [new category]' : ''}`
    );

    for (const file of files) {
      const inputPath = join(RAW_IMAGES_DIR, category, file);
      const result = await processRawImage(inputPath, category, outputDir);

      if (result.action === 'processed') {
        processed += 1;
      } else {
        skipped += 1;
      }
    }
  }

  return { processed, skipped };
}

async function main() {
  console.log('Preparing photo library...\n');

  await ensureDir(OUTPUT_DIR);
  await ensureDir(dirname(DATA_FILE));
  await loadCache();

  const rawCategories = await collectRawCategories();

  if (rawCategories.length === 0) {
    console.log('No input images found in assets/images. Rebuilding metadata from public/photos only.');
    const photos = await rebuildMetadataFromOutput();
    await saveCache();

    console.log(`\nMetadata rebuilt from public/photos: ${photos.length} images`);
    return;
  }

  const requestedMode = getRequestedMode();
  const mode = requestedMode || (await promptForMode());

  const syncSummary =
    mode === 'overwrite'
      ? await syncOverwriteMode(rawCategories)
      : await syncAddMode(rawCategories);

  const photos = await rebuildMetadataFromOutput();
  await saveCache();

  console.log(`\nMode: ${mode}`);
  console.log(`Processed: ${syncSummary.processed}`);
  console.log(`Skipped: ${syncSummary.skipped}`);
  console.log(`Metadata entries: ${photos.length}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log(`Processed library: ${OUTPUT_DIR}`);

  const summary = summarizeByCategory(photos);
  if (summary.size > 0) {
    console.log('\nPhotos by category:');
    for (const [category, count] of summary.entries()) {
      console.log(`- ${category}: ${count}`);
    }
  }
}

main().catch((error) => {
  console.error(`\nError: ${error.message}`);
  process.exit(1);
});
