export const getBabelLoader = () => {
    return {
        loader: "babel-loader",
        options: {
            cacheDirectory: true,
            cacheCompression: false,
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
                "@babel/plugin-transform-proto-to-assign",
                "@babel/plugin-transform-react-constant-elements",
                "@babel/plugin-transform-shorthand-properties",
                "@babel/plugin-proposal-class-properties",
            ],
        },
    };
};
