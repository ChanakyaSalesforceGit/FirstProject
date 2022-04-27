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
const vscode = require("vscode");
const constants_1 = require("../types/constants");
const constants_2 = require("../types/constants");
const testRunner_1 = require("./testRunner");
/**
 * Test Watcher class for watching Jest tests
 */
class TestWatcher {
    constructor() {
        this.watchedTests = new Map();
    }
    /**
     * Start watching tests from provided test execution info
     * @param testExecutionInfo test execution info
     */
    watchTest(testExecutionInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const testRunner = new testRunner_1.TestRunner(testExecutionInfo, "watch" /* WATCH */, constants_1.FORCE_LWC_TEST_WATCH_LOG_NAME);
            try {
                const sfdxTask = yield testRunner.executeAsSfdxTask();
                if (sfdxTask) {
                    const { testUri } = testExecutionInfo;
                    const { fsPath } = testUri;
                    sfdxTask.onDidEnd(() => {
                        this.watchedTests.delete(fsPath);
                        this.setWatchingContext(testUri);
                    });
                    this.watchedTests.set(fsPath, sfdxTask);
                    this.setWatchingContext(testUri);
                    return sfdxTask;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    /**
     * Stop watching tests from provided test execution info
     * @param testExecutionInfo test execution info
     */
    stopWatchingTest(testExecutionInfo) {
        const { testUri } = testExecutionInfo;
        const { fsPath } = testUri;
        const watchTestTask = this.watchedTests.get(fsPath);
        if (watchTestTask) {
            watchTestTask.terminate();
        }
        this.watchedTests.delete(fsPath);
        this.setWatchingContext(testUri);
    }
    /**
     * Stop watching all tests.
     */
    stopWatchingAllTests() {
        for (const [fsPath, watchTestTask] of this.watchedTests.entries()) {
            if (watchTestTask) {
                watchTestTask.terminate();
            }
            this.watchedTests.delete(fsPath);
            this.setWatchingContext(vscode.Uri.file(fsPath));
        }
    }
    /**
     * Determine if we are watching the test uri
     * @param testUri uri of the test
     */
    isWatchingTest(testUri) {
        const { fsPath } = testUri;
        return this.watchedTests.has(fsPath);
    }
    /**
     * Execute setContext command if applicable so that start/stop watching buttons
     * display appropriately in editor/title
     * @param testUri uri of the test
     */
    setWatchingContext(testUri) {
        if (vscode.window.activeTextEditor &&
            vscode.window.activeTextEditor.document.uri.fsPath === testUri.fsPath) {
            vscode.commands.executeCommand('setContext', constants_2.SFDX_LWC_JEST_IS_WATCHING_FOCUSED_FILE_CONTEXT, this.isWatchingTest(testUri));
        }
    }
}
exports.testWatcher = new TestWatcher();
//# sourceMappingURL=testWatcher.js.map