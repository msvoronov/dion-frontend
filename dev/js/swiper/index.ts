import "swiper/css/bundle";

import { Context } from "js/libs/DOM/types";
import { initpeopleSwiper } from "./peopleSwiper";
import { initWinnersSwiper } from "./winnersSwiper";


export const dynamicSwiper = (context?: Context) => {
    
};

export const staticSwiper = () => {

  initpeopleSwiper();
  initWinnersSwiper();
};
