import { Connection } from '@salesforce/core';
import { OrgInfo } from '@salesforce/salesforcedx-utils-vscode/out/src';
import * as vscode from 'vscode';
/**
 * Manages the context of a workspace during a session with an open SFDX project.
 */
export declare class WorkspaceContext {
    protected static instance?: WorkspaceContext;
    readonly onOrgChange: vscode.Event<OrgInfo>;
    protected constructor();
    initialize(context: vscode.ExtensionContext): Promise<void>;
    static getInstance(forceNew?: boolean): WorkspaceContext;
    getConnection(): Promise<Connection>;
    protected handleCliConfigChange(orgInfo: OrgInfo): Promise<void>;
    get username(): string | undefined;
    get alias(): string | undefined;
}
export { OrgInfo };
