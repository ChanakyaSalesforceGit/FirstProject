import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { LightningInterfaceOptions, TemplateType } from '@salesforce/templates';
import { Uri } from 'vscode';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceLightningInterfaceCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    getFileExtension(): string;
    constructTemplateOptions(data: DirFileNameSelection): LightningInterfaceOptions;
}
export declare function forceLightningInterfaceCreate(): Promise<void>;
export declare function forceInternalLightningInterfaceCreate(sourceUri: Uri): Promise<void>;
