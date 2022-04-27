import * as vscode from 'vscode';
export declare type ConflictFile = {
    remoteLabel: string;
    fileName: string;
    localRelPath: string;
    remoteRelPath: string;
    localPath: string;
    remotePath: string;
    localLastModifiedDate: string | undefined;
    remoteLastModifiedDate: string | undefined;
};
export declare class ConflictNode extends vscode.TreeItem {
    private _children;
    private _parent;
    protected _conflict: ConflictFile | undefined;
    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, parent?: ConflictNode, description?: string | boolean);
    addChildConflictNode(conflictNode: ConflictNode): void;
    get conflict(): ConflictFile | undefined;
    get parent(): ConflictNode | undefined;
    get children(): ConflictNode[];
    get tooltip(): string | undefined;
}
export declare class ConflictFileNode extends ConflictNode {
    constructor(conflict: ConflictFile, parent: ConflictNode);
    attachCommands(): void;
}
export declare class ConflictGroupNode extends ConflictNode {
    private emptyLabel?;
    constructor(label: string, emptyLabel?: string);
    addChildren(conflicts: ConflictFile[]): void;
}
