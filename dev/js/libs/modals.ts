import dom from "./DOM";
import { Context } from "js/libs/DOM/types";

import { toggleScroll } from "js/utils";

let timerID;

export const modal = (context?: Context) => {
    initOpenModals(context);
    initCloseModals(context);
};

const initOpenModals = (context: Context) => {
    dom(".js-open-modal", context).on("click", (e) => {
        e.preventDefault();
        const cur = e.currentTarget as HTMLElement;
        if (!cur.dataset.target) return;

        closeAllModals();
        openModalById(cur.dataset.target);
    });

    dom("[data-onload]", context).each((el) => {
        setTimeout(() => {
            if (location.pathname === "/") {
                openModalById(el.dataset.target);
            }
        }, 7000);
    });
};

const initCloseModals = (context: Context) => {
    dom(".js-close-modal", context).on("click", (e) => {
        e.preventDefault();
        const cur = e.currentTarget as HTMLElement;
        if (!cur.dataset.target) return;
        closeModalById(cur.dataset.target);
    });

    dom(".modal", context).on("click", (e) => {
        const cur = e.currentTarget as HTMLElement;
        if (!cur.id) return;
        closeModalById(cur.id);
    });

    dom(".modal-content", context).on("click", (e) => {
        e.stopPropagation();
    });
};

export const clearModalById = (modalId: string) => {
    let domModal = dom(`#${modalId}`, true);

    dom("form", domModal).each((form: HTMLFormElement) => {
        dom("input", form).each((input: HTMLInputElement) => {
            input.classList.remove("has-value");
        });
        dom(".input-wrap", form).each((input: HTMLInputElement) => {
            input.classList.remove("has-error");
            input.classList.remove("has-value");
        });

        form.reset();

        form.classList.remove("is-valid");
    });
};

export const openModal = (modal: HTMLElement, autoclose?: boolean) => {
    modal.classList.add("active");

    modal.dispatchEvent(new Event("open"));

    toggleScroll(document.documentElement, true);

    if (autoclose) {
        timerID = setTimeout(() => {
            closeAllModals();
        }, 5000);
    }
};

export const closeModal = (modal: HTMLElement, disable?: boolean) => {
    modal.classList.remove("active");
    modal.dispatchEvent(new Event("close"));

    toggleScroll(document.documentElement, false);

    clearTimeout(timerID);
};

export const openModalById = (modalId: string, autoclose?: boolean) => {
    let domModal = dom(`#${modalId}`, true);

    domModal.addClass("active");
    domModal.dispatch("open");
    toggleScroll(document.documentElement, true);

    if (autoclose) {
        timerID = setTimeout(() => {
            closeAllModals();
        }, 5000);
    }
};

export const closeModalById = (modalId: string) => {
    let domModal = dom(`#${modalId}`, true);
    domModal.removeClass("active");
    domModal.dispatch("close");
    let scrollableEl = dom(".js-scrollable-el", domModal).get(0);

    setTimeout(() => {
        scrollableEl.scrollTo({
            top: 0,
        });
    }, 300);

    toggleScroll(document.documentElement, false);
    clearTimeout(timerID);
};

export const closeAllModals = () => {
    dom(".modal").removeClass("active");

    toggleScroll(document.documentElement, false);
};
