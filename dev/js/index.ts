import "../scss";

import "./global";

import { Context } from "./libs/DOM/types";

import { dynamicLibs, staticLibs } from "./libs";
import { dynamicSwiper, staticSwiper } from "./swiper";
import { dynamicComponents, staticComponents } from "./components";
import { initForms } from "./form";
import { staticScripts } from "./script";

let IS_INITED = false;

export const dynamicFunctions = (context?: Context) => {
    if (IS_INITED && !context) {
        return;
    }

    IS_INITED = true;

    initForms(context);
    dynamicLibs(context);
    dynamicSwiper(context);
    dynamicComponents(context);
};

const staticFunctions = () => {
    staticLibs();
    staticSwiper();
    staticComponents();
    staticScripts()
};

window.dynamicFunctions = dynamicFunctions;

staticFunctions();
window.addEventListener("DOMContentLoaded", () => dynamicFunctions());
