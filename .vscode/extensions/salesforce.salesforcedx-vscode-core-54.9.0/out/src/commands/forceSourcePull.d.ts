import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CommandParams, FlagParameter, SfdxCommandletExecutor } from './util';
export declare const pullCommand: CommandParams;
export declare const pullCommandLegacy: CommandParams;
export declare class ForceSourcePullExecutor extends SfdxCommandletExecutor<{}> {
    params: CommandParams;
    private flag;
    constructor(flag?: string, params?: CommandParams);
    build(data: {}): Command;
}
export declare function forceSourcePull(this: FlagParameter<string>): Promise<void>;
