import {
    getCSSLoader,
    getPostCssLoader,
    getScssLoader,
    getStyleLoader,
} from "../loaders";

import { TSettings } from "../../types";

export const getScssRule = (settings: TSettings) => {
    return {
        test: /.scss$/,
        use: [
            getStyleLoader(settings),
            getCSSLoader(settings),
            getPostCssLoader(settings),
            getScssLoader(settings),
        ],
    };
};
