// Replace these with your own images
const portraits = [];
for (let i = 1; i <= 68; i++) {
  portraits.push(`media/port/Portrait (${i}).webp`);
}

const landscapes = [];
for (let i = 1; i <= 37; i++) {
  landscapes.push(`media/land/Landscape (${i}).webp`);
}

const objects = [];
for (let i = 1; i <= 28; i++) {
  objects.push(`media/obj/Object (${i}).webp`);
}

const allImages = { portraits, landscapes, objects };

const loadedImages = { portraits: 0, landscapes: 0, objects: 0 };

window.addEventListener('load', () => {
  // Load initial images on home page
  loadInitialImages('featured-photos', allImages);

  // Load initial images in gallery and set up "load more" buttons
  ['portraits', 'landscapes', 'objects'].forEach((category) => {
    if (document.getElementById(category)) {
      loadMoreImages(category);
    }
    setupLoadMoreListener(category);
  });
});

function loadInitialImages(sectionId, images) {
  if (document.getElementById(sectionId)) {
    loadRandomImages(sectionId, images.portraits, 1);
    loadRandomImages(sectionId, images.landscapes, 1);
    loadRandomImages(sectionId, images.objects, 1);
  }
}

function setupLoadMoreListener(category) {
  const buttonId = `loadMore${category.charAt(0).toUpperCase() + category.slice(1)}`;
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', () => loadMoreImages(category));
  }
}

function loadImages(sectionId, images) {
  const section = document.getElementById(sectionId);
  images.forEach((image, index) => {
    const img = document.createElement('img');
    img.style.animationDelay = `${index * 0.2}s`;
    img.addEventListener('click', () => openModal(image));
    img.src = image;
    section.appendChild(img);
  });
}

function loadMoreImages(category) {
  const start = loadedImages[category];
  const end = start + 4;
  const images = allImages[category].slice(start, end);
  loadImages(category, images);
  loadedImages[category] = end;
}

function openModal(image) {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.style.display = "block";
    document.getElementById('modal-image').src = image;
  }
}

window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

function loadRandomImages(sectionId, images, count) {
  const section = document.getElementById(sectionId);
  const randomImages = getRandomImages(images, count);
  randomImages.forEach((image) => {
    const img = document.createElement('img');
    img.src = image;
    img.style.animationDelay = '0s';
    img.addEventListener('click', () => openModal(image));
    section.appendChild(img);
  });
}

function getRandomImages(images, count) {
  const randomImages = [];
  const usedIndices = new Set();

  while (randomImages.length < count) {
    const randomIndex = Math.floor(Math.random() * images.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      randomImages.push(images[randomIndex]);
    }
  }

  return randomImages;
}
