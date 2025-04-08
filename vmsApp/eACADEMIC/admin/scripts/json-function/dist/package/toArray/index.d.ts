declare type Config = {
    key: string;
};
declare type ToArrayFunction = (data: any, config?: Config) => any[];
declare const toArray: ToArrayFunction;
export default toArray;
