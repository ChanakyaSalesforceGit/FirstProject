import { LibraryCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { CancellationToken, Progress } from 'vscode';
import { SfdxCommandletExecutor } from '../util';
export declare class ForceAuthLogoutAll extends SfdxCommandletExecutor<{}> {
    static withoutShowingChannel(): ForceAuthLogoutAll;
    build(data: {}): Command;
}
export declare function forceAuthLogoutAll(): Promise<void>;
export declare class AuthLogoutDefault extends LibraryCommandletExecutor<string> {
    constructor();
    run(response: ContinueResponse<string>, progress?: Progress<{
        message?: string | undefined;
        increment?: number | undefined;
    }>, token?: CancellationToken): Promise<boolean>;
}
export declare function forceAuthLogoutDefault(): Promise<void>;
