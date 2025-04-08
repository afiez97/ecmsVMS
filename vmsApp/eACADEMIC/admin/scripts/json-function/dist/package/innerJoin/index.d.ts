declare type InnerJoinFunction = (data: Object[], otherData: Object[], dataFieldName: string, otherDataFieldName: string) => Object[];
declare const innerJoin: InnerJoinFunction;
export default innerJoin;
