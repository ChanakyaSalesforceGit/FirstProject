import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { ApexTriggerOptions, TemplateType } from '@salesforce/templates';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceApexTriggerCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    constructTemplateOptions(data: DirFileNameSelection): ApexTriggerOptions;
}
export declare function forceApexTriggerCreate(): Promise<void>;
