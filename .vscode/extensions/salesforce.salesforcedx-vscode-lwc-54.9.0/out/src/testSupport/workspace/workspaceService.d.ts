import { shared as lspCommon } from '@salesforce/lightning-lsp-common';
import * as vscode from 'vscode';
/**
 * Provide capabilities for VS Code regarding LWC workspace types defined in lightning-lsp-common
 */
declare class WorkspaceService {
    private currentWorkspaceType;
    /**
     * Setup current workspace type
     * @param context extension context
     * @param workspaceType
     */
    register(context: vscode.ExtensionContext, workspaceType: lspCommon.WorkspaceType): void;
    getCurrentWorkspaceType(): lspCommon.WorkspaceType;
    setCurrentWorkspaceType(workspaceType: lspCommon.WorkspaceType): void;
    isSFDXWorkspace(workspaceType: lspCommon.WorkspaceType): boolean;
    isCoreWorkspace(workspaceType: lspCommon.WorkspaceType): boolean;
    /**
     * @returns {String} workspace type name for telemetry
     */
    getCurrentWorkspaceTypeForTelemetry(): string;
}
export declare const workspaceService: WorkspaceService;
export {};
//# sourceMappingURL=workspaceService.d.ts.map