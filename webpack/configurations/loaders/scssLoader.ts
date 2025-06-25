import { TSettings } from "../../types";

export const getScssLoader = (settings: TSettings) => {
    const { isDev } = settings;

    return {
        loader: "sass-loader",
        options: {
            sourceMap: isDev,
        },
    };
};
