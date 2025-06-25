import { getBabelLoader, initSourceMapLoader } from "../loaders";

export const getJsRule = () => {
    return {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [initSourceMapLoader(), getBabelLoader()],
    };
};
