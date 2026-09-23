import { getAllPhotos, type Photo } from "./photos";
export type Lang = "es" | "en";
export type VerticalId = "product" | "portraits" | "events";
export const words = (lang: Lang, es: string, en: string) =>
  lang === "es" ? es : en;
export function photo(category: string, number: number): Photo {
  const result = getAllPhotos().find(
    (p) =>
      p.category === category &&
      p.originalName === `${category} (${number}).webp`,
  );
  if (!result)
    throw new Error(`Missing curated photograph: ${category} (${number})`);
  return result;
}
export function verticals(lang: Lang) {
  return [
    {
      id: "product" as const,
      name: words(lang, "Producto / Gastro", "Product / Food"),
      title: words(
        lang,
        "Que se antoje. Que se recuerde.",
        "Make it desirable. Make it memorable.",
      ),
      description: words(
        lang,
        "Texturas, luz y detalles que dan personalidad a lo que haces. Fotografía para marcas, bebidas, restaurantes y objetos con historia.",
        "Texture, light and details that give your work a personality. Photography for brands, drinks, restaurants and objects with a story.",
      ),
      uses: words(
        lang,
        "Campañas · Carta y menú · Catálogo · Redes",
        "Campaigns · Menus · Catalogues · Social",
      ),
      hero: photo("product", 31),
      heroPosition: "50% 48%",
      service: photo("product", 44),
      servicePosition: "50% 58%",
      contact: photo("product", 52),
      contactPosition: "55% 48%",
      story: photo("product", 56),
      storyPosition: "50% 52%",
      detail: photo("product", 52),
      detailRatio: "3 / 2",
      picks: [35, 52, 44, 31, 56, 36].map((n) => photo("product", n)),
      inquiry: "gastronomy",
    },
    {
      id: "portraits" as const,
      name: words(lang, "Retrato", "Portraits"),
      title: words(
        lang,
        "Tu presencia. Sin interpretar a nadie.",
        "Your presence. No part to play.",
      ),
      description: words(
        lang,
        "Una conversación que se convierte en imágenes. Retrato editorial y marca personal con dirección, espacio para explorar y una mirada que te reconoce.",
        "A conversation that becomes an image. Editorial and personal brand portraits with direction, room to explore and an eye for who you are.",
      ),
      uses: words(
        lang,
        "Marca personal · Editorial · Prensa · Artistas",
        "Personal brands · Editorial · Press · Artists",
      ),
      hero: photo("portraits", 97),
      heroPosition: "50% 38%",
      service: photo("portraits", 7),
      servicePosition: "50% 42%",
      contact: photo("portraits", 69),
      contactPosition: "50% 40%",
      story: photo("portraits", 70),
      storyPosition: "50% 38%",
      detail: photo("portraits", 72),
      detailRatio: "3 / 2",
      picks: [70, 97, 69, 79, 72, 7].map((n) => photo("portraits", n)),
      inquiry: "portraits",
    },
    {
      id: "events" as const,
      name: words(lang, "Eventos / Música", "Events / Music"),
      title: words(
        lang,
        "Lo que se vive una sola vez.",
        "What only happens once.",
      ),
      description: words(
        lang,
        "La energía del escenario y todo lo que sucede alrededor. Imágenes que conservan la atmósfera de un concierto, un encuentro o un lanzamiento.",
        "The energy on stage and everything around it. Images that preserve the atmosphere of a concert, a gathering or a launch.",
      ),
      uses: words(
        lang,
        "Conciertos · Coberturas · Lanzamientos · Prensa",
        "Concerts · Coverage · Launches · Press",
      ),
      hero: photo("concert", 92),
      heroPosition: "52% 0%",
      service: photo("concert", 8),
      servicePosition: "50% 48%",
      contact: photo("concert", 87),
      contactPosition: "50% 38%",
      story: photo("concert", 8),
      storyPosition: "50% 38%",
      detail: photo("concert", 7),
      detailRatio: "3 / 2",
      picks: [8, 87, 7, 78, 76, 92].map((n) => photo("concert", n)),
      inquiry: "events",
    },
  ];
}
export function contactLink(lang: Lang, inquiry?: string) {
  return `/${lang}/contact/${inquiry ? `?type=${inquiry}` : ""}`;
}

export function responsiveSrcset(image: Photo): string {
  const width = image.width || 1600;
  return [
    ...[480, 960]
      .filter((w) => w < width)
      .map((w) => `/responsive/${image.id}-${w}.webp ${w}w`),
    `${encodeURI(image.src)} ${width}w`,
  ].join(", ");
}

const photoDescriptions: Record<string, [string, string]> = {
  "product-35": [
    "Una mano sostiene una lata amarilla junto a un cactus contra el cielo azul.",
    "A hand holds a yellow can beside a cactus against a blue sky.",
  ],
  "product-52": [
    "Anillo de hoja en una mano, con luz y sombras verdes.",
    "A leaf ring on a hand in green light and shadow.",
  ],
  "product-44": [
    "Vino servido en una copa, fotografiado de cerca.",
    "Wine being poured into a glass, photographed close up.",
  ],
  "product-31": [
    "Latas amarilla y naranja en un entorno de vegetación.",
    "Yellow and orange cans against green foliage.",
  ],
  "product-56": [
    "Joyería con formas de hojas sobre una superficie oscura.",
    "Leaf-shaped jewellery on a dark surface.",
  ],
  "product-36": [
    "Helado sostenido en una calle de la ciudad.",
    "Ice cream held on a city street.",
  ],
  "portraits-70": [
    "Retrato de un hombre de camiseta negra junto a una pared de piedra.",
    "Portrait of a man in a black T-shirt beside a stone wall.",
  ],
  "portraits-97": [
    "Retrato de una artista de cabello rosa bajo luz violeta de estudio.",
    "Portrait of a pink-haired performer in violet studio light.",
  ],
  "portraits-69": [
    "Retrato de un hombre junto a una ventana con un brazo levantado.",
    "Portrait of a man by a window with one arm raised.",
  ],
  "portraits-79": [
    "Retrato de una mujer bajo iluminación azul y verde.",
    "Portrait of a woman under blue and green light.",
  ],
  "portraits-72": [
    "Un hombre sentado entre rocas y árboles.",
    "A man sitting among rocks and trees.",
  ],
  "portraits-7": [
    "Retrato de una mujer rubia con vestido de acabado metálico.",
    "Portrait of a blonde woman in a metallic-finish dress.",
  ],
  "concert-8": [
    "Cantante con micrófono bajo luces azules de escenario.",
    "A singer with a microphone under blue stage lights.",
  ],
  "concert-87": [
    "Músicas y guitarras en una presentación en vivo.",
    "Musicians and guitars during a live performance.",
  ],
  "concert-7": [
    "Siluetas de músicos entre luces ámbar de concierto.",
    "Silhouettes of musicians in amber concert lighting.",
  ],
  "concert-78": [
    "Cantante de perfil junto al micrófono.",
    "A singer in profile beside a microphone.",
  ],
  "concert-76": [
    "Vista amplia de un escenario con músicos e instrumentos.",
    "A wide view of a stage with musicians and instruments.",
  ],
  "concert-92": [
    "Cantante con guitarra en un escenario iluminado en rojo.",
    "A singer with a guitar on a red-lit stage.",
  ],
};
export function describePhoto(image: Photo, lang: Lang): string | undefined {
  const number = image.originalName.match(/\((\d+)\)/)?.[1];
  return photoDescriptions[`${image.category}-${number}`]?.[
    lang === "es" ? 0 : 1
  ];
}
