import dom from "js/libs/DOM";
import { Context } from "js/libs/DOM/types";
import { Component } from "./utils/Component";


const WRAP_SELECTOR = ".js-b-select";
const INPUT_SELECTOR = ".js-b-select__input";
const FIELD_SELECTOR = ".js-b-select__field";
const OPTIONS_SELECTOR = ".js-b-select__options";

export const initSelector = (context?: Context) => {
    dom(WRAP_SELECTOR, context).each((wrap: HTMLElement) => {
        new Select(wrap);
    });
};

class Select extends Component {
    private input: HTMLInputElement;
    private select: HTMLInputElement;
    private optionList: HTMLInputElement;

    constructor(wrap: HTMLElement) {
        super(wrap);

        this.input = this.query(INPUT_SELECTOR);
        this.select = this.query(FIELD_SELECTOR);
        this.optionList = this.query(OPTIONS_SELECTOR);

        this.initComponent();
    }

    private initComponent = () => {
        this.select.addEventListener("click", this.handleClickSelect);
        Array.from(this.optionList.children).forEach((el) => el.addEventListener("click", this.handleClickOption));
    };

    private handleClickSelect = () => {
        this.select.classList.toggle('active');
    };

    private handleClickOption = (e) => {
        this.select.querySelector('span').innerText = e.target.innerText;
        this.input.value = e.target.innerText;
        this.select.classList.remove('active');        
    }
}
