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
const testWatcher_1 = require("../testRunner/testWatcher");
const utils_1 = require("../utils");
/**
 * Start watching tests using the provided test execution info.
 * It will kick off a VS Code task to execute the test runner in watch mode,
 * so that on file changes to the test file or the code related to the test file,
 * it will re-run the tests.
 * @param data provided by test watch commands (or test explorer potentially in the future)
 */
function forceLwcTestStartWatching(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { testExecutionInfo } = data;
        yield testWatcher_1.testWatcher.watchTest(testExecutionInfo);
    });
}
exports.forceLwcTestStartWatching = forceLwcTestStartWatching;
/**
 * Stop watching tests using the provided test execution info.
 * It will terminate the test watch task matched by the test URI.
 * @param data provided by test watch commands
 */
function forceLwcTestStopWatching(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { testExecutionInfo } = data;
        testWatcher_1.testWatcher.stopWatchingTest(testExecutionInfo);
    });
}
exports.forceLwcTestStopWatching = forceLwcTestStopWatching;
/**
 * Stop watching all tests.
 * It will terminate all test watch tasks.
 */
function forceLwcTestStopWatchingAllTests() {
    testWatcher_1.testWatcher.stopWatchingAllTests();
}
exports.forceLwcTestStopWatchingAllTests = forceLwcTestStopWatchingAllTests;
/**
 * Start watching the test of currently focused editor
 */
function forceLwcTestStartWatchingCurrentFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const { activeTextEditor } = vscode.window;
        if (activeTextEditor && utils_1.isLwcJestTest(activeTextEditor.document)) {
            const testExecutionInfo = {
                kind: "testFile" /* TEST_FILE */,
                testType: "lwc" /* LWC */,
                testUri: activeTextEditor.document.uri
            };
            return forceLwcTestStartWatching({
                testExecutionInfo
            });
        }
    });
}
exports.forceLwcTestStartWatchingCurrentFile = forceLwcTestStartWatchingCurrentFile;
/**
 * Stop watching the test of currently focused editor
 */
function forceLwcTestStopWatchingCurrentFile() {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && utils_1.isLwcJestTest(activeTextEditor.document)) {
        const testExecutionInfo = {
            kind: "testFile" /* TEST_FILE */,
            testType: "lwc" /* LWC */,
            testUri: activeTextEditor.document.uri
        };
        return forceLwcTestStopWatching({
            testExecutionInfo
        });
    }
}
exports.forceLwcTestStopWatchingCurrentFile = forceLwcTestStopWatchingCurrentFile;
//# sourceMappingURL=forceLwcTestWatchAction.js.map