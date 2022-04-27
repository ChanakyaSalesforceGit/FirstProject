import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { SfdxCommandletExecutor } from './util';
export declare class ForceAliasList extends SfdxCommandletExecutor<{}> {
    build(data: {}): Command;
}
export declare function forceAliasList(): Promise<void>;
