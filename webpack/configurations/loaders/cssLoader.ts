import { TSettings } from "../../types";

export const getCSSLoader = (settings: TSettings) => {
    const { isDev } = settings;

    return {
        loader: "css-loader",
        options: {
            url: false,
            sourceMap: isDev,
        },
    };
};
