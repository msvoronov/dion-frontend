import dom from "js/libs/DOM";

const BUTTON_SELECTOR = ".js-button";
export const button = () => {
  dom(BUTTON_SELECTOR).each((button) => {
    initButton(button);
  });
};

const initButton = (button) => {
  button.addEventListener("click", function () {
    const targetNames = button.dataset.ymTargetName.split(' ');
    if (window.ym) {
      targetNames.forEach(targetName => window.ym(93479706, 'reachGoal', targetName));
    }
  });
};
