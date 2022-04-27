import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { LightningComponentOptions, TemplateType } from '@salesforce/templates';
import { Uri } from 'vscode';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceLightningComponentCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    getFileExtension(): string;
    constructTemplateOptions(data: DirFileNameSelection): LightningComponentOptions;
}
export declare function forceLightningComponentCreate(): Promise<void>;
export declare function forceInternalLightningComponentCreate(sourceUri: Uri): Promise<void>;
