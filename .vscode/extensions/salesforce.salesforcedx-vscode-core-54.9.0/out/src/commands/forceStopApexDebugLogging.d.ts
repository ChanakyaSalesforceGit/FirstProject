import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SfdxCommandletExecutor } from './util';
export declare class ForceStopApexDebugLoggingExecutor extends SfdxCommandletExecutor<{}> {
    build(): Command;
    execute(response: ContinueResponse<{}>): void;
}
export declare function turnOffLogging(): Promise<void>;
export declare function forceStopApexDebugLogging(): Promise<void>;
