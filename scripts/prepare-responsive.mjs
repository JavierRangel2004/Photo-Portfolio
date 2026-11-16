import fs from "node:fs/promises";
import sharp from "sharp";
const photos = JSON.parse(await fs.readFile("src/data/photos.json", "utf8"));
await fs.mkdir("public/responsive", { recursive: true });
let count = 0;
// Bound concurrency so image preparation also works on small Netlify builders.
for (let start = 0; start < photos.length; start += 6) {
  await Promise.all(
    photos.slice(start, start + 6).map(async (photo) => {
      const original = "public" + photo.src;
      const inputStat = await fs.stat(original);
      for (const width of [480, 960]) {
        if ((photo.width || 1600) <= width) continue;
        const target = `public/responsive/${photo.id}-${width}.webp`;
        const cached = await fs.stat(target).catch(() => null);
        if (cached && cached.mtimeMs >= inputStat.mtimeMs) continue;
        await sharp(original)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(target);
        count++;
      }
    }),
  );
}
console.log(`Responsive photographs ready (${count} generated).`);
