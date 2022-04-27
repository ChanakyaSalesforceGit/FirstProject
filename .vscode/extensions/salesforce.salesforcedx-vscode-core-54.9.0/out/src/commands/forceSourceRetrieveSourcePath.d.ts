import { PostconditionChecker } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { CancelResponse, ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { ComponentSet } from '@salesforce/source-deploy-retrieve';
import * as vscode from 'vscode';
import { RetrieveExecutor } from './baseDeployRetrieve';
export declare class LibraryRetrieveSourcePathExecutor extends RetrieveExecutor<string[]> {
    constructor();
    getComponents(response: ContinueResponse<string[]>): Promise<ComponentSet>;
}
export declare class SourcePathChecker implements PostconditionChecker<string[]> {
    check(inputs: ContinueResponse<string[]> | CancelResponse): Promise<ContinueResponse<string[]> | CancelResponse>;
}
export declare const forceSourceRetrieveSourcePaths: (sourceUri: vscode.Uri | undefined, uris: vscode.Uri[] | undefined) => Promise<void>;
export declare const getUriFromActiveEditor: () => vscode.Uri | undefined;
