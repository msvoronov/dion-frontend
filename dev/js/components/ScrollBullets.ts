import { Component } from "js/components/utils/Component";
import dom from "js/libs/DOM";
import { query, queryList } from "js/utils";

const BULLET_WRAP_SELECTOR = ".js-scroll-bullets";
const BULLET_ITEM_SELECTOR = ".js-bullet";

const ACTIVE_CLASS = "active";


export const intiScrollBullets = () => {
  dom(BULLET_WRAP_SELECTOR).each((wrap) => {
    new ScrollBullets(wrap);
  })
}

class ScrollBullets extends Component {
  private bullets: Array<HTMLLinkElement>;
  private sections: Array<HTMLElement>;

  constructor(wrap: HTMLElement) {
    super(wrap);
    this.wrap = wrap;

    this.bullets = this.queryList<HTMLLinkElement>(BULLET_ITEM_SELECTOR, wrap);

    this.sections = this.bullets.map((item) => {
      return document.getElementById(item.href.split("#")[1]);
    });

    this.initComponent();
  }

  private initComponent = () => {
    document.addEventListener("scroll", this.handleScroll)
  }

  private handleScroll = () => {
    const currentSectionIndex = this.sections.findIndex((item) => {
      return this.checkIfElementIsInViewportY(item).inViewFull;
    });

    this.setActiveBullet(currentSectionIndex);
  }

  private setActiveBullet = (index: number) => {
    this.bullets.forEach((bullet) => this.removeClass(bullet, ACTIVE_CLASS));
    this.setClass(this.bullets[index], ACTIVE_CLASS);
  }
}

