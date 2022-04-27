import * as vscode from 'vscode';
import { BrowserNode, MetadataObject } from './index';
export declare class MetadataOutlineProvider implements vscode.TreeDataProvider<BrowserNode> {
    private defaultOrg;
    private toRefresh;
    private internalOnDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<BrowserNode | undefined>;
    constructor(defaultOrg: string | undefined);
    onViewChange(): Promise<void>;
    refresh(node?: BrowserNode): Promise<void>;
    getTreeItem(element: BrowserNode): vscode.TreeItem;
    getParent(element: BrowserNode): BrowserNode | undefined;
    getChildren(element?: BrowserNode): Promise<BrowserNode[]>;
    getTypes(): Promise<MetadataObject[]>;
    getComponents(node: BrowserNode): Promise<string[]>;
    getDefaultUsernameOrAlias(): Promise<string | undefined>;
}
export declare function parseErrors(error: string | any): Error;
