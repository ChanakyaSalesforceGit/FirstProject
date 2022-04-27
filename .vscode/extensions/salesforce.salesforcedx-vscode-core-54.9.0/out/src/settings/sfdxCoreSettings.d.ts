import * as vscode from 'vscode';
/**
 * A centralized location for interacting with sfdx-core settings.
 */
export declare class SfdxCoreSettings {
    private static instance;
    static getInstance(): SfdxCoreSettings;
    /**
     * Get the configuration for a sfdx-core
     */
    getConfiguration(): vscode.WorkspaceConfiguration;
    getShowCLISuccessMsg(): boolean;
    getTelemetryEnabled(): boolean;
    updateShowCLISuccessMsg(value: boolean): Promise<void>;
    getPushOrDeployOnSaveEnabled(): boolean;
    getPushOrDeployOnSaveOverrideConflicts(): boolean;
    getRetrieveTestCodeCoverage(): boolean;
    getInternalDev(): boolean;
    getConflictDetectionEnabled(): boolean;
    private getConfigValue;
    private setConfigValue;
}
