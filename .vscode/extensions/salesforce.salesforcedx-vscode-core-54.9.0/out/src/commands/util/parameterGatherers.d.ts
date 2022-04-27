import { CancelResponse, ContinueResponse, LocalComponent, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
import { RetrieveDescriber } from '../forceSourceRetrieveMetadata';
export declare class CompositeParametersGatherer<T> implements ParametersGatherer<T> {
    private readonly gatherers;
    constructor(...gatherers: Array<ParametersGatherer<any>>);
    gather(): Promise<CancelResponse | ContinueResponse<T>>;
}
export declare class EmptyParametersGatherer implements ParametersGatherer<{}> {
    gather(): Promise<CancelResponse | ContinueResponse<{}>>;
}
export declare class FilePathGatherer implements ParametersGatherer<string> {
    private filePath;
    constructor(uri: vscode.Uri);
    gather(): Promise<CancelResponse | ContinueResponse<string>>;
}
export declare type FileSelection = {
    file: string;
};
export declare class FileSelector implements ParametersGatherer<FileSelection> {
    private readonly displayMessage;
    private readonly errorMessage;
    private readonly include;
    private readonly exclude?;
    private readonly maxResults?;
    constructor(displayMessage: string, errorMessage: string, include: string, exclude?: string, maxResults?: number);
    gather(): Promise<CancelResponse | ContinueResponse<FileSelection>>;
}
export declare class SelectFileName implements ParametersGatherer<{
    fileName: string;
}> {
    gather(): Promise<CancelResponse | ContinueResponse<{
        fileName: string;
    }>>;
}
export declare class SelectUsername implements ParametersGatherer<{
    username: string;
}> {
    gather(): Promise<CancelResponse | ContinueResponse<{
        username: string;
    }>>;
}
export declare class DemoModePromptGatherer implements ParametersGatherer<{}> {
    private readonly LOGOUT_RESPONSE;
    private readonly DO_NOT_LOGOUT_RESPONSE;
    private readonly prompt;
    gather(): Promise<CancelResponse | ContinueResponse<{}>>;
}
export declare class SelectLwcComponentDir implements ParametersGatherer<{
    fileName: string;
    outputdir: string;
}> {
    gather(): Promise<CancelResponse | ContinueResponse<{
        fileName: string;
        outputdir: string;
    }>>;
    showMenu(options: string[], message: string): Promise<string | undefined>;
}
export declare class SelectOutputDir implements ParametersGatherer<{
    outputdir: string;
}> {
    private typeDir;
    private typeDirRequired;
    static readonly defaultOutput: string;
    static readonly customDirOption: string;
    constructor(typeDir: string, typeDirRequired?: boolean);
    gather(): Promise<CancelResponse | ContinueResponse<{
        outputdir: string;
    }>>;
    getDefaultOptions(packageDirectories: string[]): string[];
    getCustomOptions(packageDirs: string[], rootPath: string): string[];
    showMenu(options: string[]): Promise<string | undefined>;
}
export declare class SimpleGatherer<T> implements ParametersGatherer<T> {
    private input;
    constructor(input: T);
    gather(): Promise<ContinueResponse<T>>;
}
export declare class RetrieveComponentOutputGatherer implements ParametersGatherer<LocalComponent[]> {
    private describer;
    constructor(describer: RetrieveDescriber);
    gather(): Promise<CancelResponse | ContinueResponse<LocalComponent[]>>;
}
export declare class MetadataTypeGatherer extends SimpleGatherer<{
    type: string;
}> {
    constructor(metadataType: string);
}
export declare class PromptConfirmGatherer implements ParametersGatherer<{
    choice: string;
}> {
    private question;
    constructor(question: string);
    gather(): Promise<CancelResponse | ContinueResponse<{
        choice: string;
    }>>;
    showMenu(options: string[]): Promise<string | undefined>;
}
