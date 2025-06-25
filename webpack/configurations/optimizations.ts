import { TSettings } from "../types";
import { StubPlugin } from "../utils";

import { initCssMinimizerPlugin, initTerserPlugin } from "./plugins";

import webpack from "webpack";

const stubPlugin = StubPlugin.init();

export const initOptimizations = (
    settings: TSettings
): webpack.Configuration["optimization"] => {
    const { isDev, onlyInlinePages } = settings;

    if (onlyInlinePages) {
        return;
    }

    return {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                default: false,
                assets: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "assets",
                    reuseExistingChunk: true,
                },
            },
        },
        removeAvailableModules: true,
        minimize: !isDev,
        minimizer: isDev ? [] : [initCssMinimizerPlugin(), initTerserPlugin()],
    };
};
