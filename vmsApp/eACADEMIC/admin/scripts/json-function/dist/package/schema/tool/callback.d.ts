export interface SchemaToolObject {
    __schema__: {
        job?: string;
        values?: string[];
        separator?: string;
        custom?: Function;
    };
}
declare const _default: {
    join: (...args: string[]) => SchemaToolObject;
    custom: (fn: Function, ...args: string[]) => SchemaToolObject;
};
export default _default;
