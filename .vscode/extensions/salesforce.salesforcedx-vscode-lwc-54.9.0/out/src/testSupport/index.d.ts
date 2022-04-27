import { shared as lspCommon } from '@salesforce/lightning-lsp-common';
import { ExtensionContext } from 'vscode';
/**
 * Activate LWC Test support for supported workspace types
 * @param workspaceType workspace type
 */
export declare function shouldActivateLwcTestSupport(workspaceType: lspCommon.WorkspaceType): boolean;
export declare function activateLwcTestSupport(context: ExtensionContext, workspaceType: lspCommon.WorkspaceType): void;
//# sourceMappingURL=index.d.ts.map