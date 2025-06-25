export const getFromMapStorage = (map: Map<any, any>, key: any) => {
    return map.get(key);
};

export const setToMapStorage = (map: Map<any, any>, key: any, data: any) => {
    return map.set(key, data);
};

export const deleteFromMapStorage = (map: Map<any, any>, key: any) => {
    return map.delete(key);
};
