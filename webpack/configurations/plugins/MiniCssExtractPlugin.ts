import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";

import { FOLDER } from "../../enums";

export const initMiniCssExtractPlugin = () => {
    return new MiniCssExtractPlugin({
        filename: path.join(FOLDER.CSS, "[name].min.css"),
    });
};
