import dom from "js/libs/DOM"
import { addClass, query, queryList } from "js/utils";

const PAST_EVENTS_WRAP_SELECTOR = ".past-events-new";

const INTERNSHIP_ITEMS_WRAP_SELECTOR = ".b-block-internship__items";
const INTERNSHIP_ITEM_SELECTOR = ".b-block-internship__item";

const SCRIPT_INIT_CLASS = "js-b-resize-list";
const RESIZE_WRAP_CLASS = "js-b-resize-wrap"
const ITEM_CLASS = "js-b-list-item";
const SHOW_MORE_BTN_CLASSES = "b-block-internship-list__more btn-blue js-b-trigger";
const BTN_TEXT = "Показать ешё";
const MAX_ITEMS_DATA_ATR = "data-max";
const MAX_ITEMS_VALUE = 3;

export const pastEventsLoadInit = () => {
  dom(PAST_EVENTS_WRAP_SELECTOR).each((wrap) => {
    initPastEventsLoadInit(wrap);
  })
}

const initPastEventsLoadInit = (wrap: HTMLElement) => {
    
  const resizeWrap = query(INTERNSHIP_ITEMS_WRAP_SELECTOR, wrap);
  
  const items = queryList(INTERNSHIP_ITEM_SELECTOR, wrap);

  addClass(wrap, SCRIPT_INIT_CLASS);
  wrap.setAttribute(MAX_ITEMS_DATA_ATR, MAX_ITEMS_VALUE.toString());

  addClass(resizeWrap, RESIZE_WRAP_CLASS);

  items.forEach((item) => {
    addClass(item, ITEM_CLASS);
  })

  const renderBtn = () => {
    const btn = document.createElement('div');
    addClass(btn, ...SHOW_MORE_BTN_CLASSES.split(" "));

    btn.innerText = BTN_TEXT;
    wrap.appendChild(btn);
  }

  renderBtn();

}