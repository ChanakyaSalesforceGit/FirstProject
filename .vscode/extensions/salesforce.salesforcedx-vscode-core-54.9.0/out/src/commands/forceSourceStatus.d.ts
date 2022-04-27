import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CommandParams, FlagParameter, SfdxCommandletExecutor } from './util';
export declare enum SourceStatusFlags {
    Local = "--local",
    Remote = "--remote"
}
export declare const statusCommand: CommandParams;
export declare const statusCommandLegacy: CommandParams;
export declare class ForceSourceStatusExecutor extends SfdxCommandletExecutor<{}> {
    params: CommandParams;
    private flag;
    constructor(flag?: SourceStatusFlags, params?: CommandParams);
    build(data: {}): Command;
}
export declare function forceSourceStatus(this: FlagParameter<SourceStatusFlags>): Promise<void>;
