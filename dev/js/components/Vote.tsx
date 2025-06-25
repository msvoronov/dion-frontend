import React from "js/libs/React";
import dom from "js/libs/DOM";
import { Component } from "./utils/Component";
import { addClass } from "js/utils";

const VOTE_SELECTOR = ".js-vote";
const VOTE_PROJECT_SELECTOR = ".js-vote-project";
const VOTE_TRIGGER_SELECTOR = ".js-vote-trigger";

const VOTE_MODAL_WRAP = ".js-vote-modal-wrap";

const VOTE_COUNTER_SELECTOR = ".js-counter";
const VOTE_COUNTER_WRAP_SELECTOR = ".js-counter-wrap";

const SELECTED_CLASS = "checked";
const DISABLED_CLASS = "disabled";
const ACTIVE_CLASS = "active";

const VALUE_DATA_ATR = "data-value";

export const initVote = () => {
  dom(VOTE_SELECTOR).each((wrap) => {
    new Vote(wrap);
  });
};


class Vote extends Component {
  private triggers: Array<HTMLElement>;
  private counters: Array<HTMLElement>;
  private modalElement: HTMLElement;

  private voteId: string;

  constructor(wrap: HTMLElement) {

    super(wrap);

    this.wrap = wrap;

    this.voteId = this.wrap.getAttribute("data-modal");

    const modalWrap = this.query(`.js-vote-modal-wrap`, document);

    this.modalElement = this.query(`#${this.voteId}`, modalWrap);


    this.triggers = this.queryList(VOTE_TRIGGER_SELECTOR, this.wrap);
    this.counters = this.queryList(VOTE_COUNTER_SELECTOR, this.wrap);

    // this.modalWrap = this.query(VOTE_MODAL_WRAP, document);

    this.initComponent();
  }

  private initComponent = () => {
    this.initVote();
    this.initCounters();
  };

  private initVote = () => {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", this.handleClick, { once: true });
    });
  };

  private handleClick = (event: MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    this.triggers.forEach((trigger) => {
      this.setClass(trigger, DISABLED_CLASS);
    });

    this.removeClass(target, DISABLED_CLASS);
    this.setClass(target, SELECTED_CLASS);

    this.increaceCounter(target);
    // this.initModal();
  };

  private increaceCounter = (trigger: HTMLElement) => {
    const counter = this.query(
      VOTE_COUNTER_WRAP_SELECTOR,
      trigger.parentElement
    );

    this.setClass(counter, SELECTED_CLASS);
    this.resizeDigitsWrap(
      this.query(".block-content__item__counter-wrap__wrap", counter)
    );
  };

  private initModal = () => {
    const btn = this.query(".vote-modal__btn", this.modalElement);

    const timer1 = setTimeout(() => {
      this.setClass(this.modalElement, ACTIVE_CLASS);
    }, 30);

    const timer2 = setTimeout(() => {
      this.removeClass(this.modalElement, ACTIVE_CLASS);
    }, 3000);

    btn.addEventListener("click", () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      this.closeModal();
    }, {once: true});
  };


  private closeModal = () => {
    this.removeClass(this.modalElement, ACTIVE_CLASS);
  };

  private initCounters = () => {
    this.counters.forEach((counter) => {
      this.initCounter(counter);
    });
  };

  private initCounter = (counter: HTMLElement) => {
    const element = this.getCounterElement(counter);

    const counterWrap = this.query(VOTE_COUNTER_WRAP_SELECTOR, counter);

    counterWrap.appendChild(element);

    this.resizeDigitsWrap(element);

    window.addEventListener("resize", () => {
      this.resizeDigitsWrap(element);
    });
  };

  private resizeDigitsWrap = (element) => {
    let digits = [];

    let width = 0;

    const digitsWraps = this.queryList(
      ".block-content__item__counter-wrap__digit",
      element
    );

    digitsWraps.forEach((digitWrap, index) => {
      if (this.hasClass(element, SELECTED_CLASS)) {
        digits.push(this.query(".next", digitWrap));
      } else {
        digits.push(this.query("span", digitWrap));
      }
    });

    for (let i = 0; i < digits.length; i++) {
      width += digits[i].getBoundingClientRect().width + 2;
      // digitsWraps[i].style.width = `${digits[i].getBoundingClientRect().width}px`;
    }
    width = Number(width.toFixed(2));

    element.style.width = `${width}px`;
  };

  private getCounterElement = (counter) => {
    const currentValue = Number(counter.getAttribute(VALUE_DATA_ATR));
    const nextValue = currentValue + 1;

    const digits = String(currentValue).split("");
    const nextDigits = String(nextValue).split("");

    return (
      <div className="block-content__item__counter-wrap__wrap">
        {nextDigits.map((digit, index) => {
          return digits[index] == digit ? (
            <div
              key={index}
              className="block-content__item__counter-wrap__digit"
            >
              <span>{digit}</span>
            </div>
          ) : (
            <div
              key={index}
              className="block-content__item__counter-wrap__digit"
            >
              <span className="cur">{digits[index] || ""}</span>
              <span className="next">{digit}</span>
            </div>
          );
        })}
      </div>
    );
  };
}