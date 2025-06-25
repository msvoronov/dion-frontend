import dom from "js/libs/DOM";
import { queryList } from "js/utils";
import { ERROR_MESSAGES } from "./consts";
import { hasClass } from "js/libs/DOM/fn";
import { HTMLAnyElement } from "js/libs/DOM/types";

export const validate = (context?: HTMLElement) => {
    dom(".js-form-validate", context).each((form) => {
        initValidate(form as HTMLFormElement);
    });
};

const initValidate = (form: HTMLFormElement) => {
    let domForm = dom(form);

    domForm.on("input change", (e) => {
        let input = e.target as HTMLInputElement;

        // событие change только для селекта (на нем не дилегируется input)
        if (e.type === "change" && input.tagName !== "SELECT") {
            return;
        }

        if (input.type === "checkbox") {
            input.checked ? (input.value = "1") : (input.value = "0");
        }

        validateInput(input as HTMLInputElement);
    });

    domForm.on("submit", (e) => {
        let hasError = false;

        domForm.find(".js-b-input__field").each((input) => {
            // плагин niceselect копирует классы селекта на div
            if (input.tagName === "DIV") {
                return;
            }
            if (!validateInput(input as HTMLInputElement)) {
                hasError = true;
            }
        });

        if (hasError) {
            e.preventDefault();
            maybeScrollFirstError(form);
            return false;
        }
    });
};

const maybeScrollFirstError = (form: HTMLFormElement | HTMLElement) => {
    if (!form.hasAttribute("data-scroll-first-error")) {
        return;
    }

    let el = form.querySelector(".has-error") as HTMLElement;

    if (!el) {
        return;
    }

    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 100);
};

/**
 * - Валидирует отдельный инпут
 * - Выводит сообщение об ошибке под ним
 * @return true - инпут валидный
 * @return false - ошибка
 */
