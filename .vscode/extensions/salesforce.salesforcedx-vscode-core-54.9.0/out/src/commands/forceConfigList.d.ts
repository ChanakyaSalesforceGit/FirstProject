import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { SfdxCommandletExecutor } from './util';
export declare class ForceConfigList extends SfdxCommandletExecutor<{}> {
    build(data: {}): Command;
}
export declare function forceConfigList(): Promise<void>;
