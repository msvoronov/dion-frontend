import { addClass, removeClass } from "js/utils";

export type TUtilsComponentOptions = {};

const DEFAULT_OPTIONS: TUtilsComponentOptions = {};

export class UtilsComponent {
    protected options: TUtilsComponentOptions;

    public constructor(options?: TUtilsComponentOptions) {
        this.options = {
            ...DEFAULT_OPTIONS,
            ...(options ? options : {}),
        };
    }

    protected inRange = (value: number, min: number, max: number) => {
        return Math.min(max, Math.max(value, min));
    };

    protected setClass = (el: HTMLElement, className: string) => {
        addClass(el, className);
    };

    // protected setClasses = (el: HTMLElement, className: Array<string>) => {
    //     addClasses(el, className);
    // };

    protected removeClass = (el: HTMLElement, className: string) => {
        removeClass(el, className)
    };

    protected hasClass = (el: HTMLElement, className: string) =>
        el.classList.contains(className) ? true : false;

    protected hasActiveClass = (el: HTMLElement) =>
        el.classList.contains("active") ? true : false;

    protected checkIfElementIsInViewportY = (element: HTMLElement) => {
        const topFull = this.getTopPos(element);

        const { top, height } = this.getRect(element);
        const { scrollY } = window;

        const windowHeight =
            window.innerHeight || document.documentElement.clientHeight;
        const halfWindowHeight = windowHeight / 2;

        const inView =
            scrollY + windowHeight >= topFull && scrollY <= topFull + height;
        const inViewFull =
            top <= halfWindowHeight && top + height >= halfWindowHeight;

        return {
            inView,
            inViewFull,
        };
    };

    protected updateFrame = (cb: () => void) => {
        window.requestAnimationFrame(cb);
    };

    protected getRect = (el: HTMLElement) => {
        
        return el.getBoundingClientRect();
    };

    protected getTopPos = (el: HTMLElement) => {
        let topOffset = 0;
        let currentElement: HTMLElement | null = el;

        while (currentElement) {
            topOffset += currentElement.offsetTop;
            currentElement = currentElement.offsetParent as HTMLElement | null;
        }

        return topOffset;
    };

    protected getTranslate3dPxProp = (x = 0, y = 0, z = 0) => {
        return `translate3d(${x}px, ${y}px, ${z}px)`;
    };

    protected getTransform3dPctProp = (x = 0, y = 0, z = 0) => {
        const xPct = x === 0 ? "" : "%";
        const yPct = y === 0 ? "" : "%";
        const zPct = z === 0 ? "" : "%";

        return `translate3d(${x}${xPct}, ${y}${yPct}, ${z}${zPct})`;
    };

    protected afterDelay = (cb: () => void, delay: number) => {
        return setTimeout(cb, delay);
    };

    protected delay = (cb: () => void, delay = 300): Promise<void> => {
        return new Promise((res) => {
            setTimeout(() => {
                cb();

                res();
            }, delay);
        });
    };
}
