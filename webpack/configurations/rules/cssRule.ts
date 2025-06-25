import { getCSSLoader, getPostCssLoader, getStyleLoader } from "../loaders";

import { TSettings } from "../../types";

export const getCssRule = (settings: TSettings) => {
    return {
        test: /\.css$/,
        use: [
            getStyleLoader(settings),
            getCSSLoader(settings),
            getPostCssLoader(settings),
        ],
    };
};