export const validateInput = (input: HTMLInputElement, addErrors = true) => {
    addValueClass(input);

    if (input.hasAttribute("data-required") && !validateRequired(input)) {
        if (addErrors) {
            addInputError(input, "required");
        }
        if(addErrors && input.type === "file") {
            addInputError(input, "requiredFile");
        }
        return false;
    }

    if (input.hasAttribute("data-required-hidden") && !validateRequiredHidden(input)) {
        if (addErrors) {
            addInputError(input, "required");
        }
        return false;
    }
    if (input.hasAttribute("data-max-age") && !validateMaxAge(input)) {
        if (addErrors) {
            addInputError(input, "maxAge", [input.dataset.maxAge]);
        }
        return false;
    }
    if (input.hasAttribute("data-min-age") && !validateMinAge(input)) {
        if (addErrors) {
            addInputError(input, "maxAge", [input.dataset.minAge]);
        }
        return false;
    }

    if (input.hasAttribute("data-search") && !validateSearch(input)) {
        return false;
    }

    if (input.hasAttribute("data-email") && !validateEmail(input)) {
        if (addErrors) {
            addInputError(input, "email");
        }
        return false;
    }

    if (input.hasAttribute("data-blacklist") && !validateBlacklistEmail(input)) {
        if (addErrors) {
            addInputError(input, "emailBlacklist");
        }
        return false;
    }

    if (input.hasAttribute("data-url") && !validateUrl(input)) {
        if (addErrors) {
            addInputError(input, "url");
        }
        return false;
    }

    if (input.hasAttribute("data-telegram") && !validateTelegram(input)) {
        if (addErrors) {
            addInputError(input, "telegram");
        }
        return false;
    }

    if (input.hasAttribute("data-cyrLat-name") && !validateCyrLatName(input)) {
        if (addErrors) {
            addInputError(input, "cyrLatName");
        }
        return false;
    }

    if (input.hasAttribute("data-inn") && !validateINN(input)) {
        if (addErrors) {
            addInputError(input, "inn");
        }
        return false;
    }

    if (
        input.hasAttribute("data-max-length") &&
        !validateMaxLength(input, input.dataset.maxLength)
    ) {
        if (addErrors) {
            addInputError(input, "maxLength", [input.dataset.maxLength]);
        }
        return false;
    }
    if (
        input.hasAttribute("data-min-length") &&
        !validateMinLength(input, input.dataset.minLength)
    ) {
        if (addErrors) {
            addInputError(input, "minLength", [input.dataset.minLength]);
        }
        return false;
    }

    if (
        input.hasAttribute("data-numbers-only") &&
        !validateNumbersOnly(input)
    ) {
        if (addErrors) {
            addInputError(input, "numbersOnly");
        }
        return false;
    }

    if (
        input.hasAttribute("data-numbers-max-length") &&
        !validateNumbersMaxLength(input, input.dataset.numbersMaxLength)
    ) {
        if (addErrors) {
            addInputError(input, "onlyNumbers", [input.dataset.onlyNumbers]);
        }
        return false;
    }

    if (
        input.hasAttribute("data-max-value") &&
        !ValidateMaxVelue(input, input.dataset.maxValue)
    ) {
        if (addErrors) {
            addInputError(input, "maxValue", [input.dataset.maxValue]);
        }
        return false;
    }

    if (
        input.hasAttribute("data-min-value") &&
        !ValidateMinVelue(input, input.dataset.minValue)
    ) {
        if (addErrors) {
            addInputError(input, "minValue", [input.dataset.minValue]);
        }
        return false;
    }

    if (input.hasAttribute("data-select")) {
        if (addErrors) {
            addInputError(input, "innList");
        }
        return false;
    }

    if (input.hasAttribute("data-birthday") && !validateBirthday(input)) {
        if (addErrors) {
            addInputError(input, "invalidBirthday");
        }
        return false;
    }
    if (input.hasAttribute("data-pass-repeat") && !validatePassRep(input)) {
        if (addErrors) {
            addInputError(input, "passRepeat");
        }
        return false;
    }
    if (input.hasAttribute("data-no-special") && !validateNoSpecial(input)) {
        if (addErrors) {
            addInputError(input, "cyrLatName");
        }
        return false;
    }

    if (
        input.hasAttribute("data-pass-new") &&
        (!validatePass(input) || !validatePassRepinNew(input))
    ) {
        let form = input.closest("form");
        let repPass = form.querySelector(
            "[data-pass-repeat]"
        ) as HTMLInputElement;

        if (!addErrors) return false;

        if (!validatePass(input)) {
            addInputError(input, "password");
            return false;
        } else if (!validatePassRepinNew(input) && repPass) {
            removeInputError(input);
            addInputError(repPass, "passRepeat");
            return false;
        } else {
            removeInputError(input);
            return true;
        }

        return false;
    }

    if (
        input.hasAttribute("data-tel-length") &&
        !validateTelLength(input.value, +input.dataset.telLength)
    ) {
        if (addErrors) {
            addInputError(input, "phone");
        }
        return false;
    }
    if (
        input.hasAttribute("data-range-length") &&
        !validateRequiredLength(
            input.value,
            +input.dataset.rangeLengthFrom,
            +input.dataset.rangeLengthTo
        )
    ) {
        if (addErrors) {
            addInputError(input, "rangeLength");
        }
        return false;
    }

    removeInputError(input);
    return true;
};

/**
 * - Валидирует форму
 */
export const validateForm = (
    form: HTMLFormElement | HTMLElement,
    noValidClass = "no-valid",
    validClass = "is-valid",
    addErrors = true
) => {
    let isFormValid = true;
    // dom(form)
    //     .find(".js-c-input__checkbox-field")
    //     .each((checkboxField) => {
    //         let isInputValid = validateCheckboxField(checkboxField, addErrors);
    //         if (!isInputValid) isFormValid = false;
    //     });

        dom(form)
        .find(".js-b-input__field")
        .each((input) => {
            if (input.tagName === "DIV") {
                return;
            }

            let isInputValid = validateInput(
                input as HTMLInputElement,
                addErrors
            );
            if (!isInputValid) isFormValid = false;
        });

    if (!isFormValid) {
        maybeScrollFirstError(form);

        //Вешаем класс валидности на форму
        dom(form).removeClass(validClass);
        dom(form).addClass(noValidClass);
    } else {
        dom(form).removeClass(noValidClass);
        dom(form).addClass(validClass);
    }

    return isFormValid;
};

