const carouselContainer = document.getElementById('carousel-container');
const tileBox = document.querySelector('.carousel-box');
const tiles = document.querySelectorAll('.carousel-tile');
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#prev');

let offsetX = 0;
let startPos = 0;
let moveOffset = 0;

let initCarouselTransitionValue = 'all 0.05s ease-in';

let tileWidth = tiles[0].clientWidth;

window.addEventListener('resize', function() {
  tileWidth = tiles[0].clientWidth;
});

let tilesQ = tiles.length;

let counter = 1;
let carouselTransitionXPercentage = 100;

function evalTilesInRow() {
  let itemsInRow = carouselContainer.clientWidth / tileWidth;
  return Math.floor(itemsInRow);
}
function evalMaxScreens() {
  let maxScreens = tilesQ / evalTilesInRow();
  return Math.floor(maxScreens);
}

function carouselContainerPositionReset() {
  carouselContainer.style.transition = '0.3s ease-in';
  carouselContainer.style.transform = `translateX(0)`;
}

function prevSlide() {
  if (counter > 1) {
    counter--;
    tileBox.style.transform = `translateX(${-carouselTransitionXPercentage *
      (counter - 1)}%)`;
    setTimeout(function() {
      carouselContainerPositionReset();
    }, 300);
  } else {
    carouselContainerPositionReset();
  }
}
function nextSlide() {
  if (counter < evalMaxScreens()) {
    tileBox.style.transform = `translateX(${-carouselTransitionXPercentage *
      counter}%)`;
    counter++;
    setTimeout(function() {
      carouselContainerPositionReset();
    }, 300);
  } else {
    carouselContainerPositionReset();
  }
}

carouselContainer.addEventListener('touchstart', function(e) {
  startPos = e.changedTouches[0].clientX;
  carouselContainer.style.transition = initCarouselTransitionValue;
});
carouselContainer.addEventListener('touchmove', function(e) {
  offsetX = e.touches[0].clientX;
  moveOffset = offsetX - startPos;
  carouselContainer.style.transform = `translateX(${moveOffset * 0.4}px)`;
});
carouselContainer.addEventListener('touchend', function(e) {
  if (Math.abs(moveOffset) > 100) {
    if (moveOffset < 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  } else {
    carouselContainer.style.transform = `translateX(0)`;
  }
});

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
