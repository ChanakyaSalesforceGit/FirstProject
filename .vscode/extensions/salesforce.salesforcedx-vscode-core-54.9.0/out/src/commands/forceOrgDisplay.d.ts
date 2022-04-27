import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { FlagParameter, SfdxCommandletExecutor } from './util';
export declare class ForceOrgDisplay extends SfdxCommandletExecutor<{}> {
    private flag;
    constructor(flag?: string);
    build(data: {
        username?: string;
    }): Command;
}
export declare function forceOrgDisplay(this: FlagParameter<string>): Promise<void>;
