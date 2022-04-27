import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { SfdxCommandletExecutor } from '../util';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { ForceAuthDemoModeExecutor } from './forceAuthWebLogin';
export declare class ForceAuthDevHubExecutor extends SfdxCommandletExecutor<{}> {
    protected showChannelOutput: boolean;
    build(data: {}): Command;
    execute(response: ContinueResponse<any>): Promise<void>;
    configureDefaultDevHubLocation(): Promise<void>;
    setGlobalDefaultDevHub(newUsername: string): Promise<void>;
}
export declare class ForceAuthDevHubDemoModeExecutor extends ForceAuthDemoModeExecutor<{}> {
    build(data: {}): Command;
}
export declare function createAuthDevHubExecutor(): SfdxCommandletExecutor<{}>;
export declare function forceAuthDevHub(): Promise<void>;
