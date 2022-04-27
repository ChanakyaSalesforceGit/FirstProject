import { ContinueResponse, DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SfdxCommandletExecutor, SourcePathStrategy } from '../util';
export declare abstract class BaseTemplateCommand extends SfdxCommandletExecutor<DirFileNameSelection> {
    private metadataType?;
    execute(response: ContinueResponse<DirFileNameSelection>): void;
    protected runPostCommandTasks(data: DirFileNameSelection): void;
    private identifyDirType;
    protected getPathToSource(outputDir: string, fileName: string): string;
    getSourcePathStrategy(): SourcePathStrategy;
    getFileExtension(): string;
    setFileExtension(extension: string): void;
    getDefaultDirectory(): string;
    set metadata(type: string);
}
