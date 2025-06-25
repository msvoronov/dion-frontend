import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

export const initCssMinimizerPlugin = () => {
    return new CssMinimizerPlugin({
        minimizerOptions: {
            preset: [
                "default",
                {
                    discardComments: { removeAll: true },
                },
            ],
        },
        parallel: true,
    });
};
