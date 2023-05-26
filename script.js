// Replace these with your own images
var allImages = {
  // 41 portraits
    portraits: ['media/Portrait (1).jpg', 'media/Portrait (2).jpg', 'media/Portrait (3).jpg', 'media/Portrait (4).jpg', 'media/Portrait (5).jpg', 'media/Portrait (6).jpg', 'media/Portrait (7).jpg', 'media/Portrait (8).jpg', 'media/Portrait (9).jpg', 'media/Portrait (10).jpg', 'media/Portrait (11).jpg', 'media/Portrait (12).jpg', 'media/Portrait (13).jpg', 'media/Portrait (14).jpg', 'media/Portrait (15).jpg', 'media/Portrait (16).jpg', 'media/Portrait (17).jpg', 'media/Portrait (18).jpg', 'media/Portrait (19).jpg', 'media/Portrait (20).jpg', 'media/Portrait (21).jpg', 'media/Portrait (22).jpg', 'media/Portrait (23).jpg', 'media/Portrait (24).jpg', 'media/Portrait (25).jpg', 'media/Portrait (26).jpg', 'media/Portrait (27).jpg', 'media/Portrait (28).jpg', 'media/Portrait (29).jpg', 'media/Portrait (30).jpg', 'media/Portrait (31).jpg', 'media/Portrait (32).jpg', 'media/Portrait (33).jpg', 'media/Portrait (34).jpg', 'media/Portrait (35).jpg', 'media/Portrait (36).jpg', 'media/Portrait (37).jpg', 'media/Portrait (38).jpg', 'media/Portrait (39).jpg', 'media/Portrait (40).jpg', 'media/Portrait (41).jpg'],
  //39 landscapes
    landscapes: ['media/landscape (1).jpg', 'media/landscape (2).jpg', 'media/landscape (3).jpg', 'media/landscape (4).jpg', 'media/landscape (5).jpg', 'media/landscape (6).jpg', 'media/landscape (7).jpg', 'media/landscape (8).jpg', 'media/landscape (9).jpg', 'media/landscape (10).jpg', 'media/landscape (11).jpg', 'media/landscape (12).jpg', 'media/landscape (13).jpg', 'media/landscape (14).jpg', 'media/landscape (15).jpg', 'media/landscape (16).jpg', 'media/landscape (17).jpg', 'media/landscape (18).jpg', 'media/landscape (19).jpg', 'media/landscape (20).jpg', 'media/landscape (21).jpg', 'media/landscape (22).jpg', 'media/landscape (23).jpg', 'media/landscape (24).jpg', 'media/landscape (25).jpg', 'media/landscape (26).jpg', 'media/landscape (27).jpg', 'media/landscape (28).jpg', 'media/landscape (29).jpg', 'media/landscape (30).jpg', 'media/landscape (31).jpg', 'media/landscape (32).jpg', 'media/landscape (33).jpg', 'media/landscape (34).jpg', 'media/landscape (35).jpg', 'media/landscape (36).jpg', 'media/landscape (37).jpg', 'media/landscape (38).jpg', 'media/landscape (39).jpg'], 
  //21 objects
    objects:['media/Object (1).jpg', 'media/Object (2).jpg', 'media/Object (3).jpg', 'media/Object (4).jpg', 'media/Object (5).jpg', 'media/Object (6).jpg', 'media/Object (7).jpg', 'media/Object (8).jpg', 'media/Object (9).jpg', 'media/Object (10).jpg', 'media/Object (11).jpg', 'media/Object (12).jpg', 'media/Object (13).jpg', 'media/Object (14).jpg', 'media/Object (15).jpg', 'media/Object (16).jpg', 'media/Object (17).jpg', 'media/Object (18).jpg', 'media/Object (19).jpg', 'media/Object (20).jpg', 'media/Object (21).jpg']
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
