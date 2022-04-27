import * as vscode from 'vscode';
import { TestNode } from './testNode';
/**
 * Test Explorer Tree Data Provider implementation
 */
export declare class SfdxTestOutlineProvider implements vscode.TreeDataProvider<TestNode>, vscode.Disposable {
    private onDidChangeTestData;
    onDidChangeTreeData: vscode.Event<TestNode | undefined>;
    private disposables;
    constructor();
    dispose(): void;
    private onDidUpdateTestIndex;
    private onDidUpdateTestResultsIndex;
    getTreeItem(element: TestNode): vscode.TreeItem;
    /**
     * Retrieve the children of the test node. The actual data comes from the test indexer.
     * It retrieves all available test file nodes,
     * and retrieves the test cases nodes from a test file.
     * @param element test node
     */
    getChildren(element?: TestNode): Promise<TestNode[]>;
}
/**
 * Register test explorer with extension context
 * @param context extension context
 */
export declare function registerLwcTestExplorerTreeView(context: vscode.ExtensionContext): void;
//# sourceMappingURL=testOutlineProvider.d.ts.map