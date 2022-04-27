import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/src/types';
import { LightningComponentOptions, TemplateType } from '@salesforce/templates';
import { Uri } from 'vscode';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceLightningLwcCreateExecutor extends LibraryBaseTemplateCommand<DirFileNameSelection> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getOutputFileName(data: DirFileNameSelection): string;
    constructTemplateOptions(data: DirFileNameSelection): LightningComponentOptions;
}
export declare function forceLightningLwcCreate(): Promise<void>;
export declare function forceInternalLightningLwcCreate(sourceUri: Uri): Promise<void>;
