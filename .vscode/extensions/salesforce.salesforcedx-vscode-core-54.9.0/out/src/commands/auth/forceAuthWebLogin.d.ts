import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SfdxCommandletExecutor } from '../util';
import { AuthParams } from './authParamsGatherer';
export declare class ForceAuthWebLoginExecutor extends SfdxCommandletExecutor<AuthParams> {
    protected showChannelOutput: boolean;
    build(data: AuthParams): Command;
}
export declare abstract class ForceAuthDemoModeExecutor<T> extends SfdxCommandletExecutor<T> {
    execute(response: ContinueResponse<T>): Promise<void>;
}
export declare class ForceAuthWebLoginDemoModeExecutor extends ForceAuthDemoModeExecutor<AuthParams> {
    build(data: AuthParams): Command;
}
export declare function promptLogOutForProdOrg(): Promise<void>;
export declare function createAuthWebLoginExecutor(): SfdxCommandletExecutor<{}>;
export declare function forceAuthWebLogin(): Promise<void>;
