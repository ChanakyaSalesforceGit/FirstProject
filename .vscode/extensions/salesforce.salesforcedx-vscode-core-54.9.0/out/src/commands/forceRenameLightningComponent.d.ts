import { LibraryCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/src/types';
import * as vscode from 'vscode';
export declare class RenameLwcComponentExecutor extends LibraryCommandletExecutor<ComponentName> {
    private sourceFsPath;
    constructor(sourceFsPath: string);
    run(response: ContinueResponse<ComponentName>): Promise<boolean>;
}
export declare function forceRenameLightningComponent(sourceUri: vscode.Uri): Promise<void>;
export interface ComponentName {
    name?: string;
}
export declare class GetComponentName implements ParametersGatherer<ComponentName> {
    private sourceFsPath;
    constructor(sourceFsPath: string);
    gather(): Promise<CancelResponse | ContinueResponse<ComponentName>>;
}
export declare function isNameMatch(item: string, componentName: string, componentPath: string): boolean;
