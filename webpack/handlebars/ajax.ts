import path from "path";

import { TSettings } from "../types";

export const initAjaxConfig = (settings: TSettings) => {
    return {
        entry: path.join(settings.pathDev, "ajax", "**", "*.hbs"),
        output: path.join(settings.pathDist, "ajax[path]/[name].html"),
    };
};
