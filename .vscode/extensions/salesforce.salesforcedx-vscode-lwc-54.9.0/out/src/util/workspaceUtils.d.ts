import { ExtensionContext, Memento, WorkspaceConfiguration } from 'vscode';
export declare class WorkspaceUtils {
    private context;
    private static _instance;
    static get instance(): WorkspaceUtils;
    init(extensionContext: ExtensionContext): void;
    getGlobalStore(): Memento | undefined;
    getWorkspaceSettings(): WorkspaceConfiguration;
}
//# sourceMappingURL=workspaceUtils.d.ts.map