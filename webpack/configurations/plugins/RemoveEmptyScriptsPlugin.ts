import RemoveEmptyScriptsPlugin from "webpack-remove-empty-scripts";

export const initRemoveEmptyScriptsPlugin = () => {
    return new RemoveEmptyScriptsPlugin();
};
