import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { ComponentSet } from '@salesforce/source-deploy-retrieve';
import * as vscode from 'vscode';
import { DeployExecutor } from './baseDeployRetrieve';
export declare class LibraryDeploySourcePathExecutor extends DeployExecutor<string[]> {
    constructor();
    getComponents(response: ContinueResponse<string[]>): Promise<ComponentSet>;
}
export declare const forceSourceDeploySourcePaths: (sourceUri: vscode.Uri | vscode.Uri[] | undefined, uris: vscode.Uri[] | undefined) => Promise<void>;
export declare const getUriFromActiveEditor: () => vscode.Uri | undefined;
