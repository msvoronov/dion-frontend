import dom from "../DOM";

import { accord, getAccordInstance } from "./tools";

export const initAccordions = (context?) => {
    dom(".js-accord", context).each((el: HTMLElement) => {
        accord(el);
    });
};

export const initAreaAccordions = (context?) => {
    dom(".js-accord-area", context).each((el: HTMLElement) => {
        areaAccordion(el);
    });
};

export const initDisabledAccordions = (context) => {
    dom(".js-mob-menu", context).each((el: HTMLElement) => {
        disabledAreaAccordion(el);
    });
};

export const disabledAreaAccordion = (el: HTMLElement) => {
    let accords = (el.classList.contains(".js-accord")
        ? [el]
        : Array.from(el.querySelectorAll(".js-accord"))) as HTMLElement[];

    if (!accords.length) return;
    closeAreaAccordions(accords);
};

const areaAccordion = (el: HTMLElement) => {
    let accords = Array.from(el.querySelectorAll(".js-accord"));

    if (!accords.length) return;

    el.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const accord = target.closest(".js-accord") as HTMLElement;

        if (accord) {
            el.classList.add("collapsing");

            setTimeout(() => {
                el.classList.remove("collapsing");
                if (el.classList.contains("js-accord-scroll-to")) {
                    scrollToAccord(accord);
                }
            }, 600);
        }

        const isSomeOpen = accords.some((accord: HTMLElement) =>
            accord.dataset.collapse === "open" ? true : false
        );

        if (!isSomeOpen) return;

        closeAreaAccordions(accords as HTMLElement[], [accord]);
    });
};

const scrollToAccord = (accord: HTMLElement) => {
    const yOffset = -90;

    const y = accord.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
};

/**
 * Закрывает все передаваемые аккордионы, кроме тех, которые находятся в accordsToExclude
 * @param accords передаваемые аккордионы
 * @param accordsToExclude аккордионы, которые не должны закрываться
 */
export const closeAreaAccordions = (
    accords: HTMLElement[],
    accordsToExclude: HTMLElement[] = []
) => {
    accords.forEach((item) => {
        const isExclude = accordsToExclude.includes(item);
        if (isExclude) return;
        getAccordInstance(item)?.close();
    });
};
