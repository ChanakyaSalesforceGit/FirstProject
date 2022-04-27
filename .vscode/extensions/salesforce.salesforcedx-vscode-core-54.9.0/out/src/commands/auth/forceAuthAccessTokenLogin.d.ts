import * as vscode from 'vscode';
import { LibraryCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { AccessTokenParams } from './authParamsGatherer';
export declare class ForceAuthAccessTokenExecutor extends LibraryCommandletExecutor<AccessTokenParams> {
    constructor();
    run(response: ContinueResponse<AccessTokenParams>, progress?: vscode.Progress<{
        message?: string | undefined;
        increment?: number | undefined;
    }>, token?: vscode.CancellationToken): Promise<boolean>;
}
export declare function forceAuthAccessToken(): Promise<void>;
