import { ObjectPattern } from "copy-webpack-plugin";
import { EXT } from "./enums";

export type TSettings = {
    pathDev: string;
    pathDist: string;
    isDev: boolean;
    compileFiles: ObjectPattern[];
    onlyInlinePages?: boolean;
};

export type TDevBuild = "main";

export type TEntryName = "index";

export type TEntryNameList = Array<TEntryName>;

export type TDevBuildRecord = Record<TDevBuild, TEntryNameList>;

export type TEntryRecord = Partial<Record<TEntryName, string>>;

export type TPathRecord = Record<EXT, string>;

export type TCopyPattermnOptions = {
    pathDev: string;
    pathDist: string;
    nested?: boolean;
    ext?: string;
    pathTo: string;
};
