import { Component } from "js/components/utils/Component";
import dom from "js/libs/DOM";
import { addClass, query, toggleClass, toggleScroll } from "js/utils";

const BURGER_SELECTOR = ".js-burger";
const BURGER_BTN_SELECTOR = ".js-burger-btn";

const BURGER_LINK_SELECTOR = ".js-burger-link";
const BURGER_OVERLAY_SELECTOR = ".js-burger-overlay";

const OPEN_CLASS = "open";

export const initBurger = () => {
  dom(BURGER_SELECTOR).each((wrap) => {
    new Burger(wrap);
  })
}

class Burger extends Component {

  private links: Array<HTMLLinkElement>;
  private btn: HTMLElement;
  private overlay: HTMLElement;

  private isOpen: boolean;

  constructor(wrap: HTMLElement) {
    super(wrap);
    this.wrap = wrap;

    this.btn = this.query(BURGER_BTN_SELECTOR, wrap);
    this.links = this.queryList(BURGER_LINK_SELECTOR, wrap);
    this.overlay = this.query(BURGER_OVERLAY_SELECTOR, wrap);

    this.isOpen = false;

    this.initComponent();

  }

  private initComponent = () => {

    this.btn.addEventListener('click', this.handleClick);

    this.overlay.addEventListener('click', this.closeMenu);

    this.links.forEach((link) => {
      link.addEventListener('click', this.closeMenu);
    })


  }

  private handleClick = () => {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  private openMenu = () => {
    this.isOpen = true;
    this.setClass(this.wrap, OPEN_CLASS);
    this.setClass(document.body, OPEN_CLASS);
    toggleScroll(document.body);
  }
  
  private closeMenu = () => {
    this.isOpen = false;
    this.removeClass(this.wrap, OPEN_CLASS);
    this.removeClass(document.body, OPEN_CLASS);
    toggleScroll(document.body);
  }
}
