import path from "path";
import fs from "fs";
import { TCopyPattermnOptions } from "./types";

export const getFile = (src: string) => {
    let file = path.resolve(src);

    if (fs.existsSync(file)) {
        return `${fs.readFileSync(file)}`;
    }

    return "";
};

/**
 * Плагин-заглушка
 */
export class StubPlugin {
    private static instance: StubPlugin | null = null;
    private constructor() {}

    public static init(): StubPlugin {
        if (!this.instance) {
            this.instance = new StubPlugin();
        }

        return this.instance;
    }

    public apply() {}
}

export const initCopyPattern = (options: TCopyPattermnOptions) => {
    const {
        pathDev = "",
        pathDist = "",
        ext = "",
        nested = false,
        pathTo = "",
    } = options;

    const nestedPath = nested ? "**" : "";
    const fileName = ext.length > 0 ? `*.${ext}` : "*";

    return {
        from: path.join(process.cwd(), pathDev, pathTo, nestedPath, fileName),
        to: ({ context, absoluteFilename = "" }) => {
            const relativePath = path
                .relative(context, absoluteFilename)
                .replace(pathDev, pathDist);

            return path.join(process.cwd(), relativePath);
        },
        noErrorOnMissing: true,
    };
};
