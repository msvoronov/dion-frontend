import dom from "js/libs/DOM";
import { ajax } from "js/libs/DOM/fn";
import { addInputError } from "js/form/validate";
import { closeAllModals, openModalById } from "js/libs/modals";

export type TStatus = "success" | "error";

export type TResponse<D extends any = any> = {
    status: TStatus;
    data: D;
};

export class Ajax {
    private constructor() {}

    public static init(url: string, data?: FormData | string, form?: HTMLFormElement) {
        return {
            request: () => {
                return this.request(url, data, form);
            },
            requestHTML: () => {
                return this.requestHTML(url, data);
            },
        };
    }

    private static requestHTML = async (
        url: string,
        data?: FormData | string
    ): Promise<string | null> => {
        try {
            const { responseText } = await ajax({
                url,
                data,
            });

            if (typeof responseText !== "string") {
                throw "error";
            }

            return responseText;
        } catch {
            return "";
        }
    };

    private static request = async <D extends any = any>(
        url: string,
        data?: FormData | string,
        form?: HTMLFormElement
    ): Promise<TResponse<D | null>> => {
        let resData;
        try {
            //@ts-ignore
            const { responseText } = await ajax({
                url,
                data,
            }).catch(err => {
            console.log(err)
            if(err.status <= 200 || err.status > 299) {

              const errModal = document.querySelector(".js-form-error");
              const errModalMsg = document.querySelector(".js-form-error-msg");
              errModal.classList.add("active");
              errModalMsg.innerHTML = `
              [${err.status}]: ${err.statusText}
              `; 
            }
          })

          try {
            resData = JSON.parse(responseText);
          } catch (e) {
            resData = responseText;
          }

          if (typeof resData !== "string" && resData.status !== "success") {
            throw "error";
          }

          return resData;
        } catch (e) {

      try {
        const res = JSON.parse(e.response);

        resData = {
          status: "error",
          data: res.data,
        };
      } catch {
        resData = {
          status: "error",
          data: null,
        };
      }

      return resData;
    } finally {
      this.response(resData, form);
    }
    };

    private static response = (resData, form?) => {
        if (!resData.data) return;
        if (resData.data.clearForm) this.clearForm(form);

        if (resData.data.formMsg) {
            this.handleResponse(resData, form);
        }
        if (resData.status === "error" && resData.data.inputMsg && form) {
            this.addInputsErrors(form, resData.data.inputMsg);
        }

        if (resData.data.redirect) {
            this.handleRedirect(resData.data.redirect);
        }
    };

    private static handleResponse = (
        resData: TResponse,
        form: HTMLFormElement
    ) => {
        if (resData.data.openModal) {
            closeAllModals();

            let id =
                resData.data.openModal === "" || resData.data.openModal === true
                    ? "modal-response"
                    : resData.data.openModal;

            if (resData.data.openModal === false) return;

            let modal = dom(`.js-modal-response[data-target=${id}]`);
            modal.removeClass("success");
            modal.removeClass("error");
            modal.removeClass("closed");
            let msg = dom(".js-server-response", modal);
            msg.html(resData.data.formMsg);
            modal.addClass(resData.status);
            openModalById(id, resData.data.autoClose);
        } else {
            let responseBlock = dom(".js-server-response", form);
            responseBlock.html(resData.data.formMsg);
            responseBlock.removeClass("success", "error", "active");
            responseBlock.addClass(resData.status, "active");
        }
    };

    private static addInputsErrors = (form: HTMLFormElement, object = {}) => {
        Object.keys(object).forEach((inputName) => {
            let input = form.querySelector(
                `.js-c-input__field[name="${inputName}"]`
            ) as HTMLInputElement;

            if (!input) {
                return;
            }

            addInputError(input, object[inputName]);
        });
    };

    private static clearForm = (form: HTMLFormElement) => {
        dom(".js-c-input__field", form).each<HTMLInputElement>((input) => {
            input.classList.remove("has-value");
            input.value = "";

            if (input.type === "checkbox") {
                input.checked = false;
                return;
            }
        });

        dom(".js-c-input", form).each<HTMLInputElement>((input) => {
            input.removeAttribute("data-focused");
        });

        dom(".js-server-response", form).each<HTMLElement>((res) => {
            res.textContent = "";
            res.classList.remove("error", "success");
        });

        dom(".c-form__page--valid", form).each((page) => {
            page.classList.remove(".c-form__page--valid");
        });
    };

    private static handleRedirect = (url: string) => {
        window.location.href = url;
    };
}
