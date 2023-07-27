// Replace these with your own images

var portraits =[];
for (let i= 1; i <= 68; i++){
  portraits.push('media/port/Portrait ('+i+').jpg');
}

var landscapes =[];
for (let i= 1; i <= 37; i++){
  landscapes.push('media/land/landscape (' + i + ').jpg');
}
var objects =[];
for (let i= 1; i <= 28; i++){
  objects.push('media/obj/Object (' + i + ').jpg');
}
var allImages = {
  portraits: portraits,
  landscapes: landscapes,
  objects: objects
};

var loadedImages = {
  portraits: 0,
  landscapes: 0,
  objects:0
};
  
  window.onload = function() {
    // Load initial images on home page
    if (document.getElementById('featured-photos')) {
      loadRandomImages('featured-photos', allImages.portraits, 1);
      loadRandomImages('featured-photos', allImages.landscapes, 1);
      loadRandomImages('featured-photos', allImages.objects, 1);
    }
  
    // Load initial images in gallery
    if (document.getElementById('portraits')) {
      loadMoreImages('portraits');
    }
  
    if (document.getElementById('landscapes')) {
      loadMoreImages('landscapes');
    }

    if (document.getElementById('objects')) {
        loadMoreImages('objects');
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

    if (document.getElementById('loadMoreObjects')) {
        document.getElementById('loadMoreObjects').addEventListener('click', function() {
          loadMoreImages('objects');
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
