import path from "path";
import fs from "fs";

import {
    TDevBuild,
    TEntryName,
    TEntryNameList,
    TEntryRecord,
    TPathRecord,
} from "../types";
import { EXT, FOLDER, MAIN_PATH } from "../enums";
import { DEV_BUILDS } from "../constants";

const removeDevBuildsDuplicate = (entryNameList: Array<TEntryNameList>) => {
    const flattedList = entryNameList.flat();
    const uniqSet = new Set(flattedList);

    return Array.from(uniqSet);
};

const checkFileExists = (filePath: string) => {
    const fileFullPath = path.join(MAIN_PATH.DEV, filePath);

    return fs.existsSync(fileFullPath);
};

const counstuctEntries = (entryNameList: TEntryNameList) => {
    return entryNameList.reduce((acc, nextName) => {
        const newAcc = { ...acc } as TEntryRecord;

        const pathRecord = setEntryPathes(nextName);

        const resultPath = Object.values(pathRecord).reduce((acc, filePath) => {
            if (checkFileExists(filePath)) {
                return filePath;
            }

            return acc;
        });

        const newName = nextName === "index" ? nextName : `index.${nextName}`;

        newAcc[newName] = resultPath;

        return newAcc;
    }, {} as TEntryRecord);
};

const constructTsName = (name: TEntryName) => {
    return name === "index" ? `${name}.${EXT.TS}` : `index.${name}.${EXT.TS}`;
};

const constructScssName = (name: TEntryName) => {
    return name === "index"
        ? `${name}.${EXT.SCSS}`
        : `index.${name}.${EXT.SCSS}`;
};

const setEntryPathes = (name: TEntryName): TPathRecord => {
    const tsFileName = constructTsName(name);
    const scssFileName = constructScssName(name);

    const tsFilePath = path.join(FOLDER.JS, tsFileName);
    const scssFilePath = path.join(FOLDER.SCSS, scssFileName);

    return {
        scss: scssFilePath,
        ts: tsFilePath,
    };
};

export const initEntries = () => {
    const devBuildGroup = process.env.ENTRY;

    let unicDevBuildGroupList: TEntryNameList = [];

    if (devBuildGroup) {
        const devBuildGroupList = [DEV_BUILDS[devBuildGroup as TDevBuild]];

        unicDevBuildGroupList = removeDevBuildsDuplicate(devBuildGroupList);
    } else {
        unicDevBuildGroupList = removeDevBuildsDuplicate(
            Object.values(DEV_BUILDS)
        );
    }

    return counstuctEntries(unicDevBuildGroupList);
};
