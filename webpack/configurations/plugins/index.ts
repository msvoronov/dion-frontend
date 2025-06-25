import { WebpackPluginInstance } from "webpack";

import { initRemoveEmptyScriptsPlugin } from "./RemoveEmptyScriptsPlugin";
import { initMiniCssExtractPlugin } from "./MiniCssExtractPlugin";
import { initCopyWebpackPlugin } from "./CopyWebpackPlugin";
import {
    initAjaxHandlebarsPlugin,
    initPagesHandlebarsPlugin,
} from "./HandlebarsPlugin";
import { initForkTsCheckerWebpackPlugin } from "./ForkTsCheckerWebpackPlugin";
import { initCssoPlugin } from "./CssoPlugin";

import { TSettings } from "../../types";

export const initPlugins = (
    settings: TSettings
): Array<WebpackPluginInstance> => {
    const { onlyInlinePages } = settings;

    return [
        initRemoveEmptyScriptsPlugin(),
        initMiniCssExtractPlugin(),
        initCopyWebpackPlugin(settings),
        initForkTsCheckerWebpackPlugin(),
        initPagesHandlebarsPlugin(settings),
        initAjaxHandlebarsPlugin(settings),
        initCssoPlugin(settings),
    ];
};

export { initRemoveEmptyScriptsPlugin } from "./RemoveEmptyScriptsPlugin";
export { initMiniCssExtractPlugin } from "./MiniCssExtractPlugin";
export { initCopyWebpackPlugin } from "./CopyWebpackPlugin";
export {
    initAjaxHandlebarsPlugin,
    initPagesHandlebarsPlugin,
} from "./HandlebarsPlugin";
export { initForkTsCheckerWebpackPlugin } from "./ForkTsCheckerWebpackPlugin";
export { initTerserPlugin } from "./TerserPlugin";
export { initCssMinimizerPlugin } from "./CssMinimizerPlugin";
export { initCssoPlugin } from "./CssoPlugin";
