declare module "*.scss" {
    const content: { [className: string]: string };
    export default content;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.svg";

declare module "*/exports.js" {
    export default Object;
}

declare module "*.js" {
    export default Object;
}
