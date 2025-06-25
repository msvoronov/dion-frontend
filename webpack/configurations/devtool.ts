import { TSettings } from "../types";

export const initDevtool = (settings: TSettings) => {
    const { isDev } = settings;

    return isDev ? "eval-source-map" : undefined;
};
