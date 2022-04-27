"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const path = require("path");
const vscode = require("vscode");
const testIndexer_1 = require("../testIndexer");
const testNode_1 = require("./testNode");
function getLabelFromTestCaseInfo(testCaseInfo) {
    const { testName } = testCaseInfo;
    return testName;
}
function getLabelFromTestFileInfo(testFileInfo) {
    const { testUri } = testFileInfo;
    const { fsPath } = testUri;
    const ext = '.test.js';
    const testGroupLabel = path.basename(fsPath, ext);
    return testGroupLabel;
}
/**
 * Test Explorer Tree Data Provider implementation
 */
class SfdxTestOutlineProvider {
    constructor() {
        this.onDidChangeTestData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.onDidChangeTestData.event;
        this.disposables = [];
        testIndexer_1.lwcTestIndexer.onDidUpdateTestIndex(() => {
            this.onDidUpdateTestIndex();
        }, null, this.disposables);
        testIndexer_1.lwcTestIndexer.onDidUpdateTestResultsIndex(() => {
            this.onDidUpdateTestResultsIndex();
        }, null, this.disposables);
    }
    dispose() {
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    onDidUpdateTestIndex() {
        this.onDidChangeTestData.fire(undefined);
    }
    onDidUpdateTestResultsIndex() {
        this.onDidChangeTestData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    /**
     * Retrieve the children of the test node. The actual data comes from the test indexer.
     * It retrieves all available test file nodes,
     * and retrieves the test cases nodes from a test file.
     * @param element test node
     */
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (element) {
                if (element instanceof testNode_1.SfdxTestGroupNode) {
                    if (element.location) {
                        const testInfo = yield testIndexer_1.lwcTestIndexer.findTestInfoFromLwcJestTestFile(element.location.uri);
                        if (testInfo) {
                            return testInfo.map(testCaseInfo => {
                                const testNodeLabel = getLabelFromTestCaseInfo(testCaseInfo);
                                return new testNode_1.SfdxTestNode(testNodeLabel, testCaseInfo);
                            });
                        }
                    }
                }
                return [];
            }
            else {
                try {
                    const allTestFileInfo = yield testIndexer_1.lwcTestIndexer.findAllTestFileInfo();
                    return allTestFileInfo
                        .map(testFileInfo => {
                        const testNodeLabel = getLabelFromTestFileInfo(testFileInfo);
                        const testGroupNode = new testNode_1.SfdxTestGroupNode(testNodeLabel, testFileInfo);
                        return testGroupNode;
                    })
                        .sort(testNode_1.sortTestNodeByLabel);
                }
                catch (error) {
                    console.error(error);
                    return [];
                }
            }
        });
    }
}
exports.SfdxTestOutlineProvider = SfdxTestOutlineProvider;
/**
 * Register test explorer with extension context
 * @param context extension context
 */
function registerLwcTestExplorerTreeView(context) {
    const testOutlineProvider = new SfdxTestOutlineProvider();
    const testProvider = vscode.window.registerTreeDataProvider('sfdx.force.lightning.lwc.test.view', testOutlineProvider);
    context.subscriptions.push(testOutlineProvider);
    context.subscriptions.push(testProvider);
}
exports.registerLwcTestExplorerTreeView = registerLwcTestExplorerTreeView;
//# sourceMappingURL=testOutlineProvider.js.map