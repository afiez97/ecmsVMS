declare type Option = {
    orderBy: [string, string, Object?];
    where: [object | object[], Object?];
    limit: number[];
    select: string | string[];
    search: [string, string | string[], Object?];
    schema: Object;
    innerJoin: [Object[], string, string];
};
declare type Config = {
    resetRecord?: boolean;
    query?: Option;
    [key: string]: any;
};
declare class JsonFunction {
    data: Object[];
    process: string[];
    option: Option;
    config: Config;
    reset(): this;
    processManager(): void;
    orderBy(fieldName: string, order?: string, orderBy?: any): this;
    where(queries: Object | Object[], option?: any): this;
    limit(limit?: number, start?: number): this;
    schema(schema: Object): this;
    transform(): this;
    select(fields: string | string[]): this;
    search(key: any, fields: string | string[], option?: any): this;
    innerJoin(otherData: Object[], dataFieldName: string, otherFiledName: string): this;
    get(data: Object[], config?: Config): Object[];
    getQuery(): {
        orderBy: [string, string, Object?];
        where: [object | object[], Object?];
        limit: number[];
        select: string | string[];
        search: [string, string | string[], Object?];
        schema: Object;
        innerJoin: [Object[], string, string];
    };
    setQuery(query: Option): this;
}
declare const _default: JsonFunction;
export default _default;
