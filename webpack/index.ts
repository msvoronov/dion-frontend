import path from "path";

import { Configuration } from "webpack";

import { TSettings } from "./types";
import {
    initCache,
    initDevtool,
    initEntries,
    initOptimizations,
    initPlugins,
    initResolve,
    initRules,
} from "./configurations";
import { FOLDER } from "./enums";

export const initDefaultConfig = (settings: TSettings): any => {
    const { isDev, pathDist, onlyInlinePages } = settings;

    const mode = isDev ? "development" : "production";

    return {
        cache: initCache(settings),
        devtool: initDevtool(settings),
        entry: "./dev/js/index.ts",
        mode,
        module: {
            rules: initRules(settings),
        },
        optimization: initOptimizations(settings),
        output: {
            path: pathDist,
            filename: path.join(FOLDER.JS, "[name].min.js"),
            clean: true,
        },
        devServer: {
            static: ['assets', "ajax"],
            compress: true,
            port: 9000,
        },
        plugins: initPlugins(settings),
        resolve: initResolve(settings),
        target: "web",
        watch: isDev,
        watchOptions: {
            ignored: [
                "**/node_modules",
                "**/dist",
                "**/package.json",
                "**/package-lock.json",
                "**/tsconfig.json",
            ],
        },
    };
};
