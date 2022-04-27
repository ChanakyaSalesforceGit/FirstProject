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
const jest_regex_util_1 = require("jest-regex-util");
const path = require("path");
const uuid = require("uuid");
const messages_1 = require("../../messages");
const telemetry_1 = require("../../telemetry");
const workspace_1 = require("../workspace");
const taskService_1 = require("./taskService");
const testResultsWatcher_1 = require("./testResultsWatcher");
var TestRunType;
(function (TestRunType) {
    TestRunType["RUN"] = "run";
    TestRunType["DEBUG"] = "debug";
    TestRunType["WATCH"] = "watch";
})(TestRunType = exports.TestRunType || (exports.TestRunType = {}));
/**
 * Returns relative path for Jest runTestsByPath on Windows
 * or absolute path on other systems
 * @param cwd
 * @param testFsPath
 */
function normalizeRunTestsByPath(cwd, testFsPath) {
    if (/^win32/.test(process.platform)) {
        return path.relative(cwd, testFsPath);
    }
    return testFsPath;
}
exports.normalizeRunTestsByPath = normalizeRunTestsByPath;
/**
 * Test Runner class for running/debugging/watching Jest tests.
 */
class TestRunner {
    /**
     * Create a test runner from test execution info.
     * @param testExecutionInfo Test Execution information
     * @param testRunType Run, Watch or Debug
     * @param logName Telemetry log name. If specified we will send command telemetry event when task finishes
     */
    constructor(testExecutionInfo, testRunType, logName) {
        this.testRunId = uuid.v4();
        this.testExecutionInfo = testExecutionInfo;
        this.testRunType = testRunType;
        this.logName = logName;
    }
    /**
     * Deterine jest command line arguments and output file path.
     * @param workspaceFolder workspace folder of the test
     */
    getJestExecutionInfo(workspaceFolder) {
        const { testRunId, testRunType, testExecutionInfo } = this;
        const testName = 'testName' in testExecutionInfo ? testExecutionInfo.testName : undefined;
        const { kind, testUri } = testExecutionInfo;
        const { fsPath: testFsPath } = testUri;
        const tempFolder = testResultsWatcher_1.testResultsWatcher.getTempFolder(workspaceFolder, testExecutionInfo);
        const testResultFileName = `test-result-${testRunId}.json`;
        const outputFilePath = path.join(tempFolder, testResultFileName);
        // Specify --runTestsByPath if running test on individual files
        let runTestsByPathArgs;
        if (kind === "testFile" /* TEST_FILE */ || kind === "testCase" /* TEST_CASE */) {
            const workspaceFolderFsPath = workspaceFolder.uri.fsPath;
            runTestsByPathArgs = [
                '--runTestsByPath',
                normalizeRunTestsByPath(workspaceFolderFsPath, testFsPath)
            ];
        }
        else {
            runTestsByPathArgs = [];
        }
        const testNamePatternArgs = testName
            ? ['--testNamePattern', `"${jest_regex_util_1.escapeStrForRegex(testName)}"`]
            : [];
        let runModeArgs;
        if (testRunType === "watch" /* WATCH */) {
            runModeArgs = ['--watch'];
        }
        else {
            runModeArgs = [];
        }
        const args = [
            ...runModeArgs,
            '--json',
            '--outputFile',
            outputFilePath,
            '--testLocationInResults',
            ...runTestsByPathArgs,
            ...testNamePatternArgs
        ];
        return {
            jestArgs: args,
            jestOutputFilePath: outputFilePath
        };
    }
    /**
     * Generate shell execution info necessary for task execution
     */
    getShellExecutionInfo() {
        const workspaceFolder = workspace_1.getTestWorkspaceFolder(this.testExecutionInfo.testUri);
        if (workspaceFolder) {
            const jestExecutionInfo = this.getJestExecutionInfo(workspaceFolder);
            if (jestExecutionInfo) {
                const { jestArgs, jestOutputFilePath } = jestExecutionInfo;
                const cwd = workspaceFolder.uri.fsPath;
                const lwcTestRunnerExecutable = workspace_1.getLwcTestRunnerExecutable(cwd);
                const cliArgs = workspace_1.getCliArgsFromJestArgs(jestArgs, this.testRunType);
                if (lwcTestRunnerExecutable) {
                    return {
                        workspaceFolder,
                        command: lwcTestRunnerExecutable,
                        args: cliArgs,
                        testResultFsPath: jestOutputFilePath
                    };
                }
            }
        }
    }
    /**
     * Start watching test results if needed
     * @param testResultFsPath test result file path
     */
    startWatchingTestResults(testResultFsPath) {
        testResultsWatcher_1.testResultsWatcher.watchTestResults(testResultFsPath);
    }
    getTaskName() {
        // Only run and watch uses tasks for execution
        switch (this.testRunType) {
            case "run" /* RUN */:
                return messages_1.nls.localize('run_test_task_name');
            case "watch" /* WATCH */:
                return messages_1.nls.localize('watch_test_task_name');
            default:
                return messages_1.nls.localize('default_task_name');
        }
    }
    /**
     * Create and start a task for test execution.
     * Returns the task wrapper on task creation if successful.
     */
    executeAsSfdxTask() {
        return __awaiter(this, void 0, void 0, function* () {
            const shellExecutionInfo = this.getShellExecutionInfo();
            if (shellExecutionInfo) {
                const { command, args, workspaceFolder, testResultFsPath } = shellExecutionInfo;
                this.startWatchingTestResults(testResultFsPath);
                const taskName = this.getTaskName();
                const sfdxTask = taskService_1.taskService.createTask(this.testRunId, taskName, workspaceFolder, command, args);
                if (this.logName) {
                    const startTime = process.hrtime();
                    sfdxTask.onDidEnd(() => {
                        telemetry_1.telemetryService.sendCommandEvent(this.logName, startTime, {
                            workspaceType: workspace_1.workspaceService.getCurrentWorkspaceTypeForTelemetry()
                        });
                    });
                }
                return sfdxTask.execute();
            }
        });
    }
}
exports.TestRunner = TestRunner;
//# sourceMappingURL=testRunner.js.map