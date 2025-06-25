import dom from "js/libs/DOM";
import { query, queryList } from "js/utils";

const RESIZE_LINE_SELECTOR = ".js-resize-line";
const LINE_SELECTOR = ".js-line";
const HOVER_ITEM = ".js-hover-wrap"

export const initLineResize = () => {
  dom(RESIZE_LINE_SELECTOR).each((wrap) => {
    lineResize(wrap);
  })
}

const lineResize = (wrap: HTMLElement) => {
  const hoverWraps = queryList(HOVER_ITEM, wrap);

  const lineWrap = query(LINE_SELECTOR, wrap);

  const resize = () => {

    const topItems = hoverWraps.filter((_, index) => index % 2);
    const botItems = hoverWraps.filter((_, index) => !(index % 2));

    const topMaxSize = topItems.reduce((prev: number, cur: HTMLElement) => {
        const height = cur.clientHeight; // Получаем высоту элемента
        return Math.max(height, prev);
    }, 0)
    const botMaxSize = botItems.reduce((prev: number, cur: HTMLElement) => {
        const height = cur.clientHeight; // Получаем высоту элемента
        return Math.max(height, prev);
    }, 0);

    lineWrap.style.paddingTop = `${topMaxSize}px`;
    lineWrap.style.paddingBottom = `${botMaxSize}px`;
  }

  window.addEventListener("resize", resize);
  resize();
}