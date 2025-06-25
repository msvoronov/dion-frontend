import path from "path";

import { initDefaultConfig } from "./webpack";
import { TSettings } from "./webpack/types";
import { initCopyPattern } from "./webpack/utils";

const SYSTEM_PATH = process.cwd();

enum PATHES {
    DEV = "dev",
    DIST = "dist",
}

const pathDev = path.join(SYSTEM_PATH, PATHES.DEV);
const pathDist = path.join(SYSTEM_PATH, PATHES.DIST);

const isDev = process.env.NODE_ENV === "development";

const defaultSettings: TSettings = {
    pathDev,
    pathDist,
    onlyInlinePages: false,
    isDev,
    compileFiles: [
        {
            from: path.join(pathDev, "assets"),
            to: path.join(pathDist, "assets"),
            noErrorOnMissing: true,
        },
        initCopyPattern({
            pathDev: PATHES.DEV,
            pathDist: PATHES.DIST,
            nested: true,
            pathTo: "ajax",
            ext: "json",
        }),
    ],
};
const config = initDefaultConfig(defaultSettings);

const defaultConfig = config

export default [defaultConfig];
