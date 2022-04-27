import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { LightningEventOptions, TemplateType } from '@salesforce/templates';
import { Uri } from 'vscode';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceLightningEventCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    getFileExtension(): string;
    constructTemplateOptions(data: DirFileNameSelection): LightningEventOptions;
}
export declare function forceLightningEventCreate(): Promise<void>;
export declare function forceInternalLightningEventCreate(sourceUri: Uri): Promise<void>;
