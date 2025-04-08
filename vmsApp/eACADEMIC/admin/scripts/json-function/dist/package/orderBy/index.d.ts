declare type OrderByFunction = (data: Object[], fieldName: string, order?: string, options?: {
    deep?: boolean;
}) => Object[];
declare const orderBy: OrderByFunction;
export default orderBy;