/**
 * - добавляет ошибку на input
 * @param input
 * @param msg ключ сообщения с объекта строк либо сообщение
 * @param replace массив строк для замены в сообщении
 */
export const addInputError = (
    input: HTMLInputElement,
    msg: string,
    replace?: Array<string | number>
) => {
    if (input.type === 'radio') {
        dom(input)
            .parent()
            .parent()
            .parent()
            .addClass("has-error")
            .find(".alert-input-text")
            .html(getInputMessage(msg, replace));
    }

    if (input.classList.contains("js-phone-input")) {
        dom(input)
            .parent()
            .parent()
            .addClass("has-error")
            .find(".alert-input-text")
            .html(getInputMessage(msg, replace));
        return;
    }
    if (input.classList.contains("js-c-select-input__input")) {
        dom(input)
            .parent()
            .parent()
            .parent()
            .addClass("has-error")
            .find(".alert-input-text")
            .html(getInputMessage(msg, replace));
        return;
    }

    // if (input.type === "checkbox") {
    //     msg = "acceptTerms";
    //     dom(input)
    //         .parent()
    //         .addClass("has-error")
    //         .parent()
    //         .find(".alert-input-text", true)
    //         .html(getInputMessage(msg, replace));
    //     return;
    // }

    dom(input)
        .addClass("has-error")
        .parent()
        .addClass("has-error")
        .find(".alert-input-text", true)
        .html(getInputMessage(msg, replace));
};

const getInputMessage = (msg: string, replace?: Array<string | number>) => {
    //@ts-ignore
    let data = ERROR_MESSAGES;

    let res = data && data[msg] ? data[msg] : msg;
    if (replace) {
        for (let i = 0; i < replace.length; i++) {
            res = res.replaceAll(`\$${i + 1}`, replace[i]);
        }
    }
    return res;
};

const validateCheckboxField = (
    checkboxField: HTMLElement,
    addErrors = true
) => {
    if (
        checkboxField.hasAttribute("data-required") &&
        !validateRequiredCheckboxField(checkboxField)
    ) {
        if (addErrors) {
            addCheckboxWrapError(checkboxField, "required");
        }
        return false;
    }
    removeCheckboxWrapError(checkboxField);
    return true;
};

const validateRequiredCheckboxField = (wrap: HTMLElement) => {
    let test = queryList(".js-b-input__field", wrap).some(
        (input: HTMLInputElement) => {
            return input.checked;
        }
    );
    return test;
};

const removeCheckboxWrapError = (wrap: HTMLElement) => {
    dom(wrap)
        .removeClass("has-error")
        .parent()
        .removeClass("has-error")
        .find(".alert-input-text", true)
        .html("");
};

const addCheckboxWrapError = (wrap: HTMLElement, msg: string) => {
    dom(wrap)
        .addClass("has-error")
        .parent()
        .addClass("has-error")
        .find(".alert-input-text", true)
        .html(getInputMessage("required"));
};

const addValueClass = (input: HTMLInputElement) => {
    if (input.type === "checkbox") return;

    if (input.type !== "checkbox" && input.value !== "") {
        dom(input).parent().addClass("has-value");
        dom(input).addClass("has-value");
        return;
    } else {
        dom(input).parent().removeClass("has-value");
        dom(input).removeClass("has-value");
    }
};

/**
 * - Убирает ошибку с инпута
 */
export const removeInputError = (input: HTMLInputElement) => {

    if (input.type === 'radio') {
        dom(input)
            .parent()
            .parent()
            .parent()
            .addClass("has-error")
            .find(".alert-input-text", true)
            .html(getInputMessage(""));
    }

    if (input.classList.contains("js-phone-input")) {
        dom(input)
            .parent()
            .parent()
            .removeClass("has-error")
            .find(".alert-input-text", true)
            .html("");
        return;
    }

    if (input.classList.contains("js-c-select-input__input")) {
        dom(input)
            .parent()
            .parent()
            .parent()
            .removeClass("has-error")
            .find(".alert-input-text", true)
            .html();
        return;
    }

    // if (input.type === "checkbox") {
    //     dom(input)
    //         .parent()
    //         .removeClass("has-error")
    //         .parent()
    //         .find(".alert-input-text", true)
    //         .html("");
    //     return;
    // }

    dom(input)
        .removeClass("has-error")
        .parent()
        .removeClass("has-error")
        .find(".alert-input-text", true)
        .html("");
};

