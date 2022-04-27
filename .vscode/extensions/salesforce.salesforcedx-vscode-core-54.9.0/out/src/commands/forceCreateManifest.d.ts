import { LibraryCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
export declare class ManifestCreateExecutor extends LibraryCommandletExecutor<string> {
    private sourcePaths;
    private responseText;
    constructor(sourcePaths: string[], responseText: string | undefined);
    run(response: ContinueResponse<string>, progress?: vscode.Progress<{
        message?: string | undefined;
        increment?: number | undefined;
    }>, token?: vscode.CancellationToken): Promise<boolean>;
}
export declare function forceCreateManifest(sourceUri: vscode.Uri, uris: vscode.Uri[] | undefined): Promise<void>;
