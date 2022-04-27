import { LibraryCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { CancelResponse, ContinueResponse, FunctionInfo, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
export declare class ForceFunctionCreateExecutor extends LibraryCommandletExecutor<any> {
    constructor();
    run(response: ContinueResponse<FunctionInfo>): Promise<boolean>;
}
export declare class FunctionInfoGatherer implements ParametersGatherer<FunctionInfo> {
    gather(): Promise<CancelResponse | ContinueResponse<FunctionInfo>>;
}
export declare function forceFunctionCreate(): Promise<void>;
