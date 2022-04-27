import { CancelResponse, ContinueResponse, ParametersGatherer, PostconditionChecker } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { ProjectOptions, TemplateType } from '@salesforce/templates';
import * as vscode from 'vscode';
import { LibraryBaseTemplateCommand } from './templates/libraryBaseTemplateCommand';
export declare enum projectTemplateEnum {
    standard = "standard",
    empty = "empty",
    analytics = "analytics"
}
export declare class ProjectTemplateItem implements vscode.QuickPickItem {
    label: string;
    description: string;
    constructor(name: string, description: string);
}
export declare class LibraryForceProjectCreateExecutor extends LibraryBaseTemplateCommand<ProjectNameAndPathAndTemplate> {
    private readonly options;
    constructor(options?: {
        isProjectWithManifest: boolean;
    });
    executionName: string;
    telemetryName: string;
    templateType: TemplateType;
    getOutputFileName(data: ProjectNameAndPathAndTemplate): string;
    protected openCreatedTemplateInVSCode(outputdir: string, fileName: string): Promise<void>;
    constructTemplateOptions(data: ProjectNameAndPathAndTemplate): ProjectOptions;
}
export declare type ProjectNameAndPathAndTemplate = ProjectName & ProjectURI & ProjectTemplate;
export interface ProjectURI {
    projectUri: string;
}
export interface ProjectName {
    projectName: string;
}
export interface ProjectTemplate {
    projectTemplate: string;
}
export declare class SelectProjectTemplate implements ParametersGatherer<ProjectTemplate> {
    private readonly prefillValueProvider?;
    constructor(prefillValueProvider?: () => string);
    gather(): Promise<CancelResponse | ContinueResponse<ProjectTemplate>>;
}
export declare class SelectProjectName implements ParametersGatherer<ProjectName> {
    private readonly prefillValueProvider?;
    constructor(prefillValueProvider?: () => string);
    gather(): Promise<CancelResponse | ContinueResponse<ProjectName>>;
}
export declare class SelectProjectFolder implements ParametersGatherer<ProjectURI> {
    gather(): Promise<CancelResponse | ContinueResponse<ProjectURI>>;
}
export declare class PathExistsChecker implements PostconditionChecker<ProjectNameAndPathAndTemplate> {
    check(inputs: ContinueResponse<ProjectNameAndPathAndTemplate> | CancelResponse): Promise<ContinueResponse<ProjectNameAndPathAndTemplate> | CancelResponse>;
}
export declare function forceSfdxProjectCreate(): Promise<void>;
export declare function forceProjectWithManifestCreate(): Promise<void>;
