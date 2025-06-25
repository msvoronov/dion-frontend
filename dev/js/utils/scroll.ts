import { LOCK_SCROLL_CLASS } from "../constants";
import { addClass, removeClass, toggleClass } from "./styles";

import { query } from "./html";

const getHeaderHeight = () => {
    const header = query(".js-header", document.body);

    if (!header) {
        return;
    }

    const { height } = header.getBoundingClientRect();

    return height || 0;
};

export const scrollToEl = (el: HTMLElement, behavior?: ScrollBehavior) => {
    const { x, y } = el.getBoundingClientRect();

    window.scrollTo({
        left: window.scrollX + x,
        top: window.scrollY + y - getHeaderHeight(),
        behavior,
    });
};

export const scrollTo = (x: number, y: number, behavior?: ScrollBehavior) => {
    window.scrollTo({
        left: x,
        top: y,
        behavior,
    });
};

export const lockScroll = (el: HTMLElement) => {
    addClass(el, LOCK_SCROLL_CLASS);
};

export const unlockScroll = (el: HTMLElement) => {
    removeClass(el, LOCK_SCROLL_CLASS);
};

export const toggleScroll = (el: HTMLElement, force?: boolean) => {
    toggleClass(el, LOCK_SCROLL_CLASS, force);
};
