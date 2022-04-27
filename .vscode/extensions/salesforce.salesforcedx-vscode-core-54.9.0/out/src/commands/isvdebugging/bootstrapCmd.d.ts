/// <reference types="node" />
import { Command, CommandExecution } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SpawnOptions } from 'child_process';
import * as vscode from 'vscode';
import { ProjectNameAndPathAndTemplate } from '../forceProjectCreate';
import { SfdxCommandletExecutor } from '../util';
export interface InstalledPackageInfo {
    id: string;
    name: string;
    namespace: string;
    versionId: string;
    versionName: string;
    versionNumber: string;
}
export declare class IsvDebugBootstrapExecutor extends SfdxCommandletExecutor<{}> {
    readonly relativeMetdataTempPath: string;
    readonly relativeApexPackageXmlPath: string;
    readonly relativeInstalledPackagesPath: string;
    build(data: {}): Command;
    buildCreateProjectCommand(data: IsvDebugBootstrapConfig): Command;
    buildConfigureProjectCommand(data: IsvDebugBootstrapConfig): Command;
    buildQueryForOrgNamespacePrefixCommand(data: IsvDebugBootstrapConfig): Command;
    parseOrgNamespaceQueryResultJson(orgNamespaceQueryJson: string): string;
    buildRetrieveOrgSourceCommand(data: IsvDebugBootstrapConfig): Command;
    buildMetadataApiConvertOrgSourceCommand(data: IsvDebugBootstrapConfig): Command;
    buildPackageInstalledListAsJsonCommand(data: IsvDebugBootstrapConfig): Command;
    buildRetrievePackagesSourceCommand(data: IsvDebugBootstrapConfig, packageNames: string[]): Command;
    buildMetadataApiConvertPackageSourceCommand(packageName: string): Command;
    parsePackageInstalledListJson(packagesJson: string): InstalledPackageInfo[];
    execute(response: ContinueResponse<IsvDebugBootstrapConfig>): Promise<void>;
    executeCommand(command: Command, options: SpawnOptions, cancellationTokenSource: vscode.CancellationTokenSource, cancellationToken: vscode.CancellationToken): Promise<string>;
    protected attachExecution(execution: CommandExecution, cancellationTokenSource: vscode.CancellationTokenSource, cancellationToken: vscode.CancellationToken): void;
}
export declare type IsvDebugBootstrapConfig = ProjectNameAndPathAndTemplate & ForceIdeUri;
export interface ForceIdeUri {
    loginUrl: string;
    sessionId: string;
    orgName: string;
}
export declare class EnterForceIdeUri implements ParametersGatherer<ForceIdeUri> {
    static readonly uriValidator: (value: string) => string | null;
    forceIdUrl?: ForceIdeUri;
    gather(): Promise<CancelResponse | ContinueResponse<ForceIdeUri>>;
}
export declare function isvDebugBootstrap(): Promise<void>;
