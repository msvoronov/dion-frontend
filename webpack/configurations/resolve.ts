import path from "path";
import { TSettings } from "../types";

export const initResolve = (settings: TSettings) => {
    const { pathDev } = settings;

    return {
        extensions: [
            ".tsx",
            ".jsx",
            ".ts",
            ".js",
            ".css",
            ".scss",
            ".png",
            ".svg",
            ".pdf"
        ],
        alias: {
            img: path.join(pathDev, "assets", "img"),
            docs: path.join(pathDev, "assets", "pdf"),
            svg: path.join(pathDev, "assets", "svg"),
            js: path.join(pathDev, "js"),
            scss: path.join(pathDev, "scss"),
            css: path.join(pathDev, "css"),
        },
    };
};
