
import Swiper from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import { SwiperOptions } from "swiper/types/swiper-options";
import React from "js/libs/React";

import dom from "js/libs/DOM";
import { addClass, query, queryList, removeClass } from "js/utils";
import { hasClass } from "js/libs/DOM/fn";

const PAGINATION_MARGIN_TOP = 12;

const SLIDER_SELECTOR = ".js-slider-winners";

const CUSTOM_PAGINATION = ".js-custom-pagination";
const STICKY_ARROW_SELECTOR = ".js-sticky-arrow";
const BANNER_LINK_SELECTOR = ".js-link";

const IMG_SELECTOR = ".js-image-wrap";

const ACTIVE_CLASS = "active";

const PREV_ARROW_SELECTOR = ".swiper-button-prev";
const NEXT_ARROW_SELECTOR = ".swiper-button-next";

let IS_PAG_INITED = false;

const getOptions = (): SwiperOptions => {
  return {
    navigation: {
      nextEl: NEXT_ARROW_SELECTOR,
      prevEl: PREV_ARROW_SELECTOR,
    },
    slidesPerView: 1,
    spaceBetween: 12,
    pagination: {
      clickable: true,
      el: ".swiper-pagination",
    },
    modules: [Navigation],
  };
};

export const initWinnersSwiper = () => {
  dom(SLIDER_SELECTOR).each(winnersSwiper);
};

const winnersSwiper = (wrap: HTMLElement) => {
  const options = getOptions();

  const prevArrow = query(PREV_ARROW_SELECTOR, wrap);
  const nextArrow = query(NEXT_ARROW_SELECTOR, wrap);

  const stickyArrow = query(STICKY_ARROW_SELECTOR, wrap);

  let swiper = new Swiper(wrap, options);
  swiper.on("slideChangeTransitionEnd", function (swiper) {
    swiper.slideTo(swiper.activeIndex);
  });

  const pagination = query(CUSTOM_PAGINATION, wrap);

  let bullets = [];

  swiper.on("slideChange", (swiper) => {
    handleSlide(swiper.realIndex);
    resizePaginationPosition();
  });

  const renderPagination = () => {
    const swiperLength = swiper.slides.length;
    let elements = [];
    for (let i = 0; i < swiperLength; i++) {
      elements.push(
        <div
          data-index={i}
          className={`custom-pagination-bullet${
            i === swiper.realIndex ? " active" : ""
          }`}
          onClick={() => {
            handleChange(i);
          }}
        ></div>
      );
    }

    bullets = [];

    elements.forEach((element) => {
      bullets.push(element);
      pagination.appendChild(element);
    });
  };

  const resizePaginationPosition = () => {
    const currentSlide = swiper.slides[swiper.activeIndex];
    const currentSlideHeight = currentSlide.getBoundingClientRect().height;

    pagination.style.top = `${currentSlideHeight + PAGINATION_MARGIN_TOP}px`;
  };

  const resizeNavigationArrows = () => {
    if (!prevArrow || !nextArrow) return;

    const imgSize = wrap
      .querySelector(IMG_SELECTOR)
      .getBoundingClientRect().height;

    prevArrow.style.height = `${imgSize}px`;
    nextArrow.style.height = `${imgSize}px`;
  };

  const handleChange = (index: number) => {
    clearBullets();
    swiper.slideToLoop(index);
  };

  const handleSlide = (index: number) => {
    clearBullets();
    bullets?.forEach((item: Element) => {
      parseInt(item.getAttribute("data-index")) == index &&
        addClass(item, "active");
    });
  };

  const clearBullets = () => {
    if (!bullets.length) return;
    bullets.forEach((item) => {
      removeClass(item, "active");
    });
  };

  if (options.pagination && pagination) {
    IS_PAG_INITED = true;
    renderPagination();
  }

  const initStickyArrow = (stickyArrow: HTMLElement) => {
    const swiperWrapper = query(".swiper-wrapper", wrap);
    const swiperWrapperWidth = swiperWrapper.getBoundingClientRect().width;

    const links = queryList(BANNER_LINK_SELECTOR, swiperWrapper);

    swiperWrapper.addEventListener("click", (event: MouseEvent) => {
      if (event.offsetX < swiperWrapperWidth / 2) {
        swiper.slidePrev();
      }

      if (event.offsetX >= swiperWrapperWidth / 2) {
        swiper.slideNext();
      }
    });

    const setActive = () => {
      addClass(stickyArrow, ACTIVE_CLASS);
    };
    const removeActive = () => {
      removeClass(stickyArrow, ACTIVE_CLASS);
    };

    swiperWrapper.addEventListener("mouseenter", setActive);

    swiperWrapper.addEventListener("mouseleave", removeActive);

    links.forEach((link) => {
      link.addEventListener("click", (event) => event.stopPropagation());
    });

    swiperWrapper.addEventListener("mousemove", (event: MouseEvent) => {
      if (!hasClass(stickyArrow, ACTIVE_CLASS)) {
        setActive();
      }

      const posX = event.clientX;
      const posY = event.clientY;

      stickyArrow.style.top = `${posY - 50}px`;
      stickyArrow.style.left = `${posX + 15}px`;

      if (event.offsetX < swiperWrapperWidth / 2) {
        stickyArrow.style.transform = "scaleX(-1)";
      }

      if (event.offsetX >= swiperWrapperWidth / 2) {
        stickyArrow.style.transform = "scaleX(1)";
      }
    });
  };

  const handleResize = () => {
    resizeNavigationArrows();
    resizeNavigationArrows();

    setTimeout(() => {
      resizeNavigationArrows();
    }, 1000);
  };

  handleResize();
  resizeNavigationArrows();

  window.addEventListener("resize", handleResize);
};
