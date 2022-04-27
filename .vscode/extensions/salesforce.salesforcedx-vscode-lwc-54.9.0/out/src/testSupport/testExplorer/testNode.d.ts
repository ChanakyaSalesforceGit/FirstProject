import * as vscode from 'vscode';
import { TestExecutionInfo } from '../types';
/**
 * Base class for test node in the test explorer.
 * It's initialized with the command to navigate to the test
 * upon clicking.
 */
export declare abstract class TestNode extends vscode.TreeItem {
    description: string;
    location?: vscode.Location;
    iconPath: {
        light: string;
        dark: string;
    };
    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, location?: vscode.Location);
}
/**
 * Test Node representing an individual test case.
 */
export declare class SfdxTestNode extends TestNode {
    contextValue?: string;
    testExecutionInfo?: TestExecutionInfo;
    constructor(label: string, testExecutionInfo?: TestExecutionInfo);
}
/**
 * Test Group Node representing a test file.
 * By default it's collpased
 */
export declare class SfdxTestGroupNode extends TestNode {
    contextValue?: string;
    testExecutionInfo?: TestExecutionInfo;
    constructor(label: string, testExecutionInfo: TestExecutionInfo, collapsibleState?: vscode.TreeItemCollapsibleState);
}
/**
 * Sort test node alphabetically
 * @param node1 first test node
 * @param node2 second test node
 */
export declare function sortTestNodeByLabel(node1: TestNode, node2: TestNode): number;
//# sourceMappingURL=testNode.d.ts.map