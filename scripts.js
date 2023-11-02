const accessKey = 'a6DU5hWxbbj0KJtZbEGQ24Vie7X9YpJsDVDBLTQrdSM'; // Replace 'YOUR_ACCESS_KEY' with your Unsplash API key
const API_URLS = {
  harrypotter: `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${6}`,
  dogs: `https://dog.ceo/dog-api/documentation/random`,
  countries: `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${6}`,
  flower: `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${6}`,
  apiUrl: `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${6}`
};

const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
const pairedImages = [];
window.addEventListener('load', async () => {
  const api = 'harrypotter'; // Specify the desired API here ('harrypotter', 'dogs', 'countries', etc.)
  await fetchRandomImageUrls(api);
  cards.forEach(card => card.addEventListener('click', flipCard));
});
//פונקציה שמגרילה api אחד מתוך מערך ה api 
function chooseRandomPhotos(){
  const apiKeys = Object.keys(API_URLS);
  const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
 const chhose_api = randomKey;
 console.log('chhose_api',randomKey);
  fetchRandomImageUrls(chhose_api);
}
function flipCard() {
console.log('firstCard',firstCard);
console.log('hasFlippedCard',hasFlippedCard);
console.log('secondCard',secondCard);
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
console.log('isMatch',isMatch);
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();
cards.forEach(card => card.addEventListener('click', flipCard));
function reloadPage() {
  location.reload();
  
}

async function fetchRandomImageUrls(api) {   
  const apiUrl = API_URLS[api];
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    let imagePairs = [];
    data.forEach((image, index) => {
      const imageUrl = image.urls.regular;
      const framework = `framework-${index}`;

      const pair = { imageUrl, framework };

      // Add the pair object to the imagePairs array twice (for each card in the pair)
      imagePairs.push(pair);
      imagePairs.push(pair);
    });
    imagePairs = imagePairs.sort(() => Math.random() - 0.5);
    const memoryCards = document.querySelector('.memory-game');
    memoryCards.innerHTML = ''; // Clear existing memory cards

    imagePairs.forEach(pair  => {
      const card = document.createElement('div');
      card.classList.add('memory-card');
      card.setAttribute('data-framework', pair.framework); // Set a common framework attribute

      const frontFace = document.createElement('img');
      frontFace.classList.add('front-face');
      frontFace.src = pair.imageUrl;
      frontFace.alt = 'Memory Card';

      const backFace = document.createElement('img');
      backFace.classList.add('back-face');
      backFace.src = 'images.jpg'; // Default back face image
      backFace.alt = 'JS Badge';

      card.appendChild(frontFace);
      card.appendChild(backFace);
      card.addEventListener('click', flipCard);

      memoryCards.appendChild(card);
    });

    // Log the array of image URLs
    console.log(imagePairs);

    // Return the array of image pairs
    return imagePairs;
  } catch (error) {
    console.error('Error fetching random images:', error);
    return [];
  }
}

