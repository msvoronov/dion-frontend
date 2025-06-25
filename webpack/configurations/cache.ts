import { FileCacheOptions, MemoryCacheOptions } from "webpack";

import { TSettings } from "../types";

const FILE_CACHE_OPTIONS: FileCacheOptions = {
    allowCollectingMemory: true,
    type: "filesystem",
};

const MEMORY_CACHE_OPTIONS: MemoryCacheOptions = {
    type: "memory",
};

export const initCache = (settings: TSettings) => {
    const { isDev } = settings;

    return isDev ? FILE_CACHE_OPTIONS : MEMORY_CACHE_OPTIONS;
};