const validateRequired = (input: HTMLInputElement) => {
    const { value } = input;

    if(input.type === "tel") {
        return !value.includes("_");
    }

    if(input.type === "radio") {
        const allRadio = queryList<HTMLInputElement>(`[name="${input.name}"]`, input.closest('form'));

        return allRadio.some((input) => {
            return input.checked;
        })

    }

    if (input.type === "checkbox") {
        console.log(input)
        return !!input.checked;
    }

    return value.trim().length > 0;
};

const validateRequiredHidden = (input: HTMLInputElement) => {
    const { value } = input;

    const inputWrap = input.closest(".b-career-form__row") as HTMLAnyElement;

    if(!hasClass(inputWrap, 'active')) {
        return true
    }

    if (input.type === "checkbox" || input.type === "radio") {
        return !!input.checked;
    }

    return value.trim().length > 0;
};

const validateMaxAge = (input: HTMLInputElement) => {
    const { value } = input;

    const maxAge = Number(input.getAttribute("data-max-age"));

    const birthDate = new Date(value);

    if (isNaN(birthDate.getTime())) {
      return false;
    }

    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 < maxAge;
    }

    return age < maxAge;
    
}

const validateMinAge = (input: HTMLInputElement) => {
    const { value } = input;
    
    const minAge = Number(input.getAttribute("data-min-age"));

    const birthDate = new Date(value);
    
    if (isNaN(birthDate.getTime())) {
      return false;
    }

    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age >= minAge;

    }

    return age > minAge;

}

const validateSearch = (input: HTMLInputElement) => {
    const { value } = input;

    return value.trim().length > 0;
};

const validateCyrLatName = (input: HTMLInputElement) => {
    if (!input.value) {
        return true;
    }
    let re = /^(?![-,]*$)[а-яА-ЯёЁa-zA-Z\s,-]+$/gi;

    let reSpace = /^\s+$/;

    return re.test(String(input.value));
};

const ValidateMaxVelue = (input: HTMLInputElement, max: string) => {
    if (!input.value) {
        return true;
    }

    input.value = input.value.replace(/[^\d,.]/g, "");

    let length = max.replace(",", ".").split(".").length;
    let regex1 = /[.,]/;
    let regex2 = /..[.,]/;
    let regex3 = /[.,][.,]/;
    regex1.test(input.value) && length++;
    input.value = regex3.test(input.value)
        ? input.value.slice(0, length)
        : input.value;
    regex2.test(input.value) && length++;

    if (input.value.length > length)
        input.value = input.value.slice(0, length + 1);

    let maxValue = parseFloat(max.replace(",", "."));
    let value = parseFloat(input.value.replace(",", "."));

    return value <= maxValue;
};

const ValidateMinVelue = (input: HTMLInputElement, min: string) => {
    if (!input.value) {
        return true;
    }

    input.value = input.value.replace(/[^\d,.]/g, "");

    let minValue = parseFloat(min.replace(",", "."));
    let value = parseFloat(input.value.replace(",", "."));

    return value >= minValue;
};

const validateMaxLength = (input, max) => {
    max = parseInt(max);
    return input.value.length <= max;
};
const validateMinLength = (input, min) => {
    min = parseInt(min);
    return input.value.length >= min;
};

