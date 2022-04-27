import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { SfdxCommandletExecutor } from './util';
export declare class ForceOrgListExecutor extends SfdxCommandletExecutor<{}> {
    build(data: {
        choice?: string;
    }): Command;
}
export declare function forceOrgList(): Promise<void>;
