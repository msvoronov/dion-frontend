import { Context } from "js/libs/DOM/types";

import { initInputText } from "./InputText";
import { initSelector } from "./Select";
import { initForm } from "./Form";

import { initModalContent } from "./modalContent";
import { initVote } from "./Vote";
import { intiScrollBullets } from "./ScrollBullets";


export const dynamicComponents = (context?: Context) => {
    initInputText(context);
    initSelector(context);
    initForm(context);
};

export const staticComponents = () => {
    intiScrollBullets();
    initModalContent();
    initVote();
};