const validateEmail = (input) => {
    // если поле не заполнено - значит оно не обязательно
    if (!input.value) return true;

    let newRegEx = /^(?!^.{321,}$)(?!^.{64,}@)[a-zA-Z0-9\._-]{1,64}([a-zA-Z0-9_-]+)*@(?!.*\.[\w-]{256})[\w-]+(\.[\w-]+)*(\.\w{1,255})+$/
    
    return newRegEx.test(String(input.value).toLowerCase());
};
const validateUrl = (input) => {
    // если поле не заполнено - значит оно не обязательно
    if (!input.value) return true;

    let newRegEx = /^(https?:\/\/www\.|http:\/\/|https:\/\/)[а-яА-Яa-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/
    
    return newRegEx.test(String(input.value).toLowerCase());
};
const validateTelegram = (input) => {
    if (!input.value) return true;

    let newRegEx = /^@?[A-Za-z0-9_]{5,}$/
    
    return newRegEx.test(String(input.value).toLowerCase());
};

const validateNumbersMaxLength = (input, max) => {
    if (!input.value) return true;

    input.value = input.value.replace(/[^\d]/g, "");

    if (input.value.length > max) input.value = input.value.slice(0, max);

    return input.value.length <= max;
};

export const validateFileFormat = (file: File, accept: string) => {
    if (!accept) return true;
    let isFormat = false;

    for (let format of accept.split(", ")) {
        if (file.name.match(format)) {
            isFormat = true;
        }
    }

    return isFormat;
};

export const validateFileSize = (file: File, size = 10) => {
    const isMax = file.size > size * 1024 * 1024;
    return isMax === false;
};

export const validateTelLength = (tel: string, requiredLength: number) => {
    tel = tel.replace(/[^\d]/g, "");
    return tel.length === requiredLength && tel !== "70000000000";
};
export const validateNoSpecial = (input: HTMLInputElement) => {
    let newRegEx = /^(?![!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?`~]+$)(?!\d+$)\S+$/
    
    return newRegEx.test(String(input.value).toLowerCase());
};

export const validateINN = (input: HTMLInputElement) => {
    const value = input.value;
    return value.length === 12;
}

export const validateRequiredLength = (
    value: string,
    from: number,
    to: number
) => {
    let valueLength = value.replace(/[^\d]/g, "");

    return from <= valueLength.length && valueLength.length <= to;
};

export const validatePass = (input: HTMLInputElement) => {
    if (!input.value) {
        return true;
    }
    return input.value.match(
        /^(?=.*[0-9])(?=.*[A-ZА-ЯЁ])(?=.*[a-zа-яё])(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|\\}~]).{12,}$/
    );
};

export const validateNumbersOnly = (input: HTMLInputElement) => {
    if (!input.value) return true;

    let newRegEx = /^\d+$/
    
    return newRegEx.test(String(input.value).toLowerCase());

}

const validateBlacklistEmail = (input) => {
    const blacklist = input.getAttribute("data-blacklist").replace(/\s/g, '').split(",");

    return !blacklist.some(excludedDomain => {
        return input.value.includes(excludedDomain)
    });
}

export const validateBirthday = (input: HTMLInputElement) => {
    let parsedValue = parseDate(input.value);
    let dateValue = new Date(parsedValue);

    if (!dateValue) {
        return false;
    }

    let today = new Date();
    let to = new Date(today.setFullYear(today.getFullYear() - 18));
    let from = new Date(today.setFullYear(today.getFullYear() - 100));

    return dateValue > from && dateValue < to;
};

const parseDate = (dateString: string) => {
    let strArr = dateString.split(".");
    if (strArr.length < 3) {
        return null;
    }

    let dd = strArr[0];
    let mm = strArr[1];
    let yyyy = strArr[2];

    return yyyy + "-" + mm + "-" + dd;
};

//Валидация повторения пароля
export const validatePassRep = (input: HTMLInputElement) => {
    let form = input.closest("form");

    if (!form) return true;

    let newPass = form.querySelector("[data-password]") as HTMLInputElement;

    if (!newPass) return true;

    if (input.value === newPass.value) {
        return true;
    }

    return false;
};

//Валидация повторения пароля, при вводе пароля в поле Новый пароль
export const validatePassRepinNew = (input: HTMLInputElement) => {
    let form = input.closest("form");

    if (!form) return true;

    let repPass = form.querySelector(
        ".js-b-input__field[data-pass-repeat]"
    ) as HTMLInputElement;

    if (!repPass) return true;

    if (!repPass.value) {
        return true;
    }

    if (input.value === repPass.value) {
        return true;
    }

    return false;
};
