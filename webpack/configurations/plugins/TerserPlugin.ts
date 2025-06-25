import TerserPlugin from "terser-webpack-plugin";

export const initTerserPlugin = () => {
    return new TerserPlugin({
        parallel: true,
        terserOptions: {
            compress: true,
            format: {
                comments: false,
            },
            toplevel: true,
        },
        extractComments: false,
    });
};
