import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";

export const initForkTsCheckerWebpackPlugin = () => {
    return new ForkTsCheckerWebpackPlugin();
};
