import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { ComponentSet } from '@salesforce/source-deploy-retrieve';
import * as vscode from 'vscode';
import { DeployExecutor } from './baseDeployRetrieve';
export declare class LibrarySourceDeployManifestExecutor extends DeployExecutor<string> {
    constructor();
    protected getComponents(response: ContinueResponse<string>): Promise<ComponentSet>;
}
export declare function forceSourceDeployManifest(manifestUri: vscode.Uri): Promise<void>;
