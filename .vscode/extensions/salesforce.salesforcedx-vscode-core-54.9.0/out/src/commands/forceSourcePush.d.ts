import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { BaseDeployExecutor, DeployType } from './baseDeployCommand';
import { CommandParams, FlagParameter } from './util';
export declare const pushCommand: CommandParams;
export declare const pushCommandLegacy: CommandParams;
export declare class ForceSourcePushExecutor extends BaseDeployExecutor {
    params: CommandParams;
    private flag;
    constructor(flag?: string, params?: CommandParams);
    build(data: {}): Command;
    protected getDeployType(): DeployType;
}
export declare function forceSourcePush(this: FlagParameter<string>): Promise<void>;
