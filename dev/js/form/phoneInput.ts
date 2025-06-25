
import IMask from "imask";
import intlTelInput from "intl-tel-input";
import dom from "js/libs/DOM";
import { masks } from "js/utils/telMasks";

const PHONE_INPUT_SELECTOR = ".js-phone-input";
export const phoneInput = () => {
  dom(PHONE_INPUT_SELECTOR).each((input) => {
    initPhoneInput(input);
  });
};

const initPhoneInput = (input) => {
  const ini = intlTelInput(input, {
    //@ts-ignore
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
    autoPlaceholder: "on",
    autoInsertDialCode: true,
    nationalMode: false,
    initialCountry: "ru",
    onlyCountries: [...Object.keys(masks)],
  });


  const instance = IMask(input, {
    mask: "+7(000) 000-00-00",
    lazy: false,
  });

  input.addEventListener("countrychange", function () {
    //@ts-ignore
    instance.updateOptions({ mask: masks[ini["defaultCountry"]].m });
  });

};

const handleChange = (event) => {
  const input = event.target;

  if (!input.value) return true;

  input.value = input.value.replace(/[^\d\+\s]/g, "");
};
