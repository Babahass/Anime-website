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
      const title = card.getAttribute('data-title') || card.querySelector('h2').textContent;
      const description = card.querySelector('.short-desc').textContent;
      const image = card.querySelector('img') ? card.querySelector('img').src : '';
      const episodes = card.getAttribute('data-episodes') || 'Unknown';
      const rate = card.getAttribute('data-rating') || '5';
      const year = card.getAttribute('data-year') || 'Unknown';
      const trailer = card.getAttribute('data-trailer') || '';
      const genre = card.getAttribute('data-genre') || card.querySelector('p').textContent.replace('Genre: ', '');
      
      // Populate the sidebar with content
      sidebarContent.innerHTML = `
        <h2>${title}</h2>
        ${image ? `<img src="${image}" alt="${title}">` : ''}
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Episodes:</strong> ${episodes}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Rating:</strong> ${rate}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${trailer ? `<a href="${trailer}" target="_blank">Watch Trailer</a>` : ''}
        <button class="favorite-btn modal-btn" data-title="${title}" aria-label="Toggle favorite">Add to Favorites</button>
        <button class="remove-fav-btn modal-btn" data-title="${title}" aria-label="Remove from favorites">Remove from Favorites</button>
      `;
      sidebar.classList.add("active");

      // Attach favorite and remove favorite button listeners in sidebar
      const favBtn = sidebarContent.querySelector('.favorite-btn');
      if (favBtn) {
        favBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const animeData = {
            title: title,
            genre: genre,
            description: description,
            image: image,
            episodes: episodes,
            rating: rate,
            year: year,
            trailer: trailer
          };

          let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
          if (!favorites.some(fav => fav.title === animeData.title)) {
            favorites.push(animeData);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${animeData.title} added to favorites!`);
            if (window.location.pathname.includes('favorites')) {
              loadFavorites();
            }
          } else {
            alert(`${animeData.title} is already in your favorites!`);
          }
        });
      }

      const removeBtn = sidebarContent.querySelector('.remove-fav-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
          favorites = favorites.filter(fav => fav.title !== title);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          sidebar.classList.remove("active");
          if (window.location.pathname.includes('favorites')) {
            loadFavorites();
          }
          alert(`${title} removed from favorites!`);
        });
      }
    });
  });

  closeSidebar.addEventListener("click", function () {
    sidebar.classList.remove("active");
  });

  // Load favorites on favorites page
  if (window.location.pathname.includes('favorites')) {
    loadFavorites();
  }
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
    const cards = document.querySelectorAll('.card');
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
    const cards = document.querySelectorAll('.card');
    const cardsArray = Array.from(cards);
    
    cardsArray.sort((a, b) => {
      if (sortBy === 'title-asc') return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
      if (sortBy === 'title-desc') return b.getAttribute('data-title').localeCompare(a.getAttribute('data-title'));
      if (sortBy === 'rating-desc') return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
      return 0;
    });
    
    animeCardsContainer.innerHTML = '';
    cardsArray.forEach(card => animeCardsContainer.appendChild(card));
    attachCardListeners();
  });
});

// Search functionality
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');

searchInput.addEventListener('keyup', function() {
  performSearch();
});

searchButton.addEventListener('click', function() {
  performSearch();
});

function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  const cards = document.querySelectorAll('.card');
  
  if (query === '') {
    cards.forEach(card => {
      card.style.display = 'block';
    });
    return;
  }
  
  cards.forEach(card => {
    card.style.display = 'none';
  });
  
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
    e.stopPropagation();
    const card = this.closest('.card');
    const animeData = {
      title: card.getAttribute('data-title') || card.querySelector('h2').textContent,
      genre: card.getAttribute('data-genre') || card.querySelector('p').textContent.replace('Genre: ', ''),
      description: card.querySelector('.short-desc').textContent,
      image: card.querySelector('img') ? card.querySelector('img').src : '',
      episodes: card.getAttribute('data-episodes') || 'Unknown',
      rating: card.getAttribute('data-rating') || '5',
      year: card.getAttribute('data-year') || 'Unknown',
      trailer: card.getAttribute('data-trailer') || ''
    };

    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!favorites.some(fav => fav.title === animeData.title)) {
      favorites.push(animeData);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      alert(`${animeData.title} added to favorites!`);
      if (window.location.pathname.includes('favorites')) {
        loadFavorites();
      }
    } else {
      alert(`${animeData.title} is already in your favorites!`);
    }
  });
});

// Load favorites on favorites page
function loadFavorites() {
  console.log("loadFavorites called");
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  console.log("Favorites:", favorites);
  const container = document.querySelector('#favorites-cards');
  if (!container) {
    console.error("Favorites container not found");
    return;
  }
  container.innerHTML = '';
  if (favorites.length === 0) {
    container.innerHTML = '<p>No favorites added yet.</p>';
    return;
  }
  favorites.forEach((anime, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-title', anime.title);
    card.setAttribute('data-genre', anime.genre);
    card.setAttribute('data-episodes', anime.episodes);
    card.setAttribute('data-rating', anime.rating);
    card.setAttribute('data-year', anime.year);
    card.setAttribute('data-trailer', anime.trailer);
    card.style.setProperty('--index', index);
    card.innerHTML = `
      ${anime.image ? `<img src="${anime.image}" alt="${anime.title}">` : ''}
      <h2>${anime.title}</h2>
      <p>Genre: ${anime.genre}</p>
      <div class="rating" data-title="${anime.title}">
        <span class="star" data-value="5">★</span>
        <span class="star" data-value="4">★</span>
        <span class="star" data-value="3">★</span>
        <span class="star" data-value="2">★</span>
        <span class="star" data-value="1">★</span>
      </div>
      <p class="short-desc">${anime.description}</p>
      <button class="remove-fav-btn">Remove from Favorites</button>
    `;
    container.appendChild(card);
  });

  updateRatings();

  // Reset search and filters
  const searchInput = document.getElementById('search');
  if (searchInput) searchInput.value = '';
  const genreButtons = document.querySelectorAll(".filter-btn");
  genreButtons.forEach(btn => btn.classList.remove('active'));
  document.querySelector('.filter-btn[data-genre=""]').classList.add('active');
  performSearch();

  // Attach remove button listeners
  document.querySelectorAll('.remove-fav-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const title = this.closest('.card').getAttribute('data-title');
      let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
      favorites = favorites.filter(fav => fav.title !== title);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      loadFavorites();
      alert(`${title} removed from favorites!`);
    });
  });

  // Re-attach card click listeners for sidebar
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("click", function () {
      const title = card.getAttribute('data-title') || card.querySelector('h2').textContent;
      const description = card.querySelector('.short-desc').textContent;
      const image = card.querySelector('img') ? card.querySelector('img').src : '';
      const episodes = card.getAttribute('data-episodes') || 'Unknown';
      const rate = card.getAttribute('data-rating') || '5';
      const year = card.getAttribute('data-year') || 'Unknown';
      const trailer = card.getAttribute('data-trailer') || '';
      const genre = card.getAttribute('data-genre') || card.querySelector('p').textContent.replace('Genre: ', '');
      
      sidebarContent.innerHTML = `
        <h2>${title}</h2>
        ${image ? `<img src="${image}" alt="${title}">` : ''}
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Episodes:</strong> ${episodes}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Rating:</strong> ${rate}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${trailer ? `<a href="${trailer}" target="_blank">Watch Trailer</a>` : ''}
        <button class="favorite-btn modal-btn" data-title="${title}" aria-label="Toggle favorite">Add to Favorites</button>
        <button class="remove-fav-btn modal-btn" data-title="${title}" aria-label="Remove from favorites">Remove from Favorites</button>
      `;
      sidebar.classList.add("active");

      // Attach favorite and remove favorite button listeners in sidebar
      const favBtn = sidebarContent.querySelector('.favorite-btn');
      if (favBtn) {
        favBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          const animeData = {
            title: title,
            genre: genre,
            description: description,
            image: image,
            episodes: episodes,
            rating: rate,
            year: year,
            trailer: trailer
          };

          let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
          if (!favorites.some(fav => fav.title === animeData.title)) {
            favorites.push(animeData);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${animeData.title} added to favorites!`);
            loadFavorites();
          } else {
            alert(`${animeData.title} is already in your favorites!`);
          }
        });
      }

      const removeBtn = sidebarContent.querySelector('.remove-fav-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
          favorites = favorites.filter(fav => fav.title !== title);
          localStorage.setItem('favorites', JSON.stringify(favorites));
          sidebar.classList.remove("active");
          loadFavorites();
          alert(`${title} removed from favorites!`);
        });
      }
    });
  });
}

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
      e.stopPropagation();
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

