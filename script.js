const carouselContainer = document.getElementById('carousel-container');
const tileBox = document.querySelector('.carousel-box');
const tiles = document.querySelectorAll('.carousel-tile');
const nextBtn = document.querySelector('#carousel-next');
const prevBtn = document.querySelector('#carousel-prev');

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
  e.preventDefault();
  startPos = e.changedTouches[0].clientX;
  carouselContainer.style.transition = initCarouselTransitionValue;
});
carouselContainer.addEventListener('touchmove', function(e) {
  e.preventDefault();
  offsetX = e.touches[0].clientX;
  moveOffset = offsetX - startPos;
  carouselContainer.style.transform = `translateX(${moveOffset * 0.4}px)`;
});
carouselContainer.addEventListener('touchend', function(e) {
  e.preventDefault();
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

// mouse

let mouseDown = false;
let mousePath = 0;
let startingPosX = 0;
let trigger = false;
let startTime = null;

function resetMouseValues() {
  mouseDown = false;
  mousePath = 0;
  trigger = false;
}

carouselContainer.addEventListener('mousedown', function(e) {
  mouseDown = true;
  mousePath = 0;
  startingPosX = e.offsetX;
  carouselContainer.style.transition = initCarouselTransitionValue;

  startTime = new Date().valueOf();
});

carouselContainer.addEventListener('mouseleave', function(e) {
  e.preventDefault();
  if (Math.abs(mousePath) > 100 && trigger) {
    if (mousePath > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  } else {
    carouselContainer.style.transform = `translateX(0)`;
  }

  resetMouseValues();
});

carouselContainer.addEventListener('mouseup', function(e) {
  //   copied from touch
  e.preventDefault();
  if (Math.abs(mousePath) > 100 && trigger) {
    if (mousePath > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  } else {
    carouselContainer.style.transform = `translateX(0)`;
  }

  resetMouseValues();
});

carouselContainer.addEventListener('mousemove', function(e) {
  e.preventDefault();
  mousePath = startingPosX - e.offsetX;

  let czas = (new Date().valueOf() - startTime) / 1000;

  let predkosc = Math.abs(mousePath) / czas;

  if (predkosc > 450) {
    trigger = true;
  }

  if (mouseDown && trigger) {
    carouselContainer.style.transform = `translateX(${-mousePath * 0.4}px)`;
  }
});

// SCROLL WHEEL / touchpad

// carouselContainer.onwheel = function(e) {
//   e.preventDefault();
//   console.log(e.deltaX);
//   carouselContainer.style.transform = `translateX(${e.deltaX * 2.5}px)`;
//   if (Math.abs(e.deltaX) > 50) {
//     nextSlide();
//     carouselContainer.style.transform = `translateX(0)`;
//   }
// };
