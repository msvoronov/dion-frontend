import dom from "js/libs/DOM";
import { Component } from "./utils/Component";
import { validateForm } from "js/form/validate";
import { Ajax } from "./utils/Ajax";

const FORM_WRAP_SELECTOR = ".js-b-form";
const FORM_SELECTOR = ".js-b-form__form";

const BTN_SUBMIT = ".js-b-form-submit";

export const initForm = (context) => {
  dom(FORM_WRAP_SELECTOR, context).each((wrap) => {
    new Form(wrap);
  });
};

class Form extends Component {
  form;
  btnSubmit;

  constructor(wrap) {
    super(wrap);

    this.wrap = wrap;

    this.form = this.query(FORM_SELECTOR, this.wrap);

    this.btnSubmit = this.query(BTN_SUBMIT, wrap);

    this.initComponent();
  }

  initComponent = () => {
    this.initSubmit();
  };

  initSubmit = () => {
    this.btnSubmit.addEventListener("click", this.handleSubmit);
    this.form.addEventListener("submit", this.handleSubmit);
  };

  getUtms = () => {
    let siteUrl = new URL(window.location.href);
    return [
      siteUrl.searchParams.get("utm_source") || null,
      siteUrl.searchParams.get("utm_medium") || null,
      siteUrl.searchParams.get("utm_campaign") || null,
      siteUrl.searchParams.get("utm_content") || null,
      siteUrl.searchParams.get("utm_term") || null,
    ];
  };

  clearForm = () => {
    let inputs = this.queryList<HTMLInputElement>("input", this.form);
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        input.checked = false;
        return;
      }
      input.value = "";
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(this.form)) {
      const errorInput = this.query(".has-error", this.form);
      errorInput?.scrollIntoView();
      return;
    }
    const url = this.form.getAttribute("action");

    const data = new FormData(this.form);

    const siteUrl = this.hasClass(this.form, 'js-support-form') ? location.pathname + '-support' : location.pathname;

    const [utmSource, utmMedium, utmCampaign, utmContent, utmTerm] = this.getUtms();

    const surname = data.get("surname");
    const name = data.get("name");
    const count = data.get("count");
    const company = data.get("company");
    const position = data.get("position");
    const email = data.get("email");
    const tel = data.get("tel");
    const advertising = data.get("addv");

    const formID = this.form.dataset.id;
    const formSource = 'dion_enterprise';

    const dataToSend = {
      url: siteUrl,
      formID,
      formSource,
      surname,
      name,
      count,
      company,
      position,
      email,
      phone: tel,
      advertising,
      comment: `
            ${data.get('comment') ? `Вопрос: ${data.get('comment')}` : ""}
            ${data.get('company') ? `Компания: ${data.get('company')}` : ""}
            ${data.get("count") ? `Потенциальное количество пользователей: ${data.get("count")}` : ""}
            Согласие на обработку персональных данных: ${
              data.get("privacy-policy") ? "Да" : "Нет"
            }
            Согласие на получение рекламы: ${
              advertising ? "Да" : "Нет"
            }

            ${utmSource ? `utmSource: ${utmSource}` : ""}
            ${utmMedium ? `utmMedium: ${utmMedium}` : ""}
            ${utmCampaign ? `utmCampaign: ${utmCampaign}` : ""}
            ${utmContent ? `utmContent: ${utmContent}` : ""}
            ${utmTerm ? `utmTerm: ${utmTerm}` : ""}
          `,
    };

    const ajaxForm = Ajax.init(url, JSON.stringify(dataToSend));
    try {
      const res = await ajaxForm.request();

      const targetNames = this.form.dataset.ymTargetName.split(' ');
      if (window.ym) {
        targetNames.forEach(targetName => window.ym(93479706, 'reachGoal', targetName));
      }
      const tmrTargetNames = this.form.dataset.tmrTargetName.split(' ');
      if (window._tmr) {
        tmrTargetNames.forEach(targetName => window._tmr.push({ type: 'reachGoal', id: 3655439, goal: targetName}));
      }

      const needSendDataToSendsay = !!this.form.dataset.sendsay;
      if (needSendDataToSendsay) {
        // Отправка запроса на sendsay
        const name = this.form.elements['name'].value;
        const email = this.form.elements['email'].value;
        const persData = String(this.form.elements['privacy-policy'].checked);
        const advertising = String(this.form.elements['addv'].checked);
        
        const payload = {
          action: "member.set",
          apikey: "192D7bhrwJ7S9WFBcIpxg9awL9ulH8kj8104InHfjU8fajdypw7DTu9yWVKqs55KK1Box0uIpiWxpQE9PFRtcDxfOxGozjw",
          email,
          datakey: [
            ["-group.pl86492", "set", "1"],
            ["id scenario", "set", "139"],
            ["custom.q388", "set", name],
            ["custom.privacy", "set", persData],
            ["custom.subscribe", "set", advertising],
          ],
          "newbie.confirm": 0,
          "newbie.letter.confirm": 2585,
        };

        fetch("https://api.sendsay.ru/general/api/v100/json/x_1676015140895099/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Ответ Sendsay:", data);
          })
          .catch((err) => {
            console.error("Ошибка при отправке в Sendsay:", err);
          });
        // ----------------------------
      }

      this.clearForm();
    } catch (err) {
      throw new Error(err);
    }
  };
}
