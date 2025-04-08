declare type WhereItem = {
    [key: string]: any;
};
declare type WhereFunction = (data: WhereItem[], queries: Object | Object[] | Function, options?: {
    deep?: boolean;
}) => Object[];
declare const where: WhereFunction;
export default where;
