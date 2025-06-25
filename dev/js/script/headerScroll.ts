import dom from "js/libs/DOM";
import { addClass, query, removeClass } from "js/utils";

const TAGS_SELECTOR = '.block-banner__tags';

const HEADER_SCROLL_SELECTOR = ".js-header-scroll";

const SCROLL_CLASS = "scroll";

export const initHeaderScroll = () => {
  dom(HEADER_SCROLL_SELECTOR).each((wrap) => {
    headerScroll(wrap)
  })
}

const headerScroll = (wrap: HTMLElement) => {
  const handleScroll = () => {
    window.scrollY ? addClass(wrap, SCROLL_CLASS): removeClass(wrap, SCROLL_CLASS);
    resizeTags();
  }

  const tagsWrap = query(TAGS_SELECTOR, document);

  const resizeTags = () => {

    if(tagsWrap) {
      tagsWrap.style.top = `${wrap.getBoundingClientRect().height.toFixed(2)}px`;
    }
  }


  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", resizeTags);
}