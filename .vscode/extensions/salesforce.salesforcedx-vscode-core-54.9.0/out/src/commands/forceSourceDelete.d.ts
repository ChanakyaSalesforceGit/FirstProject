import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancelResponse, ContinueResponse, ParametersGatherer, PreconditionChecker } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
import { SfdxCommandletExecutor } from './util/sfdxCommandlet';
export declare class ForceSourceDeleteExecutor extends SfdxCommandletExecutor<{
    filePath: string;
}> {
    build(data: {
        filePath: string;
    }): Command;
}
export declare class ManifestChecker implements PreconditionChecker {
    private explorerPath;
    constructor(uri: vscode.Uri);
    check(): boolean;
}
export declare class ConfirmationAndSourcePathGatherer implements ParametersGatherer<{
    filePath: string;
}> {
    private explorerPath;
    private readonly PROCEED;
    private readonly CANCEL;
    constructor(uri: vscode.Uri);
    gather(): Promise<CancelResponse | ContinueResponse<{
        filePath: string;
    }>>;
}
export declare function forceSourceDelete(sourceUri: vscode.Uri): Promise<void>;
