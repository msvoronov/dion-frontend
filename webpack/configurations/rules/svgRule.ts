import { getRawLoader } from "../loaders";

export const getSvgRule = () => {
    return {
        test: /\.svg$/i,
        use: [getRawLoader()],
    };
};
