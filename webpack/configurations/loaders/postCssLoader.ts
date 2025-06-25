import { TSettings } from "../../types";

export const getPostCssLoader = (settings: TSettings) => {
    const { isDev } = settings;

    return {
        loader: "postcss-loader",
        options: {
            postcssOptions: {
                plugins: [
                    "postcss-import",
                    "postcss-combine-duplicated-selectors",
                    "postcss-flexbugs-fixes",
                    "postcss-will-change",
                    "postcss-merge-rules",
                    "autoprefixer",
                    "postcss-combine-media-query",
                    "postcss-sort-media-queries",
                ],
            },
            sourceMap: isDev,
        },
    };
};
