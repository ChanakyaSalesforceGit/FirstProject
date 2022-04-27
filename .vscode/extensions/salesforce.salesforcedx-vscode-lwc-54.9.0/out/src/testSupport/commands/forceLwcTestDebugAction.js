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
const uuid = require("uuid");
const vscode = require("vscode");
const testRunner_1 = require("../testRunner");
const constants_1 = require("../types/constants");
const utils_1 = require("../utils");
const telemetry_1 = require("../../telemetry");
const workspaceService_1 = require("../workspace/workspaceService");
const debugSessionStartTimes = new Map();
/**
 * Create a VS Code debug configuration for LWC Jest tests.
 * @param command LWC test runner executable
 * @param args CLI arguments
 * @param cwd current working directory
 */
function getDebugConfiguration(command, args, cwd) {
    const sfdxDebugSessionId = uuid.v4();
    const debugConfiguration = {
        sfdxDebugSessionId,
        type: 'node',
        request: 'launch',
        name: 'Debug LWC test(s)',
        cwd,
        runtimeExecutable: command,
        args,
        resolveSourceMapLocations: ['**', '!**/node_modules/**'],
        console: 'integratedTerminal',
        internalConsoleOptions: 'openOnSessionStart',
        port: 9229,
        disableOptimisticBPs: true
    };
    return debugConfiguration;
}
exports.getDebugConfiguration = getDebugConfiguration;
/**
 * Start a debug session with provided test execution information
 * @param testExecutionInfo test execution information
 */
function forceLwcTestDebug(testExecutionInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const testRunner = new testRunner_1.TestRunner(testExecutionInfo, "debug" /* DEBUG */);
        const shellExecutionInfo = testRunner.getShellExecutionInfo();
        if (shellExecutionInfo) {
            const { command, args, workspaceFolder, testResultFsPath } = shellExecutionInfo;
            testRunner.startWatchingTestResults(testResultFsPath);
            const debugConfiguration = getDebugConfiguration(command, args, workspaceFolder.uri.fsPath);
            yield vscode.debug.startDebugging(workspaceFolder, debugConfiguration);
        }
    });
}
exports.forceLwcTestDebug = forceLwcTestDebug;
/**
 * Debug an individual test case
 * @param data a test explorer node or information provided by code lens
 */
function forceLwcTestCaseDebug(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { testExecutionInfo } = data;
        yield forceLwcTestDebug(testExecutionInfo);
    });
}
exports.forceLwcTestCaseDebug = forceLwcTestCaseDebug;
/**
 * Debug a test file
 * @param data a test explorer node
 */
function forceLwcTestFileDebug(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { testExecutionInfo } = data;
        yield forceLwcTestDebug(testExecutionInfo);
    });
}
exports.forceLwcTestFileDebug = forceLwcTestFileDebug;
/**
 * Debug the test of currently focused editor
 */
function forceLwcTestDebugActiveTextEditorTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const { activeTextEditor } = vscode.window;
        if (activeTextEditor && utils_1.isLwcJestTest(activeTextEditor.document)) {
            const testExecutionInfo = {
                kind: "testFile" /* TEST_FILE */,
                testType: "lwc" /* LWC */,
                testUri: activeTextEditor.document.uri
            };
            yield forceLwcTestFileDebug({ testExecutionInfo });
        }
    });
}
exports.forceLwcTestDebugActiveTextEditorTest = forceLwcTestDebugActiveTextEditorTest;
/**
 * Log the start time of debug session
 * @param session debug session
 */
function handleDidStartDebugSession(session) {
    const { configuration } = session;
    const { sfdxDebugSessionId } = configuration;
    const startTime = process.hrtime();
    debugSessionStartTimes.set(sfdxDebugSessionId, startTime);
}
exports.handleDidStartDebugSession = handleDidStartDebugSession;
/**
 * Send telemetry event if applicable when debug session ends
 * @param session debug session
 */
function handleDidTerminateDebugSession(session) {
    const { configuration } = session;
    const startTime = debugSessionStartTimes.get(configuration.sfdxDebugSessionId);
    if (Array.isArray(startTime)) {
        telemetry_1.telemetryService.sendCommandEvent(constants_1.FORCE_LWC_TEST_DEBUG_LOG_NAME, startTime, {
            workspaceType: workspaceService_1.workspaceService.getCurrentWorkspaceTypeForTelemetry()
        });
    }
}
exports.handleDidTerminateDebugSession = handleDidTerminateDebugSession;
//# sourceMappingURL=forceLwcTestDebugAction.js.map