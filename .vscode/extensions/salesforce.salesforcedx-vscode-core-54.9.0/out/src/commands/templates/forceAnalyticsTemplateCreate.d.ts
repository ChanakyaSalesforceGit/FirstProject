import { CancelResponse, ContinueResponse, DirFileNameSelection, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { AnalyticsTemplateOptions, TemplateType } from '@salesforce/templates';
import { SourcePathStrategy } from '../util';
import { LibraryBaseTemplateCommand } from './libraryBaseTemplateCommand';
export declare class LibraryForceAnalyticsTemplateCreateExecutor extends LibraryBaseTemplateCommand<TemplateAndDir> {
    executionName: string;
    telemetryName: string;
    metadataTypeName: string;
    templateType: TemplateType;
    getFileExtension(): string;
    getOutputFileName(data: TemplateAndDir): string;
    constructTemplateOptions(data: TemplateAndDir): AnalyticsTemplateOptions;
    getDefaultDirectory(): string;
    getSourcePathStrategy(): SourcePathStrategy;
}
export declare type TemplateAndDir = DirFileNameSelection & Template;
export interface Template {
    fileName: string;
}
export declare class SelectProjectTemplate implements ParametersGatherer<Template> {
    gather(): Promise<CancelResponse | ContinueResponse<Template>>;
}
export declare function forceAnalyticsTemplateCreate(): Promise<void>;
