import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
export declare class GetQueryAndApiInputs implements ParametersGatherer<QueryAndApiInputs> {
    gather(): Promise<CancelResponse | ContinueResponse<QueryAndApiInputs>>;
}
export interface QueryAndApiInputs {
    query: string;
    api: ApiType;
}
export declare enum ApiType {
    REST = 0,
    Tooling = 1
}
export declare function forceDataSoqlQuery(explorerDir?: any): Promise<void>;
