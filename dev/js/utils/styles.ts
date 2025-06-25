export const addClass = (
    el: HTMLElement | Element | null,
    ...classList: Array<string>
) => {
    el?.classList?.add(...classList);
};

export const removeClass = (
    el: HTMLElement | Element | null,
    ...classList: Array<string>
) => {
    el?.classList?.remove(...classList);
};

export const toggleClass = (
    el: HTMLElement | Element | null,
    className: string,
    force?: boolean
) => {
    el?.classList?.toggle(className, force);
};

export const containClass = (el: HTMLElement | Element, className: string) => {
    return el?.classList?.contains(className);
};
