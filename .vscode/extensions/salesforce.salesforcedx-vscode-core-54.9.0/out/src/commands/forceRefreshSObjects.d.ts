import { SObjectCategory, SObjectRefreshSource } from '@salesforce/salesforcedx-sobjects-faux-generator/out/src/types';
import { SfdxCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
export declare type RefreshSelection = {
    category: SObjectCategory;
    source: SObjectRefreshSource;
};
export declare class SObjectRefreshGatherer implements ParametersGatherer<RefreshSelection> {
    private source?;
    constructor(source?: SObjectRefreshSource);
    gather(): Promise<ContinueResponse<RefreshSelection> | CancelResponse>;
}
export declare class ForceRefreshSObjectsExecutor extends SfdxCommandletExecutor<{}> {
    private static isActive;
    build(data: {}): Command;
    execute(response: ContinueResponse<RefreshSelection>): Promise<void>;
}
export declare function forceRefreshSObjects(source?: SObjectRefreshSource): Promise<void>;
export declare function verifyUsernameAndInitSObjectDefinitions(projectPath: string): Promise<void>;
export declare function initSObjectDefinitions(projectPath: string): Promise<void>;
export declare function checkSObjectsAndRefresh(projectPath: string): Promise<void>;
