import {
    callAfterTransition,
    callCustomEvent,
    reflow,
    dispatchEvents,
    getFromMapStorage,
    setToMapStorage,
    deleteFromMapStorage,
} from "js/utils";

const INSTANCES = new Map();

const CLASS_COLLAPSE = "collapse";
const CLASS_COLLAPSING = "collapsing";
const CLASS_ACTIVE = "active";
const CLASS_DISABLED = "disabled";

const SYNC_GROUP_ATTR = "data-sync-group";

export const accord = (
    el: HTMLElement,
    settings: AccordionSettings = {}
): Accordion => {
    const existedInstance = getAccordInstance(el);
    /* if (existedInstance) return existedInstance; */
    return new Accordion(el, settings).init();
};

export const getAccordInstance = (el: HTMLElement): Accordion => {
    return getFromMapStorage(INSTANCES, el);
};

interface AccordionSettings {}

interface AccordionCallbacks {
    before?: (instance: Accordion) => void;
    after?: (instance: Accordion) => void;
}

export class Accordion {
    el: HTMLElement;
    trigger: HTMLElement;
    content: HTMLElement;
    contentList: Array<HTMLElement>;
    closeTrigger: HTMLElement;

    settings: AccordionSettings;

    isActive: boolean;
    isDisabled: boolean;
    isInited: boolean;

    private syncGroup: string | null;

    constructor(el: HTMLElement, settings: AccordionSettings = {}) {
        this.el = el;

        this.trigger = this.el.querySelector(".js-accord-trigger");

        if (!this.trigger) return;

        //Предусмотрено несколько тел
        this.contentList = Array.from(
            this.el.querySelectorAll(":scope > .js-accord-body")
        );

        if (this.contentList.length <= 0) return;

        this.closeTrigger = this.el.querySelector(".js-close-accord");

        this.isDisabled = this.el.classList.contains(CLASS_DISABLED);
        this.isActive = this.el.classList.contains(CLASS_ACTIVE);

        this.settings = {
            ...settings,
        };

        this.syncGroup = this.el.getAttribute(SYNC_GROUP_ATTR) || null;
    }

    init() {
        this.el.classList.add(CLASS_COLLAPSE);

        if (this.isActive) {
            this.toggleDataCollapse(true);
        }

        if (!this.trigger) return;
        let trigger = this.trigger ? this.trigger : this.el;

        trigger.addEventListener("click", this.handlerTrigger);

        if (this.closeTrigger) {
            this.closeTrigger.addEventListener("click", (e) => {
                this.handlerTrigger(e);
            });
        }

        this.isInited = true;
        this.el.classList.add("accord-inited");

        setToMapStorage(INSTANCES, this.el, this);
        return this;
    }

    open(silent = false, callbacks: AccordionCallbacks = {}) {
        if (this.isDisabled) return;

        this.dispatch(this.el, "before-open", silent);
        callCustomEvent(callbacks, "before", this);

        this.toggleDataCollapse(true);

        this.isActive = true;
        this.el.classList.remove(CLASS_COLLAPSE);
        this.el.classList.add(CLASS_COLLAPSING);

        /*   if (!this.content) return;
  
          this.content.style.height = this.content.scrollHeight + "px"; */

        //Предусмотрено несколько тел
        this.contentList.forEach((cont) => {
            cont.style.height = cont.scrollHeight + "px";
        });

        const complete = () => {
            this.el.classList.add(CLASS_COLLAPSE, CLASS_ACTIVE);
            this.el.classList.remove(CLASS_COLLAPSING);

            // this.content.style.height = "";

            //Предусмотрено несколько тел
            this.contentList.forEach((cont) => {
                cont.style.height = "";
            });

            this.dispatch(this.el, "after-open", silent);
            callCustomEvent(callbacks, "after", this);
        };

        //Предусмотрено несколько тел
        this.contentList.forEach((cont) => {
            callAfterTransition(complete, cont);
        });

        // callAfterTransition(complete, this.content);

        const syncEl = this.getSyncGroupElList();
        syncEl.forEach((acc) => {
            if (acc === this) {
                return;
            }

            acc.close();
        });
    }

    close(silent = false, callbacks: AccordionCallbacks = {}) {
        if (this.isDisabled) return;

        this.dispatch(this.el, "before-close", silent);
        callCustomEvent(callbacks, "before", this);

        this.toggleDataCollapse(false);

        /*   if (!this.content) return;
          this.content.style.height =
              this.content.getBoundingClientRect().height + "px";
          reflow(this.content); */

        //Предусмотрено несколько тел
        this.contentList.forEach((cont) => {
            cont.style.height = cont.getBoundingClientRect().height + "px";
            reflow(cont);
        });

        this.isActive = false;
        this.el.classList.add(CLASS_COLLAPSING);
        this.el.classList.remove(CLASS_ACTIVE, CLASS_COLLAPSE);

        // this.content.style.height = "";

        //Предусмотрено несколько тел
        this.contentList.forEach((cont) => {
            cont.style.height = "";
        });

        const complete = () => {
            this.el.classList.add(CLASS_COLLAPSE);
            this.el.classList.remove(CLASS_COLLAPSING);

            this.dispatch(this.el, "after-close", silent);
            callCustomEvent(callbacks, "after", this);
        };

        ///Включить, если нужно, чтобы по закрытии скролилось к accord-head
        // this.el.scrollIntoView();

        //Предусмотрено несколько тел
        this.contentList.forEach((cont) => {
            callAfterTransition(complete, cont);
        });

        // callAfterTransition(complete, this.content);
    }

    private getSyncGroupElList = () => {
        if (!this.syncGroup) {
            return [];
        }

        return Array.from(
            document.querySelectorAll<HTMLElement>(
                `[${SYNC_GROUP_ATTR}=${this.syncGroup}]`
            )
        ).map((el) => getAccordInstance(el));
    };

    destroy() {
        if (this.isActive) {
            this.close(true);
        }

        let trigger = this.trigger ? this.trigger : this.el;
        trigger.removeEventListener("click", this.handlerTrigger);

        this.isDisabled = false;
        this.isInited = false;

        deleteFromMapStorage(INSTANCES, this.el);
    }

    disable() {
        if (this.isDisabled) return;

        this.el.classList.add(CLASS_DISABLED);
        this.isDisabled = true;
    }

    undisable() {
        if (!this.isDisabled) return;

        this.el.classList.remove(CLASS_DISABLED);
        this.isDisabled = false;
    }

    // Инициализирует свитч аккордиона по клику
    private handlerTrigger = (e) => {
        e.preventDefault();
        if (this.isActive) {
            this.close();
        } else {
            this.open();
        }
    };

    private dispatch(el: HTMLElement, ev: string, silent: boolean) {
        if (silent) return;
        dispatchEvents(el, ev, { detail: this });
    }

    private toggleDataCollapse(isOpen: boolean) {
        let type = isOpen ? "open" : "close";
        this.el.setAttribute("data-collapse", type);
    }
}
