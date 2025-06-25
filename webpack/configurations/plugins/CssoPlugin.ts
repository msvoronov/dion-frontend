import CssoPlugin from "csso-webpack-plugin";

import { TSettings } from "../../types";

export const initCssoPlugin = (settings: TSettings) => {
    const { isDev } = settings;

    return new CssoPlugin({
        usage: isDev ? "pack" : "minify",
        comments: false,
        restructure: true,
        restructureSemantically: !isDev,
    });
};
