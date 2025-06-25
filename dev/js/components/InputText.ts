import dom from "js/libs/DOM";
import { Context } from "js/libs/DOM/types";
import { Component } from "./utils/Component";


const INPUT_WRAP_SELECTOR = ".js-b-input";
const INPUT_FIELD_SELECTOR = ".js-b-input__field";

const FOCUSED_ATTR = "data-focused";

export const initInputText = (context?: Context) => {
    dom(INPUT_WRAP_SELECTOR, context).each((wrap: HTMLElement) => {
        new InputText(wrap);
    });
};

class InputText extends Component {
    private input: HTMLInputElement;
    private isFocused = false;

    constructor(wrap: HTMLElement) {
        super(wrap);

        this.input = this.query(INPUT_FIELD_SELECTOR);

        this.initComponent();
    }

    private initComponent = () => {
        this.input.addEventListener("focus", this.handleFocus);
        this.input.addEventListener("blur", this.handleBlur);
        this.input.addEventListener("input", this.handleInput);
    };

    private handleFocus = () => {
        this.isFocused = true;

        this.wrap.setAttribute(FOCUSED_ATTR, "");
    };

    private handleBlur = () => {
        this.isFocused = false;

        this.wrap.toggleAttribute(FOCUSED_ATTR, this.input.value.length > 0);
    };

    private handleInput = () => {
        this.wrap.toggleAttribute(
            FOCUSED_ATTR,
            this.input.value.length > 0 || this.isFocused
        );
    };
}
