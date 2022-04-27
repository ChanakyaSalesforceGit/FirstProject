import { LibraryCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { ComponentSet, DeployResult, MetadataApiDeploy, MetadataApiRetrieve, RetrieveResult } from '@salesforce/source-deploy-retrieve';
import * as vscode from 'vscode';
declare type DeployRetrieveResult = DeployResult | RetrieveResult;
declare type DeployRetrieveOperation = MetadataApiDeploy | MetadataApiRetrieve;
export declare abstract class DeployRetrieveExecutor<T> extends LibraryCommandletExecutor<T> {
    protected cancellable: boolean;
    constructor(executionName: string, logName: string);
    run(response: ContinueResponse<T>, progress?: vscode.Progress<{
        message?: string | undefined;
        increment?: number | undefined;
    }>, token?: vscode.CancellationToken): Promise<boolean>;
    protected setupCancellation(operation: DeployRetrieveOperation | undefined, token?: vscode.CancellationToken): void;
    protected abstract getComponents(response: ContinueResponse<T>): Promise<ComponentSet>;
    protected abstract doOperation(components: ComponentSet, token?: vscode.CancellationToken): Promise<DeployRetrieveResult | undefined>;
    protected abstract postOperation(result: DeployRetrieveResult | undefined): Promise<void>;
}
export declare abstract class DeployExecutor<T> extends DeployRetrieveExecutor<T> {
    protected doOperation(components: ComponentSet, token: vscode.CancellationToken): Promise<DeployResult | undefined>;
    protected postOperation(result: DeployResult | undefined): Promise<void>;
    private createOutput;
}
export declare abstract class RetrieveExecutor<T> extends DeployRetrieveExecutor<T> {
    protected doOperation(components: ComponentSet, token: vscode.CancellationToken): Promise<RetrieveResult | undefined>;
    protected postOperation(result: RetrieveResult | undefined): Promise<void>;
    private createOutput;
    private createOutputTable;
}
export {};
