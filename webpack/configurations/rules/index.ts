import { RuleSetRule } from "webpack";

import { getJsRule } from "./jsRule";
import { getTsRule } from "./tsRule";
import { getCssRule } from "./cssRule";
import { getScssRule } from "./scssRule";
import { getSvgRule } from "./svgRule";

import { TSettings } from "../../types";

export const initRules = (settings: TSettings): Array<RuleSetRule> => {
    return [
        getJsRule(),
        getTsRule(),
        getCssRule(settings),
        getScssRule(settings),
        getSvgRule(),
    ];
};
