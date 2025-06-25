import CopyWebpackPlugin from "copy-webpack-plugin";

import { TSettings } from "../../types";

export const initCopyWebpackPlugin = (settings: TSettings) => {
    return new CopyWebpackPlugin({
        patterns: settings.compileFiles,
    });
};
