import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { SfdxCommandletExecutor } from './util';
export declare class ForceConfigSetExecutor extends SfdxCommandletExecutor<{}> {
    private usernameOrAlias;
    protected showChannelOutput: boolean;
    constructor(usernameOrAlias: string);
    build(data: {}): Command;
}
export declare function forceConfigSet(usernameOrAlias: string): Promise<void>;
