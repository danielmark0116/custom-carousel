const carouselContainer = document.getElementById('carousel-container');
const tileBox = document.getElementsByClassName('carousel-box');
const tiles = document.querySelectorAll('.carousel-tile');
const nextBtn = document.getElementById('carousel-next');
const prevBtn = document.getElementById('carousel-prev');
const pagination = document.getElementById('carousel-pagination');

let offsetX = 0;
let startPos = 0;
let moveOffset = 0;
let initCarouselTransitionValue = 'all 0.05s ease-in';
let tileWidth = tiles[0].clientWidth;
let tilesQ = tiles.length;
let counter = 1;
let carouselTransitionXPercentage = 100;
let maxScreens = evalMaxScreens();
// For preventing triggering nextSlide() or prevSlide() on 'touch Click' (when user touches and not moving the finger)
let touchMoved = false;

window.addEventListener('resize', function() {
  this.setTimeout(function() {
    tileWidth = tiles[0].clientWidth;
    tilesQ = tiles.length;
    maxScreens = evalMaxScreens();
    this.console.log(maxScreens);
    tileBox.style.transform = `translateX(0)`;
    counter = 1;
    createPaginationBtns();
  }, 500);
});

function evalTilesInRow() {
  let itemsInRow = carouselContainer.clientWidth / tileWidth;
  return Math.round(itemsInRow);
}
function evalMaxScreens() {
  console.log('itemsInRow: ', evalTilesInRow());
  console.log('tiles: ', tilesQ);
  let maxScreens = Math.floor(tilesQ / evalTilesInRow());
  console.log('screens: ', maxScreens);
  console.log('tiles / screens: ', tilesQ / maxScreens);
  if (evalTilesInRow() < tilesQ / maxScreens) {
    maxScreens++;
  }
  return maxScreens;
}

function carouselContainerPositionReset() {
  carouselContainer.style.transition = '0.3s ease-in';
  carouselContainer.style.transform = `translateX(0)`;
}

function createPaginationBtns() {
  pagination.innerHTML = '';
  for (let i = 1; i < maxScreens + 1; i++) {
    if (i <= maxScreens) {
      let dot = document.createElement('button');
      dot.setAttribute('class', 'carousel-slide-number-btn');
      dot.dataset.slideNumber = i;
      dot.innerText = i;
      pagination.appendChild(dot);
    }
  }
  const slideNumberBtns = document.querySelectorAll(
    '.carousel-slide-number-btn'
  );
  slideNumberBtns.forEach(btn => {
    let slideNumber = btn.dataset.slideNumber;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      jumpToSlide(slideNumber);
    });
  });
}

createPaginationBtns();

function jumpToSlide(slideNumber) {
  counter = slideNumber;
  tileBox.style.transform = `translateX(${-carouselTransitionXPercentage *
    (counter - 1)}%)`;
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
  if (counter < maxScreens) {
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

function touchStart(e) {
  e.preventDefault();
  startPos = e.changedTouches[0].clientX;
  carouselContainer.style.transition = initCarouselTransitionValue;
}

function touchMove(e) {
  touchMoved = true;
  e.preventDefault();
  offsetX = e.touches[0].clientX;
  moveOffset = offsetX - startPos;
  carouselContainer.style.transform = `translateX(${moveOffset * 0.4}px)`;
}

function touchEnd(e) {
  e.preventDefault();

  if (Math.abs(moveOffset) > 100 && touchMoved) {
    if (moveOffset < 0) {
      nextSlide();
    } else if (moveOffset > 0) {
      prevSlide();
    }
  } else {
    carouselContainer.style.transform = `translateX(0)`;
  }

  touchMoved = false;
}

carouselContainer.addEventListener('touchstart', touchStart);
carouselContainer.addEventListener('touchmove', touchMove);
carouselContainer.addEventListener('touchend', touchEnd);

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

function mouseDownEvent(e) {
  mouseDown = true;
  mousePath = 0;
  startingPosX = e.clientX;
  carouselContainer.style.transition = initCarouselTransitionValue;
  startTime = new Date().valueOf();
}

function mouseLeaveEvent(e) {
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
}

function mouseUpEvent(e) {
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
}

function mouseMoveEvent(e) {
  e.preventDefault();
  mousePath = startingPosX - e.clientX;
  let mouseMoveTime = (new Date().valueOf() - startTime) / 1000;
  let mouseV = Math.abs(mousePath) / mouseMoveTime;

  if (mouseV > 450 && mouseDown) {
    trigger = true;
  }

  if (trigger) {
    carouselContainer.style.transform = `translateX(${-mousePath * 0.4}px)`;
  }
}

carouselContainer.addEventListener('mousedown', mouseDownEvent);
carouselContainer.addEventListener('mouseleave', mouseLeaveEvent);
carouselContainer.addEventListener('mouseup', mouseUpEvent);
carouselContainer.addEventListener('mousemove', mouseMoveEvent);
