import { CliCommandExecution, Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { SfdxCommandletExecutor } from '../commands/util';
export declare class ForceDescribeMetadataExecutor extends SfdxCommandletExecutor<string> {
    constructor();
    build(data: {}): Command;
    execute(): CliCommandExecution;
}
export declare function forceDescribeMetadata(outputFolder: string): Promise<string>;
