// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-theme');
  themeToggle.textContent = '🌞';
} else {
  themeToggle.textContent = '🌙';
}
themeToggle.addEventListener('click', function () {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  themeToggle.textContent = isLight ? '🌞' : '🌙';
});

document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");
  const sidebar = document.getElementById("sidebar");
  const sidebarContent = document.getElementById("sidebarContent");
  const closeSidebar = document.getElementById("closeSidebar");

  cards.forEach(card => {
    card.addEventListener("click", function () {
      const title = card.getAttribute('data-title');
      const description = card.querySelector('.short-desc').textContent;
      const image = card.querySelector('img').src;
      const episodes = card.getAttribute('data-episodes');
      const rate = card.getAttribute('data-rating');
      const year = card.getAttribute('data-year');
      const trailer = card.getAttribute('data-trailer');
      const genre = card.getAttribute('data-genre');
      
      // Populate the sidebar with content
      sidebarContent.innerHTML = `
        <h2>${title}</h2>
        <img src="${image}" alt="${title}">
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Episodes:</strong> ${episodes}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Rating:</strong> ${rate}</p>
        <p><strong>Description:</strong> ${description}</p>
        <a href="${trailer}" target="_blank">Watch Trailer</a>
        <button class="favorite-btn modal-btn" data-title="${title}" aria-label="Toggle favorite">Add to Favorites</button>
      `;
      sidebar.classList.add("active");
    });
  });

  closeSidebar.addEventListener("click", function () {
    sidebar.classList.remove("active");
  });
});

// Add to script.js
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.setProperty('--index', index);
  });
});

const genreButtons = document.querySelectorAll(".filter-btn");
const sortButtons = document.querySelectorAll(".sort-btn");
const animeCardsContainer = document.querySelector('.anime-cards');

// Genre filter buttons
genreButtons.forEach(button => {
  button.addEventListener('click', function () {
    genreButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    const selectedGenre = this.getAttribute('data-genre').toLowerCase();
    cards.forEach(card => {
      const genres = card.getAttribute('data-genre').toLowerCase().split(',');
      card.style.display = selectedGenre === '' || genres.includes(selectedGenre) ? 'block' : 'none';
    });
  });
});

// Sort buttons
sortButtons.forEach(button => {
  button.addEventListener('click', function () {
    sortButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    const sortBy = this.getAttribute('data-sort');
    const cardsArray = Array.from(cards);
    
    cardsArray.sort((a, b) => {
      if (sortBy === 'title-asc') return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
      if (sortBy === 'title-desc') return b.getAttribute('data-title').localeCompare(a.getAttribute('data-title'));
      if (sortBy === 'rating-desc') return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
      return 0;
    });
    
    animeCardsContainer.innerHTML = '';
    cardsArray.forEach(card => animeCardsContainer.appendChild(card));
    attachCardListeners(); // If you have this function for re-attaching events
  });
});

// Search functionality
const searchInput = document.getElementById('search');
const cards = document.querySelectorAll('.card');
const searchButton = document.getElementById('searchButton');

searchInput.addEventListener('keyup', function() {
  performSearch();
});

searchButton.addEventListener('click', function() {
  performSearch();
});

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  
  if (query === '') {
    // If search is empty, show all cards
    cards.forEach(card => {
      card.style.display = 'block';
    });
    return;
  }
  
  // Hide all cards first
  cards.forEach(card => {
    card.style.display = 'none';
  });
  
  // Show only matching cards
  cards.forEach(card => {
    const title = card.getAttribute('data-title').toLowerCase();
    const genres = card.getAttribute('data-genre').toLowerCase();
    
    if (title.includes(query) || genres.includes(query)) {
      card.style.display = 'block';
    }
  });
}

// Add to favorite button
const favoriteButtons = document.querySelectorAll('.favorite-btn');

favoriteButtons.forEach(button => {
  button.addEventListener('click', function (e) {
    e.stopPropagation(); // Prevent triggering the card click event
    const card = this.closest('.card');
    const animeTitle = card.getAttribute('data-title');
    const animeImage = card.querySelector('img').getAttribute('src');

    // Get existing favorites from LocalStorage or initialize as an empty array
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favorites.includes(animeTitle)) {
      favorites.push(animeTitle);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert(`${animeTitle} added to favorites!`);
    } else {
      alert(`${animeTitle} is already in your favorites!`);
    }
  });
});

// Button back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
  backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
});

backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('nav').classList.toggle('active');
});

// Rating stars
document.querySelectorAll('.rating').forEach(rating => {
  const title = rating.getAttribute('data-title');
  rating.querySelectorAll('.star').forEach(star => {
    star.setAttribute('tabindex', '0');
    star.addEventListener('click', function (e) {
      e.stopPropagation(); // Prevent triggering the card click event
      const value = this.getAttribute('data-value');
      localStorage.setItem(`rating-${title}`, value);
      updateRatings();
    });
    star.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') this.click();
    });
  });
});

// Update ratings
function updateRatings() {
  document.querySelectorAll('.rating').forEach(rating => {
    const title = rating.getAttribute('data-title');
    const userRating = localStorage.getItem(`rating-${title}`) || 0;
    rating.querySelectorAll('.star').forEach(star => {
      star.classList.toggle('filled', star.getAttribute('data-value') <= userRating);
    });
  });
}

updateRatings();

function attachCardListeners() {
  // Re-attach any necessary event listeners here
}
