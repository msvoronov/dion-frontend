import path from "path";

import { TSettings } from "../types";

export const initPagesConfig = (settings: TSettings) => {
    return {
        entry: path.join(settings.pathDev, "pages", "**", "*.hbs"),
        output: path.join(settings.pathDist, "[name].html"),
    };
};