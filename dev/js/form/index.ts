
import { phoneInput } from "./phoneInput";
import { button } from "./button";
import { validate } from "./validate";

let IS_INITED = false;

export const initForms = (context) => {
    if (!IS_INITED) {
        IS_INITED = true;
        initStatic();
    }
    initDynamic(context);
};

const initStatic = () => {
    phoneInput();
    button();
};

const initDynamic = (context) => {
    validate(context);
};
