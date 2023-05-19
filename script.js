// Replace these with your own images
var allImages = {
  portraits: ['Portrait (1).jpg', 'Portrait (2).jpg', 'Portrait (3).jpg', 'Portrait (4).jpg', 'Portrait (5).jpg', 'Portrait (6).jpg', 'Portrait (7).jpg', 'Portrait (8).jpg', 'Portrait (9).jpg', 'Portrait (10).jpg', 'Portrait (11).jpg', 'Portrait (12).jpg', 'Portrait (13).jpg', 'Portrait (14).jpg', 'Portrait (15).jpg', 'Portrait (16).jpg', 'Portrait (17).jpg', 'Portrait (18).jpg', 'Portrait (19).jpg', 'Portrait (20).jpg', 'Portrait (21).jpg', 'Portrait (22).jpg', 'Portrait (23).jpg', 'Portrait (24).jpg', 'Portrait (25).jpg'],
  landscapes: ['landscape (1).jpg', 'landscape (2).jpg', 'landscape (3).jpg', 'landscape (4).jpg', 'landscape (5).jpg', 'landscape (6).jpg', 'landscape (7).jpg', 'landscape (8).jpg', 'landscape (9).jpg', 'landscape (10).jpg', 'landscape (11).jpg', 'landscape (12).jpg', 'landscape (13).jpg', 'landscape (14).jpg', 'landscape (15).jpg', 'landscape (16).jpg', 'landscape (17).jpg', 'landscape (18).jpg', 'landscape (19).jpg', 'landscape (20).jpg', 'landscape (21).jpg', 'landscape (22).jpg', 'landscape (23).jpg', 'landscape (24).jpg', 'landscape (25).jpg', 'landscape (26).jpg', 'landscape (27).jpg', 'landscape (28).jpg', 'landscape (29).jpg', 'landscape (30).jpg', 'landscape (31).jpg', 'landscape (32).jpg', 'landscape (33).jpg', 'landscape (34).jpg', 'landscape (35).jpg', 'landscape (36).jpg']
};

var loadedImages = {
  portraits: 0,
  landscapes: 0
};

window.onload = function() {
  // Load initial images on home page
  if (document.getElementById('featured-photos')) {
    loadRandomImages('featured-photos', allImages.portraits, 2);
    loadRandomImages('featured-photos', allImages.landscapes, 2);
  }

  // Load initial images in gallery
  if (document.getElementById('portraits')) {
    loadMoreImages('portraits');
  }

  if (document.getElementById('landscapes')) {
    loadMoreImages('landscapes');
  }

  // Add click events for "load more" buttons
  if (document.getElementById('loadMorePortraits')) {
    document.getElementById('loadMorePortraits').addEventListener('click', function() {
      loadMoreImages('portraits');
    });
  }

  if (document.getElementById('loadMoreLandscapes')) {
    document.getElementById('loadMoreLandscapes').addEventListener('click', function() {
      loadMoreImages('landscapes');
    });
  }
};

function loadImages(sectionId, images) {
  var section = document.getElementById(sectionId);

  images.forEach(function(image) {
    var img = document.createElement('img');
    img.src = image;
    section.appendChild(img);
  });
}

function loadMoreImages(category) {
  var start = loadedImages[category];
  var end = start + 4;
  var images = allImages[category].slice(start, end);

  loadImages(category, images);

  loadedImages[category] = end;
}

// Modify the existing loadImages function
function loadImages(sectionId, images) {
var section = document.getElementById(sectionId);

images.forEach(function(image, index) {
  var img = document.createElement('img');
  img.style.animationDelay = (index * 0.2) + 's'; // Adds a delay
  img.addEventListener('click', function() {
    openModal(image);
  });
  img.src = image; // Move this after adding the event listener
  section.appendChild(img);
});
}



function openModal(image) {
document.getElementById('modal').style.display = "block";
document.getElementById('modal-image').src = image;
}

window.onclick = function(event) {
if (event.target == document.getElementById('modal')) {
  document.getElementById('modal').style.display = "none";
}
}
function loadRandomImages(sectionId, images, count) {
var section = document.getElementById(sectionId);
var randomImages = getRandomImages(images, count);

randomImages.forEach(function(image) {
  var img = document.createElement('img');
  img.src = image;
  img.style.animationDelay = '0s';
  img.addEventListener('click', function() {
    openModal(image);
  });
  section.appendChild(img);
});
}

function getRandomImages(images, count) {
var randomImages = [];
var usedIndices = [];

for (var i = 0; i < count; i++) {
  var randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * images.length);
  } while (usedIndices.includes(randomIndex))

  usedIndices.push(randomIndex);
  randomImages.push(images[randomIndex]);
}

return randomImages;
}
