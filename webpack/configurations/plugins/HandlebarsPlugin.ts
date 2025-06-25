import HandlebarsPlugin from "handlebars-webpack-plugin";

import { TSettings } from "../../types";
import {
    initAjaxConfig,
    initHelpers,
    initPagesConfig,
    initPartials,
    initStore,
} from "../../handlebars";

export const initHandlebarsPlugin = (
    settings: TSettings,
    entry: string,
    output: string
) => {
    return new HandlebarsPlugin({
        htmlWebpackPlugin: {
            enabled: true,
            prefix: "html",
        },
        data: {
            store: initStore(),
        },
        entry,
        output,
        partials: initPartials(settings),
        helpers: initHelpers(settings),
    });
};

export const initPagesHandlebarsPlugin = (settings: TSettings) => {
    const { entry, output } = initPagesConfig(settings);

    return initHandlebarsPlugin(settings, entry, output);
};

export const initAjaxHandlebarsPlugin = (settings: TSettings) => {
    const { entry, output } = initAjaxConfig(settings);

    return initHandlebarsPlugin(settings, entry, output);
};
