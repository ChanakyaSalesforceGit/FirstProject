import { ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
export declare class LibraryPathsGatherer implements ParametersGatherer<string[]> {
    private uris;
    constructor(uris: vscode.Uri[]);
    gather(): Promise<ContinueResponse<string[]>>;
}
