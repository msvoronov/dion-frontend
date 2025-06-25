import { UtilsComponent } from "./UtilsComponent";

const DEFAUT_DELAY = 100;

class Async extends UtilsComponent {
    public constructor() {
        super({});
    }

    public static debounce = <F extends (...args: Array<unknown>) => unknown>(
        func: F,
        delay = DEFAUT_DELAY
    ) => {
        let timer: NodeJS.Timeout | null = null;

        return (...args: Parameters<F>) => {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    public static throttle = <F extends (...args: Array<unknown>) => unknown>(
        callee: F,
        timeout: number
    ) => {
        let timer: NodeJS.Timeout | null = null;

        return (...args: Parameters<F>) => {
            if (timer) {
                return;
            }

            timer = setTimeout(() => {
                callee(...args);

                clearTimeout(timer);
                timer = null;
            }, timeout);
        };
    };
}

export default Async;
