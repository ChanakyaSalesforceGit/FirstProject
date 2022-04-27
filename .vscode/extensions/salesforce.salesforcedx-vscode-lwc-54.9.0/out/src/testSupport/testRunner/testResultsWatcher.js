"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const helpers_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/helpers");
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const testIndexer_1 = require("../testIndexer");
/**
 * Test result watcher to watch for creating/updating test results,
 * and update test indexer.
 */
class TestResultsWatcher {
    constructor() {
        this.fileSystemWatchers = new Map();
        this.disposables = [];
    }
    /**
     * Register test result watcher with extension context
     * @param context extension context
     */
    register(context) {
        context.subscriptions.push(this);
    }
    /**
     * Determine the test result output folder. It should be under
     * .sfdx/tools/testresults/lwc of the workspace folder of the test
     * @param workspaceFolder workspace folder of the test
     * @param testExecutionInfo test execution info
     */
    getTempFolder(workspaceFolder, testExecutionInfo) {
        const { testType } = testExecutionInfo;
        const workspaceFsPath = workspaceFolder.uri.fsPath;
        return helpers_1.getTestResultsFolder(workspaceFsPath, testType);
    }
    /**
     * Start file watchers for test results if needed.
     * The file watchers will read test result file and update test indexer.
     * @param outputFilePath Jest test results output path
     */
    watchTestResults(outputFilePath) {
        const outputFileFolder = path.dirname(outputFilePath);
        let fileSystemWatcher = this.fileSystemWatchers.get(outputFileFolder);
        if (!fileSystemWatcher) {
            const outputFileExtname = path.extname(outputFilePath);
            const testResultsGlobPattern = path
                .join(outputFileFolder, `*${outputFileExtname}`)
                .replace(/\\/g, '/');
            fileSystemWatcher = vscode.workspace.createFileSystemWatcher(testResultsGlobPattern);
            fileSystemWatcher.onDidCreate(testResultsUri => {
                this.updateTestResultsFromTestResultsJson(testResultsUri);
            });
            fileSystemWatcher.onDidChange(testResultsUri => {
                this.updateTestResultsFromTestResultsJson(testResultsUri);
            });
            this.fileSystemWatchers.set(outputFileFolder, fileSystemWatcher);
            this.disposables.push(fileSystemWatcher);
        }
    }
    updateTestResultsFromTestResultsJson(testResultsUri) {
        try {
            const { fsPath: testResultsFsPath } = testResultsUri;
            const testResultsJSON = fs.readFileSync(testResultsFsPath, {
                encoding: 'utf8'
            });
            const testResults = JSON.parse(testResultsJSON);
            testIndexer_1.lwcTestIndexer.updateTestResults(testResults);
        }
        catch (error) {
            console.error(error);
        }
    }
    dispose() {
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
exports.testResultsWatcher = new TestResultsWatcher();
//# sourceMappingURL=testResultsWatcher.js.map