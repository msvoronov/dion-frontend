import pages from "./states/pages.json";
import blockAccommodation from "./states/block-accommodation.json";
import blockPossibilities from "./states/block-possibilities.json";
import blockAdvantages from "./states/block-advantages.json";
import blockWhyDion from "./states/block-why-dion.json";
import blockСlients from "./states/block-clients.json";
import blockAwards from "./states/block-awards.json";
import blockСomplex from "./states/block-complex.json";
import blockGrid from "./states/block-grid.json";
import enterpriseHeader from "./states/enterprise-header.json";
import blockVideo from "./states/block-video.json";
import enterpriseBullets from "./states/enterprise-bullets.json";


export const initStore = () => {
    return {
        pages,
        blockAccommodation,
        blockPossibilities,
        blockAdvantages,
        blockWhyDion,
        blockСlients,
        blockAwards,
        blockСomplex,
        blockGrid,
        enterpriseHeader,
        blockVideo,
        enterpriseBullets
    };
};
