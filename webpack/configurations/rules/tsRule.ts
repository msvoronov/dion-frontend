import { getTsLoader } from "../loaders";

export const getTsRule = () => {
    return {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [getTsLoader()],
    };
};
