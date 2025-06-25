import fs from "fs";

import { TSettings } from "../types";
import { getFile } from "../utils";

const LG_MIN_BREAKPOINT = "1024px";
const MD_MIN_BREAKPOINT = "1023.9px";
const S_MIN_BREAKPOINT = "575.9px";

const HEX_CHARACTERS = "0123456789absdef";
const RANDOM_ID_LENGTH = 32;

export const initHelpers = (settings: TSettings) => {
    const { pathDev } = settings;

    const getImgTag = (tag: any, path: string, alt?: string) => {
        return `<img ${tag}="/assets/${path}" alt="${
            alt ? alt : "image"
        }">`;
    };

    const getSourceMinTag = (src: string, breakpoint: string) => {
        return `<source media="(min-width:${breakpoint})" srcset="/assets/img/${src}">`;
    };
    const getSourceMaxTag = (src: string, breakpoint: string) => {
        return `<source media="(max-width:${breakpoint})" srcset="/assets/img/${src}">`;
    };
    const getPicture = (str: string) => {
        return `<picture>${str}</picture>`;
    };

    return {
        ajax: (path = "", attr = "action") => {
            return `${attr}="/dist/ajax/${path}"`;
        },

        url: (path: string) => {
            return `${path}`;
        },

        generateRandomId() {
            return Array.from({ length: RANDOM_ID_LENGTH }).reduce((acc) => {
                const randomIndex = Math.floor(
                    Math.random() * HEX_CHARACTERS.length
                );

                return acc + HEX_CHARACTERS[randomIndex];
            }, "");
        },
        ternary(cond: boolean, v1: any, v2: any) {
            return cond ? v1 : v2;
        },
        range(count: number) {
            const result: Array<number> = [];

            for (let i = 1; i <= count; i++) {
                result.push(i);
            }

            return result;
        },

        getSvg: (params) => {
            if (params.hash.img) {
                let tag = params.lazy ? "data-src" : "src";

                return getImgTag(
                    tag,
                    `svg/${params.hash.src}.svg`,
                    params.hash.alt
                );
            } else {
                return getFile(`${pathDev}/assets/svg/${params.hash.src}.svg`);
            }
        },

        getFile: (params) => {
            return getFile(`${pathDev}/${params.hash.src}`);
        },

        getImg: (params) => {
            let tag = params.lazy ? "data-src" : "src";

            return getImgTag(tag, `img/${params.hash.src}`, params.hash.alt);
        },

        getPicture: (params) => {
            const reservImg = getImgTag(
                "src",
                `img/${params.hash.src}`,
                params.hash.alt
            );

            const lgSource = params.hash.md
                ? getSourceMinTag(params.hash.src, LG_MIN_BREAKPOINT)
                : "";
            const mdSource = params.hash.md
                ? getSourceMaxTag(params.hash.md, MD_MIN_BREAKPOINT)
                : "";
            const sSource = params.hash.s
                ? getSourceMaxTag(params.hash.s, S_MIN_BREAKPOINT)
                : "";

            return getPicture(`${sSource}${mdSource}${lgSource}${reservImg}`);
        },

        json: (obj: Object) => {
            try {
                return JSON.stringify(obj);
            } catch {
                return "";
            }
        },

        log: (message: any) => {
            console.log(message);
        },

        trim: (value: string | number) => {
            return value.toString().trim();
        },

        increment: (value: number) => {
            return value + 1;
        },

        eq: (first: any, second: any) => {
            return first === second;
        },

        decrement: (value: number) => {
            return value - 1;
        },

        isEven: (value: number) => {
            return value % 2 === 0;
        },

        isOdd: (value: number) => {
            return value % 2 === 1;
        },

        addZero: (value: number) => {
            return (value + 1).toString().padStart(2, "0");
        },

        gte: (a: number, b: number) => {
            return a >= b;
        },
    };
};
