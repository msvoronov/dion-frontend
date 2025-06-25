import path from "path";

import { TSettings } from "../types";
import { FOLDER } from "../enums";

export const initPartials = (settings: TSettings) => {
    const partialsPath = path.join(settings.pathDev, FOLDER.PARTIALS);

    return [path.join(partialsPath, "**", "*.hbs")];
};
