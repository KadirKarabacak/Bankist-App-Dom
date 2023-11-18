'use strict';

// Selections...
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const message = document.createElement('div');
const logo = document.querySelector('.nav__logo');
const allButtons = document.getElementsByTagName('button');
const link = document.querySelector('.nav__link--btn');
const nav = document.querySelector('.nav');
const cookie = document.querySelector('.cookie-message');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Open modal classlists...
const openModal = function (e) {
  e.preventDefault(); // To fix auto jump
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Close modal classlist...
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Open, close, overlay modal listener...
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Escape key function :
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLL EVENT
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Cookie :
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie"> Got it!</button>';
header.append(message);

// Cookie styles :
message.style.backgroundColor = '#37383d';
message.style.width = '100%'

// EVENT DELEGATION -- Instead of forEach for better performance
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Deleting cookie ...
message.addEventListener('click', function () {
  setTimeout(() => {
    message.remove();
  }, 500);
});

// --------- TAB MENU ----------
// Event delegation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard to when user clicks void
  if (!clicked) return;

  // Remove all actives at the beginning
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// --- MENU FADE ANIMATION ---
//! OR if we want more arguments we can use this keyword and then call with bind
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this; // Drop others op to 0.5
      }
    });
    logo.style.opacity = this; // Logo also
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5)); // This keyword targeting handleHover
nav.addEventListener('mouseout', handleHover.bind(1));

const initialCoords = section1.getBoundingClientRect();

// STICKY NAVIGATION
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (entry.isIntersecting == false) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // It starts 90px indent
});
headerObserver.observe(header);

//! Revealing elements on Scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  // It comes visible at start, so do this
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  // To stop observing for better performance
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// LAZY IMG LOADER
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);
const loadImg = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.2,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// --- SLIDER ---
const sliderFunc = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');

  const dotContainer = document.querySelector('.dots');

  const maxSlide = slides.length; // To return first slide after its end
  let curSlide = 0; // to define current.

  // Creating Dots for slider
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    // Remove all actives at the beginning.
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Set all slides side by side
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous Slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0); // At the beginning to go slide 0
    createDots(); // To create dots
    activateDot(0); // To active first at the beginning.
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Use [ <--  --> ] keys to move slider.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Use dots to navigate on slider.
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
sliderFunc();
