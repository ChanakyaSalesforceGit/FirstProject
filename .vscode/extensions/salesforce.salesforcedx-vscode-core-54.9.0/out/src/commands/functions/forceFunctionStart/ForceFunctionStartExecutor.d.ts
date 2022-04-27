import { LibraryCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
export declare abstract class ForceFunctionStartExecutor extends LibraryCommandletExecutor<string> {
    protected UNEXPECTED_ERROR_KEY: string;
    constructor(startMessageKey: string, logName: string);
    run(response: ContinueResponse<string>, progress?: vscode.Progress<{
        message?: string | undefined;
        increment?: number | undefined;
    }>, token?: vscode.CancellationToken): Promise<boolean>;
    abstract setupFunctionListeners(functionDirPath: string, functionDisposable: vscode.Disposable): Promise<void>;
    abstract cancelFunction(registeredStartedFunctionDisposable: vscode.Disposable): void;
    abstract buildFunction(functionName: string, functionDirPath: string): void;
    abstract startFunction(functionName: string, functionDirPath?: string): void;
}
