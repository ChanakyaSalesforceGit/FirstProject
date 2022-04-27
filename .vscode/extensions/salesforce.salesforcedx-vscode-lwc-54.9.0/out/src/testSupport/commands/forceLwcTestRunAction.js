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
const testRunner_1 = require("../testRunner");
const constants_1 = require("../types/constants");
const utils_1 = require("../utils");
const workspace_1 = require("../workspace");
/**
 * Run an LWC Jest test from provided test execution info
 * @param testExecutionInfo test execution info
 */
function forceLwcTestRun(testExecutionInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const testRunner = new testRunner_1.TestRunner(testExecutionInfo, "run" /* RUN */, constants_1.FORCE_LWC_TEST_RUN_LOG_NAME);
        try {
            return yield testRunner.executeAsSfdxTask();
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.forceLwcTestRun = forceLwcTestRun;
/**
 * Run an individual test case
 * @param data a test explorer node or information provided by code lens
 */
function forceLwcTestCaseRun(data) {
    const { testExecutionInfo } = data;
    return forceLwcTestRun(testExecutionInfo);
}
exports.forceLwcTestCaseRun = forceLwcTestCaseRun;
/**
 * Run a test file
 * @param data a test explorer node
 */
function forceLwcTestFileRun(data) {
    const { testExecutionInfo } = data;
    return forceLwcTestRun(testExecutionInfo);
}
exports.forceLwcTestFileRun = forceLwcTestFileRun;
/**
 * Run all tests in the workspace folder
 */
function forceLwcTestRunAllTests() {
    const workspaceFolder = workspace_1.getTestWorkspaceFolder();
    if (workspaceFolder) {
        const testExecutionInfo = {
            kind: "testDirectory" /* TEST_DIRECTORY */,
            testType: "lwc" /* LWC */,
            testUri: workspaceFolder.uri
        };
        return forceLwcTestRun(testExecutionInfo);
    }
}
exports.forceLwcTestRunAllTests = forceLwcTestRunAllTests;
/**
 * Run the test of currently focused editor
 */
function forceLwcTestRunActiveTextEditorTest() {
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor && utils_1.isLwcJestTest(activeTextEditor.document)) {
        const testExecutionInfo = {
            kind: "testFile" /* TEST_FILE */,
            testType: "lwc" /* LWC */,
            testUri: activeTextEditor.document.uri
        };
        return forceLwcTestFileRun({
            testExecutionInfo
        });
    }
}
exports.forceLwcTestRunActiveTextEditorTest = forceLwcTestRunActiveTextEditorTest;
//# sourceMappingURL=forceLwcTestRunAction.js.map