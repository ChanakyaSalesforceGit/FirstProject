import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { LightningAppOptions, TemplateType } from '@salesforce/templates';
import { Uri } from 'vscode';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceLightningAppCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    getFileExtension(): string;
    constructTemplateOptions(data: DirFileNameSelection): LightningAppOptions;
}
export declare function forceLightningAppCreate(): Promise<void>;
export declare function forceInternalLightningAppCreate(sourceUri: Uri): Promise<void>;
