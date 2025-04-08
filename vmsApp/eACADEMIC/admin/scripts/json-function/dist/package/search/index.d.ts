declare type SearchFunction = (data: Object[], key: any, fields: String | String[], options?: {
    caseSensitive?: Boolean;
}) => Object[];
declare const search: SearchFunction;
export default search;
