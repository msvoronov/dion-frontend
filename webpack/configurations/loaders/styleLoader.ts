import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { TSettings } from "../../types";

export const getStyleLoader = (_settings: TSettings) => {
    // const { isDev } = settings;

    // return isDev ? "style-loader" : MiniCssExtractPlugin.loader;
    return MiniCssExtractPlugin.loader;
};
