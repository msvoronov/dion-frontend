import { initBurger } from "./burger";
import { initCloseModal, initSuccessModal } from "./errorModal";
import { initHeaderScroll } from "./headerScroll";
import { initLineResize } from "./line-resize";
import { pastEventsLoadInit } from "./pastEventsLoadInit";

export const staticScripts = () => {
  pastEventsLoadInit();
  initLineResize();
  initHeaderScroll();
  initBurger();
  initCloseModal();
  initSuccessModal();
}