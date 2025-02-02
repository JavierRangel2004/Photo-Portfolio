document.addEventListener("DOMContentLoaded", function() {
  console.log("Script loaded!");
  
  const categories = window.categories || [];
  
  categories.forEach(cat => {
    cat.images = generateImageList(cat.prefix, cat.start, cat.count);
  });

  const featuredPhotos = document.getElementById('featured-photos');
  if (featuredPhotos && categories.length > 0) {
    initFeaturedImages(categories, featuredPhotos);
    handleHorizontalScroll('featured-photos');
    addCarouselArrows(featuredPhotos.parentElement, featuredPhotos);

    // Category filter for homepage carousel
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        const selected = categoryFilter.value;
        featuredPhotos.innerHTML = '';
        // If 'all' is selected, 5 images each category, else 15 images of the selected category
        loadFeaturedImages(featuredPhotos, categories, selected);
      });
    }
  }

  const bodyCategory = document.body.getAttribute('data-category');
  if (bodyCategory) {
    initInfiniteGallery(bodyCategory, categories);
  }

  if (document.getElementById('form')) {
    contactFormSubmit();
  }
});

function generateImageList(prefix, start, count) {
  let arr = [];
  for (let i = start; i <= count; i++) {
    arr.push(`${prefix} (${i}).webp`);    
  }
  return arr;
}

function handleHorizontalScroll(elementId) {
  const el = document.getElementById(elementId);
  el.addEventListener("wheel", function (event) {
    if (event.deltaY != 0) {
      event.preventDefault();
      this.scrollLeft += event.deltaY;
    }
  });
}

// Initialize featured images with default "all" view
function initFeaturedImages(categories, container) {
  loadFeaturedImages(container, categories, 'all');
}

function loadFeaturedImages(container, categories, filter) {
  container.innerHTML = '';
  const categoryOrder = ["portraits", "nature", "product", "concert"];
  
  if (filter === 'all') {
    // Show 5 images per category
    categoryOrder.forEach(category => {
      const cat = categories.find(c => c.name === category);
      if (!cat || !cat.images.length) return;
      const usedImages = pickRandomImages(cat.images, 5);
      usedImages.forEach(idx => {
        const imageSrc = `/assets/images/${category}/${cat.images[idx]}`;
        appendImageToCarousel(container, imageSrc, category);
      });
    });
  } else {
    // Show 15 images from the selected category
    const cat = categories.find(c => c.name === filter);
    if (cat && cat.images.length) {
      const usedImages = pickRandomImages(cat.images, 15);
      usedImages.forEach(idx => {
        const imageSrc = `/assets/images/${filter}/${cat.images[idx]}`;
        appendImageToCarousel(container, imageSrc, filter);
      });
    }
  }
}

function pickRandomImages(imageArray, count) {
  const usedImages = [];
  const maxImages = Math.min(count, imageArray.length);
  while (usedImages.length < maxImages) {
    let randomIndex = Math.floor(Math.random() * imageArray.length);
    if (!usedImages.includes(randomIndex)) {
      usedImages.push(randomIndex);
    }
  }
  return usedImages;
}

function appendImageToCarousel(container, src, category) {
  const imgContainer = document.createElement('div');
  imgContainer.className = 'img-container position-relative';
  const img = document.createElement('img');
  img.src = src;
  img.className = 'gallery-image';
  img.setAttribute('loading', 'lazy');
  img.style.objectFit = 'cover';
  img.addEventListener('click', () => openModal(src));
  img.onload = () => {
    imgContainer.classList.add('loaded');
  };

  // Add category label overlay
  const label = document.createElement('div');
  label.className = 'category-label';
  label.textContent = category.charAt(0).toUpperCase() + category.slice(1);

  imgContainer.appendChild(img);
  imgContainer.appendChild(label);
  container.appendChild(imgContainer);
}

function addCarouselArrows(wrapper, container) {
  const leftArrow = document.createElement('div');
  leftArrow.className = 'carousel-arrow left';
  leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';

  const rightArrow = document.createElement('div');
  rightArrow.className = 'carousel-arrow right';
  rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';

  wrapper.appendChild(leftArrow);
  wrapper.appendChild(rightArrow);

  leftArrow.addEventListener('click', () => {
    container.scrollBy({ left: -200, behavior: 'smooth' });
  });
  rightArrow.addEventListener('click', () => {
    container.scrollBy({ left: 200, behavior: 'smooth' });
  });
}

function initInfiniteGallery(categoryName, categories) {
  const cat = categories.find(c => c.name === categoryName);
  if (!cat) return;

  const galleryContainer = document.querySelector('.gallery');
  if (!galleryContainer) return;

  let startIndex = 0;
  const batchSize = 20; 
  const total = cat.images.length;

  function loadBatch() {
    const end = Math.min(startIndex + batchSize, total);
    for (let i = startIndex; i < end; i++) {
      const imgSrc = `/assets/images/${cat.name}/${cat.images[i]}`;
      const imgContainer = document.createElement('div');
      imgContainer.className = 'img-container';
      const img = document.createElement('img');
      img.src = imgSrc;
      img.className = 'gallery-image';
      img.setAttribute('loading', 'lazy');
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.objectFit = 'cover';
      img.addEventListener('click', () => openModal(imgSrc));
      img.onload = () => {
        imgContainer.classList.add('loaded');
      };
      imgContainer.appendChild(img);
      galleryContainer.appendChild(imgContainer);
    }
    startIndex = end;
  }

  loadBatch();

  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
      if (startIndex < total) {
        loadBatch();
      }
    }
  });
}

function openModal(imgSrc) {
  const modalImage = document.getElementById('modal-image');
  if (modalImage) {
    modalImage.src = imgSrc;
    const modalElement = new bootstrap.Modal(document.getElementById('imageModal'));
    modalElement.show();
  }
}

function contactFormSubmit() {
  document.getElementById('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const inquiryType = document.getElementById('inquiry-type').value;

    if (!name) { alert('Please enter your name.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { alert('Please enter a valid email.'); return; }
    if (!message) { alert('Please enter a message.'); return; }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxPUxuIUanbvIPtkfz53iYKlQJdzNksDRfWZpfN7_S_yeA9yaYYIltFd8IsBXYX4KUg/exec';
    fetch(scriptURL, {
      method: "POST",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ "name": name, "email": email, "message": message, "type": inquiryType })
    })
    .then(response => response.text())
    .then(text => {
      if (text === 'Success!') {
        document.getElementById('form').reset();
        document.getElementById('contact-confirmation').style.display = 'block';
      } else {
        alert('An error occurred. Please try again later.');
      }
    })
    .catch(error => console.error(error));
  });
}
