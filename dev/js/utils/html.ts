export const query = <T extends HTMLElement = HTMLElement>(
    selectors: string,
    container: HTMLElement | Document | null
): T | null => {
    if (!container) {
        return null;
    }

    return container.querySelector<T>(selectors);
};

export const queryList = <T extends HTMLElement = HTMLElement>(
    selectors: string,
    container: HTMLElement | Document | null
): Array<T> => {
    if (!container) {
        return [];
    }

    const nodeList = container.querySelectorAll<T>(selectors);

    return nodeListToArr<T>(nodeList);
};

export const nodeListToArr = <T extends HTMLElement = HTMLElement>(
    list: NodeListOf<T>
): Array<T> => {
    return Array.from<T>(list);
};

export const isMedia = (query: string) => {
    return window.matchMedia(`(${query})`).matches;
};
