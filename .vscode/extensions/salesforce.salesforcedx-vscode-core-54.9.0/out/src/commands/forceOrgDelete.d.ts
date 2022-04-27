import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { FlagParameter, SfdxCommandletExecutor } from './util';
export declare class ForceOrgDeleteExecutor extends SfdxCommandletExecutor<{}> {
    private flag;
    constructor(flag?: string);
    build(data: {
        choice?: string;
        username?: string;
    }): Command;
}
export declare function forceOrgDelete(this: FlagParameter<string>): Promise<void>;
