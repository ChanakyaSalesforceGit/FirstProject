import { CliCommandExecution, Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { SfdxCommandletExecutor } from '../commands/util';
export declare class ForceListMetadataExecutor extends SfdxCommandletExecutor<string> {
    private metadataType;
    private defaultUsernameOrAlias;
    private folder?;
    constructor(metadataType: string, defaultUsernameOrAlias: string, folder?: string);
    build(data: {}): Command;
    execute(): CliCommandExecution;
}
export declare function forceListMetadata(metadataType: string, defaultUsernameOrAlias: string, outputPath: string, folder?: string): Promise<string>;
