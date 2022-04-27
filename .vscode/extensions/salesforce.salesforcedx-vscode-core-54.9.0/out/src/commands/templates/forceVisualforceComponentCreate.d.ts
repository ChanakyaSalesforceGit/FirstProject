import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { TemplateType, VisualforceComponentOptions } from '@salesforce/templates';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceVisualForceComponentCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    constructTemplateOptions(data: DirFileNameSelection): VisualforceComponentOptions;
}
export declare function forceVisualforceComponentCreate(): Promise<void>;
