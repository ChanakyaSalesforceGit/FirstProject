"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
const messages_1 = require("../../messages");
const iconPaths_1 = require("./iconPaths");
/**
 * Base class for test node in the test explorer.
 * It's initialized with the command to navigate to the test
 * upon clicking.
 */
class TestNode extends vscode.TreeItem {
    constructor(label, collapsibleState, location) {
        super(label, collapsibleState);
        this.iconPath = iconPaths_1.getIconPath();
        this.location = location;
        this.description = label;
        this.command = {
            command: 'sfdx.force.lightning.lwc.test.navigateToTest',
            title: messages_1.nls.localize('force_lightning_lwc_test_navigate_to_test'),
            arguments: [this]
        };
    }
}
exports.TestNode = TestNode;
/**
 * Test Node representing an individual test case.
 */
class SfdxTestNode extends TestNode {
    constructor(label, testExecutionInfo) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.testExecutionInfo = testExecutionInfo;
        if (testExecutionInfo) {
            const { testType, testResult } = testExecutionInfo;
            this.contextValue = `${testType}Test`;
            this.iconPath = iconPaths_1.getIconPath(testResult);
            if ('testLocation' in testExecutionInfo) {
                this.location = testExecutionInfo.testLocation;
            }
        }
    }
}
exports.SfdxTestNode = SfdxTestNode;
/**
 * Test Group Node representing a test file.
 * By default it's collpased
 */
class SfdxTestGroupNode extends TestNode {
    constructor(label, testExecutionInfo, collapsibleState = vscode
        .TreeItemCollapsibleState.Collapsed) {
        super(label, collapsibleState);
        this.testExecutionInfo = testExecutionInfo;
        if (testExecutionInfo) {
            const { testType, testResult } = testExecutionInfo;
            this.contextValue = `${testType}TestGroup`;
            this.iconPath = iconPaths_1.getIconPath(testResult);
            if ('testLocation' in testExecutionInfo) {
                this.location = testExecutionInfo.testLocation;
            }
        }
    }
}
exports.SfdxTestGroupNode = SfdxTestGroupNode;
/**
 * Sort test node alphabetically
 * @param node1 first test node
 * @param node2 second test node
 */
function sortTestNodeByLabel(node1, node2) {
    const label1 = node1.label;
    const label2 = node2.label;
    if (!label1) {
        return -1;
    }
    if (!label2) {
        return 1;
    }
    return label1.localeCompare(label2);
}
exports.sortTestNodeByLabel = sortTestNodeByLabel;
//# sourceMappingURL=testNode.js.map