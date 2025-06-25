import { Context } from "js/libs/DOM/types";

import { initAccordions, initAreaAccordions } from "./accordion/accordion";
import { modal } from "./modals";

export const dynamicLibs = (context?: Context) => {4
    initAccordions(context);
    initAreaAccordions(context);
    modal(context);
};

export const staticLibs = () => {
};
