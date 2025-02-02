# JRMGraphy

JRMGraphy is a personal photography portfolio built with Jekyll. It showcases various photography categories (e.g., Portraits, Nature, City, Creativity) and offers dynamic galleries, an infinite scroll feature, and a contact form. The site is optimized for both desktop and mobile viewing and is hosted on platforms like Netlify.

## Features

- **Responsive Design:** Built with [Bootstrap 5](https://getbootstrap.com) to ensure a mobile-first, responsive layout.
- **Dynamic Galleries:** Utilizes JavaScript for random image selection, infinite scrolling, and modal-based image enlargements.
- **Easy Category Management:** Categories and image settings are defined in `_data/categories.yml` with individual category pages in the `/gallery` folder.
- **Contact Form:** Integrated contact form that submits data via a Google Apps Script endpoint.
- **SEO & Performance:** Uses best practices such as lazy loading of images and a minimalistic design for fast page loads.

## Technologies Used

- **Jekyll:** Static site generator for building the site.
- **Ruby Gems:** Defined in `Gemfile` (e.g., jekyll, minima, jekyll-feed).
- **Bootstrap 5:** For responsive UI components.
- **Font Awesome:** For icons in the navigation and footer.
- **Google Fonts:** Using the "Poppins" font family.
- **JavaScript:** Custom scripts for galleries, modals, infinite scroll, and form submission.
- **Netlify:** Configuration via `netlify.toml` for continuous deployment.
- **Google Apps Script:** Used for handling contact form submissions.

## Directory Structure

- **Root Files:**  
  - `404.html`, `about.md`, `contact.md`, `index.md` – Core pages.
  - `.gitignore`, `Gemfile`, `Gemfile.lock`, `netlify.toml` – Build and deployment files.
- **/_config.yml:** Site configuration (title, description, plugins, etc.).
- **/_layouts:** Layout templates (`default.html`, `home.html`, `gallery.html`, `page.html`, `category.html`).
- **/_includes:** Reusable HTML fragments (header, navigation, footer, modal).
- **/_data:** YAML files for categories (`categories.yml`) and site info (`site_info.yml`).
- **/assets:**  
  - `css/styles.css` – Custom styling.
  - `js/script.js` – Custom JavaScript for dynamic functionality.
- **/gallery:** Markdown files for each category page.
- **dirOutput.py:** A utility script to scan directories and output file contents (useful for debugging and content management).

## Setup and Installation

1. **Clone the Repository:**
   ```bash
   git clone https://your-repository-url.git
   ```
2. **Install Dependencies:**
   ```bash
   bundle install
   ```
3. **Run Locally:**
   ```bash
   bundle exec jekyll serve
   ```
   Open your browser and navigate to `http://localhost:4000`.

## Managing Categories

- **Adding a New Category:**
  1. **Update `_data/categories.yml`:** Add a new entry with keys such as `name`, `title`, `description`, `prefix`, `start`, `count`, and an initial image.
  2. **Create a Markdown Page:** In the `/gallery` folder, create a new file (e.g., `newcategory.md`) using the `category` layout.
  3. **Image Assets:** Place your images in the corresponding folder (e.g., `/assets/images/newcategory`).

- **Editing an Existing Category:**
  - Update the corresponding details in `_data/categories.yml`.
  - Add or remove images in the respective folder.

## License

[Specify your license here]