// Function to re-attach event listeners to cards
function attachCardListeners() {
  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("click", function () {
      const title = card.getAttribute('data-title') || card.querySelector('h2').textContent;
      const description = card.querySelector('.short-desc').textContent;
      const image = card.querySelector('img') ? card.querySelector('img').src : '';
      const episodes = card.getAttribute('data-episodes') || 'Unknown';
      const rate = card.getAttribute('data-rating') || '5';
      const year = card.getAttribute('data-year') || 'Unknown';
      const trailer = card.getAttribute('data-trailer') || '';
      const genre = card.getAttribute('data-genre') || card.querySelector('p').textContent.replace('Genre: ', '');
      
      sidebarContent.innerHTML = `
        <h2>${title}</h2>
        ${image ? `<img src="${image}" alt="${title}">` : ''}
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Episodes:</strong> ${episodes}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Rating:</strong> ${rate}</p>
        <p><strong>Description:</strong> ${description}</p>
        ${trailer ? `<a href="${trailer}" target="_blank">Watch Trailer</a>` : ''}
        <button class="favorite-btn modal-btn" data-title="${title}" aria-label="Toggle favorite">Add to Favorites</button>
        <button class="remove-fav-btn modal-btn" data-title="${title}" aria-label="Remove from favorites">Remove from Favorites</button>
      `;
      sidebar.classList.add("active");
    });
  });
}