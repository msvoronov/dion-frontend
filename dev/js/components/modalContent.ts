import dom from "js/libs/DOM"
import { Component } from "./utils/Component";

const MODAL_CONTENT_SELECTOR = ".js-modal-content";
const OPEN_MODAL_SELECTOR = ".js-open-modal";

const PROJECT_NAME_SELECTOR = ".js-project-name";

const PERSON_IMAGE_SELECTOR = ".js-person-img";
const PERSON_NAME_SELECTOR = ".js-person-name";
const PERSON_POSITION_SELECTOR = ".js-person-position";
const PERSON_VOTE_TRIGGER_SELECTOR = ".js-vote-trigger";

const TEXT_CONTENT_SELECTOR = ".js-text-content";


const TITLE_MODAL_SELECTOR = ".js-modal-content-title";
const IMAGE_MODAL_SELECTOR = ".js-modal-content-image";
const NAME_MODAL_SELECTOR = ".js-modal-content-name";
const POSITION_MODAL_SELECTOR = ".js-modal-content-position";
const AIM_MODAL_SELECTOR = ".js-modal-content-aim-text";
const RESULT_MODAL_SELECTOR = ".js-modal-content-result-text";

const VOTE_MODAL_SELECTOR = ".js-vote-btn";

export const initModalContent = () => {
  dom(MODAL_CONTENT_SELECTOR).each((wrap) => {
    new ModalContent(wrap);
  })
}

class ModalContent extends Component {

  private modal: HTMLElement;

  private projectNameSelector: HTMLElement;

  private personImageWrap: HTMLElement;
  private personName: HTMLElement;
  private personPosition: HTMLElement;
  private personVoteTrigger: HTMLElement;

  private textContent: HTMLElement;

  private openModalBtn: HTMLElement;

  private voteBtn: HTMLElement;

  constructor(wrap: HTMLElement) {
    super(wrap);
    this.wrap = wrap;

    this.modal = document.getElementById("modal-info");

    this.openModalBtn = this.query(OPEN_MODAL_SELECTOR, this.wrap);

    this.projectNameSelector = this.query(PROJECT_NAME_SELECTOR, this.wrap);

    this.personImageWrap = this.query(PERSON_IMAGE_SELECTOR, this.wrap);
    this.personName = this.query(PERSON_NAME_SELECTOR, this.wrap);
    this.personPosition = this.query(PERSON_POSITION_SELECTOR, this.wrap);
    this.personVoteTrigger = this.query(PERSON_VOTE_TRIGGER_SELECTOR, this.wrap);
    
    this.textContent = this.query(TEXT_CONTENT_SELECTOR, this.wrap);

    this.voteBtn = this.query(VOTE_MODAL_SELECTOR, this.modal);

    this.initComponent();
  }

  private initComponent = () => {
    this.initOpenModal();
  }

  private initOpenModal = () => {
    if(this.openModalBtn) {
      this.openModalBtn.addEventListener('click', this.handleOpenModal);
    }
  }

  private handleOpenModal = () => {

    const projectNameSelector = this.projectNameSelector.innerText;

    const name = this.personName.innerText;
    const personPosition = this.personPosition.innerText;
    const img = this.personImageWrap.querySelector('img').src;


    const [aimText, resultText] = this.getText();



    this.query(TITLE_MODAL_SELECTOR, this.modal).innerHTML = projectNameSelector;
    this.query(NAME_MODAL_SELECTOR, this.modal).innerHTML = name;
    this.query(POSITION_MODAL_SELECTOR, this.modal).innerHTML = personPosition;
    this.query(AIM_MODAL_SELECTOR, this.modal).innerHTML = aimText;
    this.query(RESULT_MODAL_SELECTOR, this.modal).innerHTML = resultText;


    this.query(IMAGE_MODAL_SELECTOR, this.modal).querySelector('img').src = img;

    this.query(".btn-big", this.modal)?.remove();

    

    const voteBtn = document.createElement('DIV');
    this.setClass(voteBtn, "btn-big");
    this.setClass(voteBtn, "btn");

    voteBtn.innerText = 'Отдать голос';

    if(this.hasClass(this.personVoteTrigger, 'checked')) {
      this.setClass(voteBtn, 'checked');
      voteBtn.innerText = 'Ваш голос учтен';
    }

    if(this.hasClass(this.personVoteTrigger, 'disabled')) {
      this.setClass(voteBtn, 'disabled');
    }



    this.query(".modal-info__bot", this.modal).appendChild(voteBtn)


    if(this.hasClass(this.personVoteTrigger, 'checked') || this.hasClass(this.personVoteTrigger, 'disabled')) return;

    voteBtn.addEventListener("click", () => {
      this.personVoteTrigger.dispatchEvent(new Event("click"));
      voteBtn.innerText = 'Ваш голос учтен';
      this.setClass(voteBtn, 'checked');
    }, {once: true});

  }

  private getText = () => {

    const textWithoutStrong = this.textContent.innerHTML.replace(/<strong>.*?<\/strong>/g, '');

    // Разделяем текст на части по подзаголовкам
    const parts = textWithoutStrong.split(/Цель проекта:|Результат проекта:/).map(part => part.trim()).filter(part => part)[0].split('<br><br>');

    
    // Убираем лишние пробелы и назначаем переменные
    const aimText = parts[0] || '';
    const resultText = parts[1] || '';

    return [aimText, resultText ];
  }
}