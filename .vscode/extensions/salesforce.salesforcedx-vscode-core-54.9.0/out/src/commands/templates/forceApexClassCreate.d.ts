import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { ApexClassOptions, TemplateType } from '@salesforce/templates';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceApexClassCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    constructTemplateOptions(data: DirFileNameSelection): ApexClassOptions;
}
export declare function forceApexClassCreate(): Promise<void>;
