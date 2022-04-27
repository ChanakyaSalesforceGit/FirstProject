import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { TemplateType, VisualforcePageOptions } from '@salesforce/templates';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceVisualForcePageCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    constructTemplateOptions(data: DirFileNameSelection): VisualforcePageOptions;
}
export declare function forceVisualforcePageCreate(): Promise<void>;
