import * as vscode from 'vscode';
import { ConflictFile, ConflictNode } from './conflictNode';
export declare class ConflictOutlineProvider implements vscode.TreeDataProvider<ConflictNode> {
    private root;
    private emptyLabel?;
    private internalOnDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<ConflictNode | undefined>;
    constructor();
    onViewChange(): void;
    refresh(node?: ConflictNode): Promise<void>;
    reset(rootLabel: string, conflicts: ConflictFile[], emptyLabel?: string): void;
    getRevealNode(): ConflictNode | null;
    getTreeItem(element: ConflictNode): vscode.TreeItem;
    getChildren(element?: ConflictNode): ConflictNode[];
    getParent(element: ConflictNode): ConflictNode | undefined;
    private createConflictRoot;
}
