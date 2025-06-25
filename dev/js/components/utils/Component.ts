import { query, queryList } from "js/utils";

import { TUtilsComponentOptions, UtilsComponent } from "./UtilsComponent";

export type TComponentOptions = TUtilsComponentOptions & {
    updateInView?: boolean;
};

export type TSizeEntry = [number | string, number];

export const sortSizesByKey = (
    [_key1, val1]: TSizeEntry,
    [_key2, val2]: TSizeEntry
) => {
    if (val1 < val2) {
        return -1;
    } else if (val1 > val2) {
        return 1;
    } else {
        return 0;
    }
};

export const findCurrentEntryFromSortedSizes = ([_key, value]: TSizeEntry) =>
    window.innerWidth < value;

const DEFAULT_OPTIONS: TComponentOptions = {
    updateInView: false,
};

const EVENT_OPTIONS = {
    PASSIVE: {
        passive: true,
    },
};

export class Component<
    W extends HTMLElement = HTMLElement
> extends UtilsComponent {
    protected wrap: W;
    protected options: TComponentOptions;

    protected static EVENT_OPTIONS = EVENT_OPTIONS;
    protected static IN_VIEW_Y_ATTR = "data-c-in-view";
    protected static IN_VIEW_FULL_Y_ATTR = "data-c-in-view-full";
    protected static INITED_ATTR = "data-c-inited";

    protected static ACTIVE_ATTR = "data-active";
    protected static OPEN_ATTR = "data-open";

    public constructor(wrap: W, options?: TComponentOptions) {
        super(options);

        this.wrap = wrap;

        this.options = {
            ...DEFAULT_OPTIONS,
            ...(options ? options : {}),
        };

        this.setInited();

        this.initComponentState();
    }

    private initComponentState = () => {
        if (this.options.updateInView) {
            window.addEventListener("scroll", this.updateInViewY);
            window.addEventListener("resize", this.updateInViewY);

            const resizeObserver = new ResizeObserver(this.updateInViewY);

            resizeObserver.observe(this.wrap);
        }
    };

    private updateInViewY = () => {
        const { inView, inViewFull } = this.checkIfElementIsInViewportY(
            this.wrap
        );

        this.wrap.toggleAttribute(Component.IN_VIEW_Y_ATTR, inView);
        this.wrap.toggleAttribute(Component.IN_VIEW_FULL_Y_ATTR, inViewFull);
    };

    private setInited = () => {
        this.wrap.setAttribute(Component.INITED_ATTR, "");
    };

    protected dispatchEvent = <D extends Record<string, any>>(
        eventName: string,
        el: HTMLElement = this.wrap,
        data?: D
    ) => {
        const event = new CustomEvent<D>(eventName, {
            detail: data,
        });

        el.dispatchEvent(event);
    };

    protected query = <T extends HTMLElement>(
        selectors: string,
        container: HTMLElement | Document | null = this.wrap
    ): T | null => {
        if (!container) {
            return null;
        }

        return query<T>(selectors, container);
    };

    protected queryList = <T extends HTMLElement = HTMLElement>(
        selectors: string,
        container: HTMLElement | Document | null = this.wrap
    ): Array<T> => {
        if (!container) {
            return [];
        }

        return queryList<T>(selectors, container);
    };
}
