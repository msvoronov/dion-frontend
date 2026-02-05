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
    const policy = data.get("privacy-policy");

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
        ${surname ? `Фамилия: ${surname}` : ''}
        ${name ? `Имя: ${name}` : ''}
        ${tel ? `Телефон: ${tel}` : ''}
        ${email ? `Почта: ${email}` : ''}
        ${company ? `Компания: ${company}` : ''}
        ${position ? `Должность: ${position}` : ''}
        ${count ? `Потенциальное количество пользователей: ${count}` : ''}
        Согласие на обработку персональных данных: ${policy ? "Да" : "Нет"};
        Согласие на получение рекламы: ${advertising ? "Да" : "Нет"};

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

      // Отправка запроса на sendsay
      const needSendDataToSendsay = !!this.form.dataset.sendsay;
      if (needSendDataToSendsay) {
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
      }
      // ----------------------------

      // Отправка запроса на Комету
      const needSendDataToKometa = !!this.form.dataset.kometa;
      if (needSendDataToKometa) {
        const getPreparedUrl = (siteUrl, formDataID) => {
          const prepared = new URL(siteUrl);
          prepared.search = "";
          prepared.hash = formDataID;
          return prepared.toString();
        };

        const buildPayloadKometa = (formDataID, formSource, formData) => {
          const siteUrl = new URL(window.location.href);
          const preparedUrl = getPreparedUrl(siteUrl, formDataID);

          return {
            formId: "816",
            branch: "web",
            fields: [
              {
                id: "b65d049b-2473-4201-b123-2bddf66beeb9",
                title: "Фамилия",
                values: [
                  formData.get("surname")
                ]
              },
              {
                id: "5152ace9-1cc0-455e-a117-e2295d9a532c",
                title: "Имя",
                values: [
                  formData.get("name")
                ]
              },
              {
                id: "9ab072c7-2e09-46de-a0d1-03be34970b4c",
                title: "Компания",
                values: [
                  formData.get("company")
                ]
              },
              {
                id: "6927d0a4-293a-40c6-b868-9c947fe872e1",
                title: "Должность",
                values: [
                  formData.get("position")
                ]
              },
              {
                id: "7ad1873a-1594-4292-aa1f-e5d72c112e50",
                title: "Телефон",
                values: [
                  '+' + formData.get("tel").replace(/\D/g, '')
                ]
              },
              {
                id: "bd9e191a-c2c1-408b-8431-8c48908cdc9c",
                title: "Email",
                values: [
                  formData.get("email")
                ]
              },
              {
                id: "6d9c6fb2-da75-4aec-b671-360b02576fda",
                title: "Комментарий",
                values: [
                  `Потенциальное количество пользователей: ${formData.get("count")}`
                ]
              },
              {
                id: "f8d120b2-d495-4f6f-8213-db2d7db3f298",
                title: "Чекбокс согласия об обработке перс данных Массив согласий",
                values: [
                  'true'
                ]
              },
              {
                id: "2261c96c-f725-4a2f-83bf-097393c17a21",
                title: "Чекбокс Согласие на рекламу",
                values: [
                  String(Boolean(formData.get("addv")))
                ]
              }
            ],
            additionalData: {
              utmData: {
                utm_source: utmSource,
                utm_content: utmContent,
                utm_medium: utmMedium,
                utm_term: utmTerm,
                utm_campaign: utmCampaign,
              },
              referrer: preparedUrl, // Cтраница с которой пришли на текущую страницу
              form_path: preparedUrl, // Полный путь до страницы с формой
              crm: {
                product_code: formSource, // Код продукта интереса CRM
                agreements: [
                  {
                    agreement_duration: 365,
                    agreement_type: "agreement",
                    handlers: [
                      "9703073496",
                      "7720479358",
                    ],
                    operator: "9703073496",
                    interface_element: "checkbox"
                  }
                ]
              }
            }
          };
        }

        const formDataID = 'form';
        const payloadKometa = buildPayloadKometa(formDataID, formSource, data);
        fetch("https://kometa-light-forms-published.inno.tech/api/v1/form-external/form-requests/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payloadKometa)
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Ответ Kometa:", data);
          })
          .catch((err) => {
            console.error("Ошибка при отправке в Kometa:", err);
          });
      }
      // --------------------

      this.clearForm();
    } catch (err) {
      throw new Error(err);
    }
  };
}
