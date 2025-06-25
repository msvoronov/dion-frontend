import { HTMLAnyElement } from "js/libs/DOM/types";

export const execute = <F extends (...args: any[]) => any>(
    callback?: F,
    ...args: Parameters<F>
): ReturnType<F> | void => {
    if (!callback) {
        return;
    }

    callback(...args);
};

export const callCustomEvent = <
    N extends string,
    F extends (...args: Array<any>) => any,
    R extends Partial<Record<N, F>>
>(
    events: R,
    evName: N,
    ...args: Parameters<F>
) => {
    execute(events[evName], ...args);
};

/**
 * Вызывает callback тогда, когда закончилась анимация css для элемента
 * @returns
 */
export const callAfterTransition = (
    callback: Function,
    transitionEl: HTMLElement,
    waitForTransition = true
) => {
    if (!waitForTransition) {
        callback();
        return;
    }

    const durationPadding = 5;
    const emulatedDuration =
        getTransitionDurationFromEl(transitionEl) + durationPadding;

    let isCalled = false;

    transitionEl.addEventListener("transitionend", handler);

    setTimeout(() => {
        if (!isCalled) {
            dispatchEvents(transitionEl, "transitionend");
        }
    }, emulatedDuration);

    function handler({ target }: Event) {
        if (target !== transitionEl) return;

        isCalled = true;
        transitionEl.removeEventListener("transitionend", handler);
        callback();
    }
};

export const getTransitionDurationFromEl = (el: HTMLElement) => {
    if (!el) return 0;

    let { transitionDuration, transitionDelay } = window.getComputedStyle(el);

    const floatTransitionDuration = Number.parseFloat(transitionDuration);
    const floatTransitionDelay = Number.parseFloat(transitionDelay);

    if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
    }

    // Личилка, если задано несколько несколько transition-duration
    transitionDuration = transitionDuration.split(",")[0];
    transitionDelay = transitionDelay.split(",")[0];

    return (
        (Number.parseFloat(transitionDuration) +
            Number.parseFloat(transitionDelay)) *
        1000
    );
};

export const dispatchEvents = (
    el: HTMLElement,
    events: string,
    sets: CustomEventInit = {}
) => {
    let eventInit: CustomEventInit = {
        bubbles: true,
        cancelable: true,
        ...sets,
    };

    events.split(" ").forEach((ev) => {
        let customEvent = new CustomEvent(ev, eventInit);
        el.dispatchEvent(customEvent);
    });
};

/**
 * - Проверяет ести ли элемент с селектором selector в событии e
 */
export const inEvent = (
    e: MouseEvent,
    selector: string
): HTMLElement | false => {
    let path = e.composedPath();

    let total = path.length;
    let i: number;

    for (i = 0; i < total; i++) {
        // @ts-ignore
        if (path[i] && path[i].tagName && path[i].matches(selector)) {
            return path[i] as HTMLElement;
        }
    }

    return false;
};

export const reflow = (el: HTMLElement) => {
    el.offsetHeight;
};

export const getAllDataAttr = (el: HTMLAnyElement) => {
    let data: Object = {};
    [].forEach.call(el.attributes, function (attr) {
        if (/^data-/.test(attr.name)) {
            let camelCaseName = attr.name
                .substr(5)
                .replace(/-(.)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
            data[camelCaseName] = attr.value;
        }
    });

    return data;
};
